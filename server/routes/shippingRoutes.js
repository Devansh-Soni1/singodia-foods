import express from 'express';
import {
  calculateShippingRate,
  createShipmentOrder,
  trackShipment,
  cancelShipment,
  isConfigured
} from '../services/ithinkLogisticsService.js';
import Order from '../models/Order.js';

const router = express.Router();

// GET /api/shipping/status - Check if iThink Logistics is integrated
router.get('/status', (req, res) => {
  res.json({
    success: true,
    provider: 'iThink Logistics',
    isIntegrated: isConfigured(),
    warehousePincode: process.env.ITHINK_LOGISTICS_FROM_PINCODE || '302001',
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

// POST /api/shipping/generate-awb/:orderId - Generate AWB & Dispatch order
router.post('/generate-awb/:orderId', async (req, res) => {
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
      order.carrier = shipmentResult.courierName || 'iThink Logistics Express';
      order.orderStatus = 'Dispatched';
      order.shipping = {
        carrier: shipmentResult.courierName || 'iThink Logistics Express',
        trackingNumber: shipmentResult.waybill,
        trackingUrl: `https://my.ithinklogistics.com/track/${shipmentResult.waybill}`,
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
    const trackingInfo = await trackShipment(req.params.waybill);
    res.json(trackingInfo);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/shipping/cancel/:waybill - Cancel shipment
router.post('/cancel/:waybill', async (req, res) => {
  try {
    const result = await cancelShipment(req.params.waybill);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

