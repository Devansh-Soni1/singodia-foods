import mongoose from 'mongoose';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { createShipmentOrder, cancelShipment, trackShipment } from '../services/ithinkLogisticsService.js';
import { sendOrderConfirmationEmail, sendOrderDeliveredEmail } from '../services/emailService.js';
import { notifyNewOrder } from '../services/telegramService.js';

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
      paymentMethod = 'razorpay',
      customerNotes = ''
    } = req.body;

    if (paymentMethod === 'cod') {
      return res.status(400).json({
        success: false,
        message: 'Cash on Delivery (COD) band kar diya gaya hai. Kripya 100% secure online payment (Razorpay / UPI) se order karein.'
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items cannot be empty' });
    }

    if (!customer?.name || !customer?.email || !customer?.phone) {
      return res.status(400).json({ success: false, message: 'Please provide full customer contact details' });
    }

    // Strict 10-digit Indian Mobile Number Validation
    const cleanPhone = String(customer.phone).trim().replace(/^(\+91|91|0)/, '').replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        message: 'डिलीवरी और WhatsApp ट्रैकिंग अपडेट्स के लिए 10-अंकों का मान्य भारतीय मोबाइल नंबर (उदा. 9876543210) अनिवार्य है।'
      });
    }
    customer.phone = cleanPhone;
    if (shippingAddress) shippingAddress.phone = cleanPhone;

    // Auto-update user's saved profile phone if logged in
    if (req.user && (!req.user.phone || req.user.phone !== cleanPhone)) {
      User.findByIdAndUpdate(req.user._id, { phone: cleanPhone }).catch(() => {});
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

    if (paymentMethod === 'razorpay') {
      if (!razorpay) {
        console.error('Razorpay keys not configured on server (RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET missing)');
        return res.status(500).json({ 
          success: false, 
          message: 'Payment gateway par sampark nahi ho paya. Kripya thodi der baad dubara koshish karein ya customer care (+91 75979 66707) par sampark karein.' 
        });
      }

      try {
        const rzpOrder = await razorpay.orders.create({
          amount: Math.round(calculatedTotal * 100), // amount in paise
          currency: 'INR',
          receipt: orderNumber,
          notes: {
            customerName: customer.name,
            customerPhone: customer.phone,
            orderNumber: orderNumber
          }
        });
        razorpayOrderId = rzpOrder.id;
      } catch (rzpErr) {
        console.error('Razorpay Order Creation Error:', rzpErr);
        return res.status(500).json({ 
          success: false, 
          message: `Online payment initiate nahi ho paya: ${rzpErr.error?.description || rzpErr.message || 'Payment gateway par error aayi'}. Kripya dubara koshish karein ya help desk (+91 75979 66707) par sampark karein.` 
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

    // Auto-save customer details & default delivery address into MongoDB database
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
        } else {
          // If user exists, ensure address is saved and updated as default if first or selected
          const addrList = existingUser.addresses || [];
          const existingAddrIndex = addrList.findIndex(a => 
            String(a.pincode).trim() === String(shippingAddress.pincode).trim() &&
            a.addressLine1?.toLowerCase().trim() === shippingAddress.addressLine1?.toLowerCase().trim()
          );

          const isFirstAddress = addrList.length === 0;
          const makeDefault = isFirstAddress || shippingAddress.isDefault !== false;

          if (makeDefault) {
            addrList.forEach(a => { a.isDefault = false; });
          }

          if (existingAddrIndex >= 0) {
            // Update existing address fields
            addrList[existingAddrIndex].fullName = customer.name;
            addrList[existingAddrIndex].phone = customer.phone;
            addrList[existingAddrIndex].addressLine2 = shippingAddress.addressLine2 || addrList[existingAddrIndex].addressLine2 || '';
            addrList[existingAddrIndex].landmark = shippingAddress.landmark || addrList[existingAddrIndex].landmark || '';
            addrList[existingAddrIndex].city = shippingAddress.city;
            addrList[existingAddrIndex].state = shippingAddress.state;
            if (makeDefault) addrList[existingAddrIndex].isDefault = true;
          } else {
            // Add new address
            addrList.push({
              fullName: customer.name,
              phone: customer.phone,
              addressLine1: shippingAddress.addressLine1,
              addressLine2: shippingAddress.addressLine2 || '',
              landmark: shippingAddress.landmark || '',
              city: shippingAddress.city,
              state: shippingAddress.state,
              pincode: shippingAddress.pincode,
              isDefault: makeDefault
            });
          }

          if (customer.phone && (!existingUser.phone || existingUser.phone !== customer.phone)) {
            existingUser.phone = customer.phone;
          }
          existingUser.addresses = addrList;
          await existingUser.save();
        }
        if (existingUser && !orderData.user) {
          orderData.user = existingUser._id;
        }
      } catch (custErr) {
        console.warn('Customer address auto-save notice:', custErr.message);
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

    // For Cash on Delivery (COD) orders: trigger instant Telegram alert, email confirmation, and iThink shipment creation
    if (paymentMethod === 'cod') {
      try {
        const shipRes = await createShipmentOrder(order);
        if (shipRes?.success && shipRes.waybill) {
          order.trackingNumber = shipRes.waybill;
          order.carrier = shipRes.courierName || 'Express Courier Service';
          order.shipping = {
            carrier: shipRes.courierName || 'Express Courier Service',
            trackingNumber: shipRes.waybill,
            trackingUrl: shipRes.trackingUrl || `https://www.ithinklogistics.co.in/postship/tracking/${shipRes.waybill}`,
            dispatchedAt: new Date()
          };
          if (mongoose.connection.readyState === 1 && typeof order.save === 'function') {
            await order.save();
          }
        }
      } catch (shipErr) {
        console.warn('[COD Order] Auto iThink shipment notice:', shipErr.message);
      }

      sendOrderConfirmationEmail(order).catch(emailErr => {
        console.warn('[COD Order] Order confirmation email notice:', emailErr.message);
      });
      notifyNewOrder(order).catch(tgErr => {
        console.warn('[COD Order] Telegram new order alert notice:', tgErr.message);
      });
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
      const orConditions = [];
      if (orderId && mongoose.Types.ObjectId.isValid(orderId)) {
        orConditions.push({ _id: orderId });
      }
      if (orderId) {
        orConditions.push({ orderNumber: orderId });
      }
      if (razorpayOrderId) {
        orConditions.push({ razorpayOrderId: razorpayOrderId });
      }

      order = await Order.findOne(orConditions.length > 0 ? { $or: orConditions } : { _id: null });

      // Fallback: If order was missing or prematurely discarded, reconstruct from Razorpay!
      if (!order && razorpayOrderId) {
        const razorpay = getRazorpayInstance();
        if (razorpay) {
          try {
            const rzpOrd = await razorpay.orders.fetch(razorpayOrderId);
            if (rzpOrd) {
              const userObj = req.user ? await User.findById(req.user._id) : null;
              const defaultAddr = userObj?.addresses?.find(a => a.isDefault) || userObj?.addresses?.[0] || {};
              const calcAmt = (rzpOrd.amount || 28900) / 100;
              order = await Order.create({
                orderNumber: rzpOrd.receipt || generateOrderNumber(),
                user: req.user?._id || userObj?._id || null,
                customer: {
                  name: rzpOrd.notes?.customerName || userObj?.name || 'Customer',
                  email: userObj?.email || 'bajrangsingodia10@gmail.com',
                  phone: rzpOrd.notes?.customerPhone || userObj?.phone || '8005600978'
                },
                shippingAddress: {
                  fullName: rzpOrd.notes?.customerName || defaultAddr.fullName || 'Customer',
                  addressLine1: defaultAddr.addressLine1 || 'Delivery Address',
                  addressLine2: defaultAddr.addressLine2 || '',
                  landmark: defaultAddr.landmark || '',
                  city: defaultAddr.city || 'Churu',
                  district: defaultAddr.district || defaultAddr.city || 'Churu',
                  state: defaultAddr.state || 'Rajasthan',
                  pincode: defaultAddr.pincode || '331001'
                },
                items: [{
                  name: 'Homemade Pickles',
                  weight: '250g',
                  price: calcAmt,
                  quantity: 1,
                  itemTotal: calcAmt
                }],
                subtotal: calcAmt,
                totalAmount: calcAmt,
                paymentMethod: 'razorpay',
                paymentStatus: 'completed',
                razorpayOrderId,
                razorpayPaymentId,
                razorpaySignature,
                orderStatus: 'Processing',
                createdAt: new Date()
              });
            }
          } catch (e) {
            console.warn('Order reconstruction from Razorpay notice:', e.message);
          }
        }
      }

      if (order) {
        order.paymentStatus = 'completed';
        order.razorpayPaymentId = razorpayPaymentId;
        order.razorpaySignature = razorpaySignature;
        order.orderStatus = 'Processing';

        // Auto-create shipment with iThink Logistics on verified payment
        try {
          const shipRes = await createShipmentOrder(order);
          if (shipRes?.success && shipRes.waybill) {
            order.trackingNumber = shipRes.waybill;
            order.carrier = shipRes.courierName || 'Express Courier Service';
            order.orderStatus = 'Dispatched';
            order.shipping = {
              carrier: shipRes.courierName || 'Express Courier Service',
              trackingNumber: shipRes.waybill,
              trackingUrl: shipRes.trackingUrl || `https://www.ithinklogistics.co.in/postship/tracking/${shipRes.waybill}`,
              dispatchedAt: new Date()
            };
          }
        } catch (shipErr) {
          console.warn('Auto iThink online shipment notice:', shipErr.message);
        }

        await order.save();

        // Send Order Confirmation Email & Telegram Alert asynchronously
        sendOrderConfirmationEmail(order).catch(emailErr => {
          console.warn('[VerifyPayment] Order confirmation email notice:', emailErr.message);
        });
        notifyNewOrder(order).catch(tgErr => {
          console.warn('[VerifyPayment] Telegram new order alert notice:', tgErr.message);
        });
      }
    } else {
      order = memoryOrders.find(o => o.orderNumber === orderId || o.razorpayOrderId === razorpayOrderId);
      if (order) {
        order.paymentStatus = 'completed';
        order.razorpayPaymentId = razorpayPaymentId;
        sendOrderConfirmationEmail(order).catch(() => {});
        notifyNewOrder(order).catch(() => {});
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

    const orderObj = order.toObject ? order.toObject() : { ...order };

    // Security check: Only Admin or the Order Owner can view unmasked full contact info
    const isAdmin = req.user?.role === 'admin';
    const isOwner = req.user && (
      (orderObj.user?._id && orderObj.user._id.toString() === req.user._id.toString()) ||
      (orderObj.user && orderObj.user.toString() === req.user._id.toString()) ||
      (orderObj.customer?.email && orderObj.customer.email.toLowerCase() === req.user.email?.toLowerCase())
    );

    if (!isAdmin && !isOwner) {
      // Mask sensitive contact details for unauthorized viewers/scrapers
      if (orderObj.customer?.phone) {
        const ph = String(orderObj.customer.phone);
        orderObj.customer.phone = ph.length > 4 ? `******${ph.slice(-4)}` : '******';
      }
      if (orderObj.customer?.email) {
        const parts = orderObj.customer.email.split('@');
        orderObj.customer.email = parts[0].slice(0, 2) + '***@' + (parts[1] || 'domain.com');
      }
      if (orderObj.shippingAddress?.addressLine1) {
        orderObj.shippingAddress.addressLine1 = '*** (सुरक्षित)';
      }
      if (orderObj.shippingAddress?.addressLine2) {
        orderObj.shippingAddress.addressLine2 = '';
      }
    }

    res.json({
      success: true,
      order: orderObj
    });
  } catch (error) {
    next(error);
  }
};

// Auto-cleanup stale abandoned pending orders (> 20 minutes old with unpaid status)
// Safety First: Checks Razorpay status so a paid customer's order is NEVER mistakenly deleted
export const cleanupStalePendingOrders = async () => {
  if (mongoose.connection.readyState !== 1) return;
  try {
    const cutoff = new Date(Date.now() - 20 * 60 * 1000);
    const staleOrders = await Order.find({
      paymentStatus: 'pending',
      createdAt: { $lt: cutoff }
    });

    const razorpay = getRazorpayInstance();

    for (const ord of staleOrders) {
      // Check Razorpay if payment was actually captured before deleting!
      if (razorpay && ord.razorpayOrderId) {
        try {
          const rzpOrd = await razorpay.orders.fetch(ord.razorpayOrderId);
          if (rzpOrd && (rzpOrd.status === 'paid' || rzpOrd.attempts > 0)) {
            const payments = await razorpay.orders.fetchPayments(ord.razorpayOrderId);
            const captured = payments?.items?.find(p => p.status === 'captured');
            if (captured) {
              ord.paymentStatus = 'completed';
              ord.razorpayPaymentId = captured.id;
              ord.orderStatus = 'Processing';
              await ord.save();

              createShipmentOrder(ord).catch(() => {});
              sendOrderConfirmationEmail(ord).catch(() => {});
              notifyNewOrder(ord).catch(() => {});
              continue; // Preserved safely!
            }
          }
        } catch (rzpErr) {
          console.warn('Razorpay check during stale cleanup notice:', rzpErr.message);
        }
      }

      // Revert product inventory for abandoned order
      if (Array.isArray(ord.items)) {
        for (const item of ord.items) {
          if (item.product && mongoose.Types.ObjectId.isValid(item.product)) {
            try {
              const dbProduct = await Product.findById(item.product);
              if (dbProduct && Array.isArray(dbProduct.variants)) {
                const variant = dbProduct.variants.find(v => v.weight === item.weight) || dbProduct.variants[0];
                if (variant) {
                  variant.stockCount = (variant.stockCount || 0) + (item.quantity || 1);
                  if (variant.stockCount > 0) variant.inStock = true;
                  await dbProduct.save();
                }
              }
            } catch (e) {}
          }
        }
      }
      await Order.deleteOne({ _id: ord._id });
    }
  } catch (err) {
    console.warn('Stale order auto-cleanup notice:', err.message);
  }
};

// Discard order immediately when payment fails, is declined, or dismissed by user
export const discardPendingOrder = async (req, res, next) => {
  try {
    const { orderId, razorpayOrderId } = req.body;
    if (!orderId && !razorpayOrderId) {
      return res.status(400).json({ success: false, message: 'Order reference is required' });
    }

    if (mongoose.connection.readyState === 1) {
      const orConditions = [];
      if (orderId && mongoose.Types.ObjectId.isValid(orderId)) {
        orConditions.push({ _id: orderId });
      }
      if (orderId) {
        orConditions.push({ orderNumber: orderId });
      }
      if (razorpayOrderId) {
        orConditions.push({ razorpayOrderId: razorpayOrderId });
      }

      const order = await Order.findOne({
        $or: orConditions,
        paymentStatus: { $ne: 'completed' } // Never delete an already paid order!
      });

      if (order) {
        // Double check Razorpay so we never delete if user paid on UPI!
        const razorpay = getRazorpayInstance();
        if (razorpay && order.razorpayOrderId) {
          try {
            const rzpOrd = await razorpay.orders.fetch(order.razorpayOrderId);
            if (rzpOrd && rzpOrd.status === 'paid') {
              order.paymentStatus = 'completed';
              order.orderStatus = 'Processing';
              await order.save();
              return res.json({ success: true, message: 'Order was paid on gateway and preserved.' });
            }
          } catch (e) {}
        }

        // Revert product inventory
        if (Array.isArray(order.items)) {
          for (const item of order.items) {
            if (item.product && mongoose.Types.ObjectId.isValid(item.product)) {
              try {
                const dbProduct = await Product.findById(item.product);
                if (dbProduct && Array.isArray(dbProduct.variants)) {
                  const variant = dbProduct.variants.find(v => v.weight === item.weight) || dbProduct.variants[0];
                  if (variant) {
                    variant.stockCount = (variant.stockCount || 0) + (item.quantity || 1);
                    if (variant.stockCount > 0) variant.inStock = true;
                    await dbProduct.save();
                  }
                }
              } catch (e) {
                console.warn('Revert stock error:', e.message);
              }
            }
          }
        }

        await Order.deleteOne({ _id: order._id });
      }
    } else {
      memoryOrders = memoryOrders.filter(o => 
        (o._id?.toString() !== orderId && o.orderNumber !== orderId && o.razorpayOrderId !== razorpayOrderId) || 
        o.paymentStatus === 'completed'
      );
    }

    res.json({
      success: true,
      message: 'Unpaid pending/failed order discarded and inventory reverted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getUserOrders = async (req, res, next) => {
  try {
    let orders = [];
    if (mongoose.connection.readyState === 1) {
      // Background check: If user has any pending orders, check Razorpay in case UPI completed
      const razorpay = getRazorpayInstance();
      if (razorpay) {
        try {
          const pendingOrders = await Order.find({ 
            $or: [
              { user: req.user._id },
              { 'customer.email': req.user.email?.toLowerCase().trim() }
            ],
            paymentStatus: 'pending' 
          });

          for (const pOrd of pendingOrders) {
            if (pOrd.razorpayOrderId) {
              const rzpOrd = await razorpay.orders.fetch(pOrd.razorpayOrderId);
              if (rzpOrd && rzpOrd.status === 'paid') {
                const payments = await razorpay.orders.fetchPayments(pOrd.razorpayOrderId);
                const captured = payments?.items?.find(p => p.status === 'captured');
                pOrd.paymentStatus = 'completed';
                if (captured) pOrd.razorpayPaymentId = captured.id;
                pOrd.orderStatus = 'Processing';
                await pOrd.save();

                createShipmentOrder(pOrd).catch(() => {});
                sendOrderConfirmationEmail(pOrd).catch(() => {});
                notifyNewOrder(pOrd).catch(() => {});
              }
            }
          }
        } catch (checkErr) {
          console.warn('Pending order check on my-orders notice:', checkErr.message);
        }
      }

      // Match orders by User ID, email, or verified phone
      const userConditions = [
        { user: req.user._id }
      ];
      if (req.user.email) {
        userConditions.push({ 'customer.email': req.user.email.toLowerCase().trim() });
      }
      if (req.user.phone) {
        const cleanUserPhone = String(req.user.phone).trim().replace(/^(\+91|91|0)/, '').replace(/\D/g, '');
        if (cleanUserPhone) {
          userConditions.push({ 'customer.phone': cleanUserPhone });
        }
      }

      orders = await Order.find({ 
        $or: userConditions,
        paymentStatus: { $in: ['completed', 'refunded'] }
      }).sort({ createdAt: -1 });
    } else {
      orders = memoryOrders.filter(o => 
        (o.user?.toString() === req.user._id.toString() || o.customer?.email === req.user.email) &&
        o.paymentStatus === 'completed'
      );
    }

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// Razorpay Webhook Handler for 100% reliable asynchronous order capture
export const handleRazorpayWebhook = async (req, res, next) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];

    if (secret && signature) {
      const shasum = crypto.createHmac('sha256', secret);
      shasum.update(typeof req.body === 'string' ? req.body : JSON.stringify(req.body));
      const digest = shasum.digest('hex');
      if (digest !== signature) {
        return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
      }
    }

    const event = req.body.event;
    const payload = req.body.payload;

    if (event === 'order.paid' || event === 'payment.captured') {
      const paymentEntity = payload.payment?.entity;
      const orderEntity = payload.order?.entity;
      const rzpOrderId = paymentEntity?.order_id || orderEntity?.id;
      const rzpPaymentId = paymentEntity?.id;

      if (rzpOrderId && mongoose.connection.readyState === 1) {
        let order = await Order.findOne({ razorpayOrderId: rzpOrderId });
        if (order && order.paymentStatus !== 'completed') {
          order.paymentStatus = 'completed';
          order.razorpayPaymentId = rzpPaymentId || order.razorpayPaymentId;
          order.orderStatus = 'Processing';

          try {
            const shipRes = await createShipmentOrder(order);
            if (shipRes?.success && shipRes.waybill) {
              order.trackingNumber = shipRes.waybill;
              order.carrier = shipRes.courierName || 'Express Courier Service';
              order.orderStatus = 'Dispatched';
            }
          } catch (e) {}

          await order.save();
          sendOrderConfirmationEmail(order).catch(() => {});
          notifyNewOrder(order).catch(() => {});
        }
      }
    }

    res.json({ status: 'ok' });
  } catch (error) {
    console.error('Razorpay Webhook Error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    // Run background cleanup for any stale abandoned checkouts
    cleanupStalePendingOrders().catch(() => {});

    const { status, page = 1, limit = 20 } = req.query;
    // Strictly filter: ONLY paid completed orders show in admin panel
    const query = { paymentStatus: 'completed' };
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
      let filtered = memoryOrders.filter(o => o.paymentStatus === 'completed');
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
    let ithinkCancelNotice = '';

    if (mongoose.connection.readyState === 1) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        order = await Order.findById(id);
      }
      if (!order) {
        order = await Order.findOne({ orderNumber: id });
      }

      if (order) {
        const previousStatus = order.orderStatus;
        if (orderStatus) order.orderStatus = orderStatus;
        if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
        if (courierPartner !== undefined) order.courierPartner = courierPartner;

        // Auto-cancel on iThink Logistics if marked as Cancelled
        if (orderStatus && orderStatus.toLowerCase() === 'cancelled' && previousStatus?.toLowerCase() !== 'cancelled') {
          const waybill = order.trackingNumber || order.shipping?.trackingNumber;
          if (waybill) {
            try {
              const cancelRes = await cancelShipment(waybill);
              console.log(`[iThink Logistics] Cancel shipment for order ${order.orderNumber} (AWB: ${waybill}):`, cancelRes);
              ithinkCancelNotice = cancelRes.message || 'Cancelled on iThink';
            } catch (cErr) {
              console.warn('[iThink Logistics] Cancel notice:', cErr.message);
              ithinkCancelNotice = cErr.message;
            }
          }

          // Restore product inventory stock
          if (Array.isArray(order.items)) {
            for (const item of order.items) {
              if (item.product && mongoose.Types.ObjectId.isValid(item.product)) {
                try {
                  const dbProduct = await Product.findById(item.product);
                  if (dbProduct && Array.isArray(dbProduct.variants)) {
                    const variant = dbProduct.variants.find(v => v.weight === item.weight) || dbProduct.variants[0];
                    if (variant) {
                      variant.stockCount = (variant.stockCount || 0) + (item.quantity || 1);
                      if (variant.stockCount > 0) variant.inStock = true;
                      await dbProduct.save();
                    }
                  }
                } catch (e) {
                  console.warn('Revert stock error:', e.message);
                }
              }
            }
          }
        }

        // If newly marked as Delivered, send Order Delivered Email
        if (orderStatus && orderStatus.toLowerCase() === 'delivered' && previousStatus?.toLowerCase() !== 'delivered') {
          sendOrderDeliveredEmail(order).catch(emailErr => {
            console.warn('[UpdateOrderStatus] Delivered email notice:', emailErr.message);
          });
        }

        await order.save();
      }
    } else {
      order = memoryOrders.find(o => o._id?.toString() === id || o.orderNumber === id);
      if (order) {
        const previousStatus = order.orderStatus;
        if (orderStatus) order.orderStatus = orderStatus;
        if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
        if (courierPartner !== undefined) order.courierPartner = courierPartner;

        if (orderStatus && orderStatus.toLowerCase() === 'cancelled' && previousStatus?.toLowerCase() !== 'cancelled') {
          const waybill = order.trackingNumber || order.shipping?.trackingNumber;
          if (waybill) {
            cancelShipment(waybill).catch(() => {});
          }
        }

        if (orderStatus && orderStatus.toLowerCase() === 'delivered' && previousStatus?.toLowerCase() !== 'delivered') {
          sendOrderDeliveredEmail(order).catch(() => {});
        }
      }
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({
      success: true,
      message: ithinkCancelNotice 
        ? `Order cancelled successfully. iThink Logistics notice: ${ithinkCancelNotice}` 
        : 'Order updated successfully',
      order
    });
  } catch (error) {
    next(error);
  }
};

