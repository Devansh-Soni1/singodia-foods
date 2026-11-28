import express from 'express';
import {
  calculateShippingRate,
  createShipmentOrder,
  trackShipment,
  cancelShipment,
  isConfigured
} from '../services/ithinkLogisticsService.js';
import Order from '../models/Order.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// GET /api/shipping/status - Check if iThink Logistics is integrated
router.get('/status', (req, res) => {
  res.json({
    success: true,
    provider: 'iThink Logistics',
    isIntegrated: isConfigured(),
    warehousePincode: process.env.ITHINK_LOGISTICS_FROM_PINCODE || '331507',
    mode: process.env.NODE_ENV === 'production' ? 'Production' : 'Staging / Simulated'
  });
});

// POST /api/shipping/calculate-rate - Calculate shipping rate for pincode & cart
router.post('/calculate-rate', async (req, res) => {
  try {
    const { toPincode, weight, paymentMethod } = req.body;
    if (!toPincode) {
      return res.status(400).json({ success: false, message: 'Destination pincode is required' });
    }

    const rateResult = await calculateShippingRate({
      toPincode,
      weight: weight || 0.5,
      paymentMethod: paymentMethod || 'Prepaid'
    });

    res.json(rateResult);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/shipping/generate-awb/:orderId - Generate AWB & Dispatch order (Protected Admin)
router.post('/generate-awb/:orderId', protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.shipping?.trackingNumber || order.trackingNumber) {
      return res.status(400).json({
        success: false,
        message: 'AWB already generated for this order',
        trackingNumber: order.shipping?.trackingNumber || order.trackingNumber
      });
    }

    const shipmentResult = await createShipmentOrder(order);

    if (shipmentResult.success) {
      order.trackingNumber = shipmentResult.waybill;
      order.carrier = shipmentResult.courierName || 'Express Courier Service';
      order.orderStatus = 'Dispatched';
      order.shipping = {
        carrier: shipmentResult.courierName || 'Express Courier Service',
        trackingNumber: shipmentResult.waybill,
        trackingUrl: shipmentResult.trackingUrl || `https://www.ithinklogistics.co.in/postship/tracking/${shipmentResult.waybill}`,
        dispatchedAt: new Date()
      };
      await order.save();

      return res.json({
        success: true,
        message: 'Shipment created and AWB generated successfully via iThink Logistics',
        order,
        waybill: shipmentResult.waybill,
        courier: shipmentResult.courierName
      });
    }

    res.status(400).json({ success: false, message: shipmentResult.message });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/shipping/track/:waybill - Real-time tracking
router.get('/track/:waybill', async (req, res) => {
  try {
    const waybill = req.params.waybill;
    const order = await Order.findOne({
      $or: [
        { trackingNumber: waybill },
        { 'shipping.trackingNumber': waybill }
      ]
    });

    // If order was cancelled by seller/admin, immediately return clean Cancelled state
    if (order && order.orderStatus === 'Cancelled') {
      return res.json({
        success: true,
        waybill,
        currentStatus: 'Cancelled',
        courierName: order.courierPartner || order.carrier || 'Delhivery',
        lastLocation: 'Singodia Foods Kitchen, Sujangarh (331507)',
        expectedDeliveryDate: '',
        events: [
          { status: 'Order Placed', timestamp: order.createdAt },
          { status: 'Order Cancelled', timestamp: order.updatedAt, remark: 'Order has been cancelled by seller' }
        ],
        isSimulated: false
      });
    }

    const trackingInfo = await trackShipment(waybill);

    // Sync order status in database if live status changed
    if (trackingInfo && trackingInfo.currentStatus && order && order.orderStatus !== 'Cancelled') {
      try {
        const liveStatus = String(trackingInfo.currentStatus).toLowerCase();
        if (liveStatus.includes('deliver') && !liveStatus.includes('out') && order.orderStatus !== 'Delivered') {
          order.orderStatus = 'Delivered';
          await order.save();
        } else if (liveStatus.includes('out') && order.orderStatus !== 'Out for Delivery') {
          order.orderStatus = 'Out for Delivery';
          await order.save();
        } else if ((liveStatus.includes('transit') || liveStatus.includes('shipped') || liveStatus.includes('dispatch')) && order.orderStatus === 'Placed') {
          order.orderStatus = 'Shipped';
          await order.save();
        } else if (liveStatus.includes('cancel')) {
          order.orderStatus = 'Cancelled';
          await order.save();
        }
      } catch (syncErr) {
        console.warn('Live order status sync notice:', syncErr.message);
      }
    }

    res.json(trackingInfo);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/shipping/cancel/:waybill - Cancel shipment (Protected Admin)
router.post('/cancel/:waybill', protect, adminOnly, async (req, res) => {
  try {
    const waybill = req.params.waybill;
    const result = await cancelShipment(waybill);

    // Sync order status in DB to Cancelled
    const order = await Order.findOne({
      $or: [
        { trackingNumber: waybill },
        { 'shipping.trackingNumber': waybill }
      ]
    });

    if (order && order.orderStatus !== 'Cancelled') {
      order.orderStatus = 'Cancelled';
      await order.save();
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/shipping/webhook & POST /api/shipping/ithink-webhook - Real-time tracking updates from iThink Logistics
const handleIThinkWebhook = async (req, res) => {
  try {
    const payload = req.body || {};
    const waybill = payload.awb_number || payload.awb_numbers || payload.waybill || payload.tracking_number || payload.awb;
    const rawStatus = payload.current_status || payload.status || payload.order_status || '';
    const orderNo = payload.order_number || payload.order_id || payload.order_no;

    console.log('[iThink Logistics Webhook Received]:', { waybill, rawStatus, orderNo });

    if (waybill || orderNo) {
      const orConditions = [];
      if (waybill) {
        orConditions.push({ trackingNumber: String(waybill).trim() });
        orConditions.push({ 'shipping.trackingNumber': String(waybill).trim() });
      }
      if (orderNo) {
        orConditions.push({ orderNumber: String(orderNo).trim() });
      }

      const order = await Order.findOne({ $or: orConditions });
      if (order) {
        const stLower = String(rawStatus).toLowerCase();
        if (stLower.includes('cancel') || stLower.includes('rto')) {
          order.orderStatus = 'Cancelled';
          await order.save();
        } else if (stLower.includes('deliver') && !stLower.includes('out')) {
          order.orderStatus = 'Delivered';
          await order.save();
        } else if (stLower.includes('out')) {
          order.orderStatus = 'Out for Delivery';
          await order.save();
        } else if (stLower.includes('transit') || stLower.includes('shipped') || stLower.includes('dispatch')) {
          if (order.orderStatus === 'Placed') {
            order.orderStatus = 'Shipped';
            await order.save();
          }
        }
      }
    }

    res.json({ status: 'success', message: 'Webhook processed' });
  } catch (err) {
    console.error('iThink Webhook error:', err.message);
    res.status(500).json({ status: 'error', message: err.message });
  }
};

router.post('/webhook', handleIThinkWebhook);
router.post('/ithink-webhook', handleIThinkWebhook);

export default router;

