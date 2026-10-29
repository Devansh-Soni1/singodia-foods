import mongoose from 'mongoose';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { createShipmentOrder } from '../services/ithinkLogisticsService.js';

// In-memory fallback for orders when Mongo is not connected
let memoryOrders = [];

// Helper to generate Order Number
const generateOrderNumber = () => {
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `SGF-${dateStr}-${randomSuffix}`;
};

// Initialize Razorpay instance if keys are provided
const getRazorpayInstance = () => {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    return new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
  }
  return null;
};

export const createOrder = async (req, res, next) => {
  try {
    const { 
      items, 
      customer, 
      shippingAddress, 
      subtotal, 
      discount = 0, 
      couponCode = '', 
      shippingFee = 0, 
      paymentMethod = 'cod',
      customerNotes = ''
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items cannot be empty' });
    }

    if (!customer?.name || !customer?.email || !customer?.phone) {
      return res.status(400).json({ success: false, message: 'Please provide full customer contact details' });
    }

    if (!shippingAddress?.addressLine1 || !shippingAddress?.city || !shippingAddress?.pincode) {
      return res.status(400).json({ success: false, message: 'Please provide complete delivery address' });
    }

    // Strict stock verification before order placement
    if (mongoose.connection.readyState === 1) {
      for (const item of items) {
        if (item.product && mongoose.Types.ObjectId.isValid(item.product)) {
          const dbProduct = await Product.findById(item.product);
          if (dbProduct && Array.isArray(dbProduct.variants)) {
            const variant = dbProduct.variants.find(v => v.weight === item.weight) || dbProduct.variants[0];
            if (variant) {
              const availableStock = variant.stockCount !== undefined ? variant.stockCount : 50;
              if (variant.inStock === false || availableStock <= 0) {
                return res.status(400).json({
                  success: false,
                  message: `क्षमा करें, "${item.name} (${item.weight || ''})" फिलहाल आउट ऑफ स्टॉक (Out of Stock) है।`
                });
              }
              if (item.quantity > availableStock) {
                return res.status(400).json({
                  success: false,
                  message: `"${item.name} (${item.weight || ''})" का सिर्फ ${availableStock} यूनिट स्टॉक उपलब्ध है। कृपया कार्ट में संख्या घटाएं।`
                });
              }
            }
          }
        }
      }
    }

    const calculatedTotal = Math.max(0, Number(subtotal) - Number(discount) + Number(shippingFee));
    const orderNumber = generateOrderNumber();

    let razorpayOrderId = '';
    const razorpay = getRazorpayInstance();

    if (paymentMethod === 'razorpay' && razorpay) {
      try {
        const rzpOrder = await razorpay.orders.create({
          amount: Math.round(calculatedTotal * 100), // amount in paise
          currency: 'INR',
          receipt: orderNumber,
          notes: {
            customerName: customer.name,
            customerPhone: customer.phone
          }
        });
        razorpayOrderId = rzpOrder.id;
      } catch (rzpErr) {
        console.error('Razorpay Order Creation Error:', rzpErr);
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to initiate Razorpay transaction. You may choose Cash on Delivery instead.' 
        });
      }
    }

    const orderData = {
      orderNumber,
      user: req.user ? req.user._id : null,
      customer,
      shippingAddress,
      items: items.map(item => ({
        product: item.product || null,
        name: item.name,
        image: item.image || '/hero-banner.png',
        weight: item.weight || '500g',
        price: item.price,
        quantity: item.quantity,
        itemTotal: item.price * item.quantity
      })),
      subtotal: Number(subtotal),
      discount: Number(discount),
      couponCode,
      shippingFee: Number(shippingFee),
      totalAmount: calculatedTotal,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : (razorpayOrderId ? 'pending' : 'pending'),
      razorpayOrderId,
      orderStatus: 'Placed',
      customerNotes,
      createdAt: new Date()
    };

    // Auto-save customer details into MongoDB database if not already existing
    if (mongoose.connection.readyState === 1 && customer?.email) {
      try {
        let existingUser = await User.findOne({ email: customer.email.toLowerCase().trim() });
        if (!existingUser) {
          const tempPassword = 'User@' + Math.random().toString(36).slice(-8);
          existingUser = await User.create({
            name: customer.name,
            email: customer.email.toLowerCase().trim(),
            password: tempPassword,
            phone: customer.phone || '',
            role: 'customer',
            addresses: [{
              fullName: customer.name,
              phone: customer.phone,
              addressLine1: shippingAddress.addressLine1,
              addressLine2: shippingAddress.addressLine2 || '',
              landmark: shippingAddress.landmark || '',
              city: shippingAddress.city,
              state: shippingAddress.state,
              pincode: shippingAddress.pincode,
              isDefault: true
            }]
          });
        }
        if (existingUser && !orderData.user) {
          orderData.user = existingUser._id;
        }
      } catch (custErr) {
        console.warn('Customer auto-save in database notice:', custErr.message);
      }
    }

    let order = null;
    if (mongoose.connection.readyState === 1) {
      order = await Order.create(orderData);

      // Decrement stock in MongoDB for purchased items
      try {
        for (const item of items) {
          if (item.product && mongoose.Types.ObjectId.isValid(item.product)) {
            const dbProduct = await Product.findById(item.product);
            if (dbProduct && Array.isArray(dbProduct.variants)) {
              const variant = dbProduct.variants.find(v => v.weight === item.weight) || dbProduct.variants[0];
              if (variant) {
                const currentStock = variant.stockCount !== undefined ? variant.stockCount : 50;
                variant.stockCount = Math.max(0, currentStock - item.quantity);
                if (variant.stockCount <= 0) {
                  variant.inStock = false;
                }
                await dbProduct.save();
              }
            }
          }
        }
      } catch (stockErr) {
        console.warn('Stock decrement notice:', stockErr.message);
      }
    } else {
      order = { ...orderData, _id: new mongoose.Types.ObjectId() };
      memoryOrders.unshift(order);
    }

    // Auto-create shipment with iThink Logistics for COD orders
    if (order && paymentMethod === 'cod') {
      try {
        const shipRes = await createShipmentOrder(order);
        if (shipRes?.success && shipRes.waybill) {
          order.trackingNumber = shipRes.waybill;
          order.carrier = shipRes.courierName || 'iThink Logistics Express';
          order.shipping = {
            carrier: shipRes.courierName || 'iThink Logistics Express',
            trackingNumber: shipRes.waybill,
            trackingUrl: `https://my.ithinklogistics.com/track/${shipRes.waybill}`,
            dispatchedAt: new Date()
          };
          if (mongoose.connection.readyState === 1 && typeof order.save === 'function') {
            await order.save();
          }
        }
      } catch (shipErr) {
        console.warn('Auto iThink COD shipment notice:', shipErr.message);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder'
    });
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { 
      orderId, 
      razorpayOrderId, 
      razorpayPaymentId, 
      razorpaySignature 
    } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return res.status(500).json({ 
        success: false, 
        message: 'Razorpay secret key not configured on server' 
      });
    }

    // Verify cryptographic signature
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(`${razorpayOrderId}|${razorpayPaymentId}`);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature. Verification failed.' });
    }

    // Update order
    let order = null;
    if (mongoose.connection.readyState === 1) {
      order = await Order.findOne({
        $or: [{ _id: orderId }, { orderNumber: orderId }, { razorpayOrderId }]
      });
      if (order) {
        order.paymentStatus = 'completed';
        order.razorpayPaymentId = razorpayPaymentId;
        order.razorpaySignature = razorpaySignature;

        // Auto-create shipment with iThink Logistics on verified payment
        try {
          const shipRes = await createShipmentOrder(order);
          if (shipRes?.success && shipRes.waybill) {
            order.trackingNumber = shipRes.waybill;
            order.carrier = shipRes.courierName || 'iThink Logistics Express';
            order.orderStatus = 'Dispatched';
            order.shipping = {
              carrier: shipRes.courierName || 'iThink Logistics Express',
              trackingNumber: shipRes.waybill,
              trackingUrl: `https://my.ithinklogistics.com/track/${shipRes.waybill}`,
              dispatchedAt: new Date()
            };
          }
        } catch (shipErr) {
          console.warn('Auto iThink online shipment notice:', shipErr.message);
        }

        await order.save();
      }
    } else {
      order = memoryOrders.find(o => o.orderNumber === orderId || o.razorpayOrderId === razorpayOrderId);
      if (order) {
        order.paymentStatus = 'completed';
        order.razorpayPaymentId = razorpayPaymentId;
      }
    }

    res.json({
      success: true,
      message: 'Payment verified and confirmed successfully!',
      order
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let order = null;

    if (mongoose.connection.readyState === 1) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        order = await Order.findById(id).populate('user', 'name email');
      }
      if (!order) {
        order = await Order.findOne({ orderNumber: id });
      }
    } else {
      order = memoryOrders.find(o => o.orderNumber === id || o._id?.toString() === id);
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

export const getUserOrders = async (req, res, next) => {
  try {
    let orders = [];
    if (mongoose.connection.readyState === 1) {
      orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    } else {
      orders = memoryOrders.filter(o => o.user?.toString() === req.user._id.toString() || o.customer?.email === req.user.email);
    }

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status && status !== 'all') {
      query.orderStatus = status;
    }

    let orders = [];
    let total = 0;

    if (mongoose.connection.readyState === 1) {
      total = await Order.countDocuments(query);
      orders = await Order.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));
    } else {
      let filtered = [...memoryOrders];
      if (status && status !== 'all') {
        filtered = filtered.filter(o => o.orderStatus === status);
      }
      total = filtered.length;
      orders = filtered.slice((page - 1) * limit, page * limit);
    }

    res.json({
      success: true,
      orders,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit) || 1
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { orderStatus, trackingNumber, courierPartner } = req.body;

    let order = null;
    if (mongoose.connection.readyState === 1) {
      order = await Order.findById(id);
      if (order) {
        if (orderStatus) order.orderStatus = orderStatus;
        if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
        if (courierPartner !== undefined) order.courierPartner = courierPartner;
        await order.save();
      }
    } else {
      order = memoryOrders.find(o => o._id?.toString() === id || o.orderNumber === id);
      if (order) {
        if (orderStatus) order.orderStatus = orderStatus;
        if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
        if (courierPartner !== undefined) order.courierPartner = courierPartner;
      }
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({
      success: true,
      message: 'Order updated successfully',
      order
    });
  } catch (error) {
    next(error);
  }
};

