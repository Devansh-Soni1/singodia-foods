import axios from 'axios';

const ITHINK_BASE_URL = 'https://my.ithinklogistics.com';
const ITHINK_STAGING_URL = 'https://pre-alpha.ithinklogistics.com';

const getBaseUrl = () => {
  return process.env.ITHINK_API_URL || ITHINK_BASE_URL;
};

const getCredentials = () => {
  return {
    access_token: process.env.ITHINK_LOGISTICS_ACCESS_TOKEN || '',
    secret_key: process.env.ITHINK_LOGISTICS_SECRET_KEY || ''
  };
};

/**
 * Check if iThink credentials are configured
 */
export const isConfigured = () => {
  const { access_token, secret_key } = getCredentials();
  return Boolean(access_token && secret_key);
};

/**
 * Calculate Shipping Rates / Freight Estimate
 * @param {Object} params - { toPincode, weight, length, width, height, paymentMethod }
 */
export const calculateShippingRate = async ({
  toPincode,
  fromPincode = process.env.ITHINK_LOGISTICS_FROM_PINCODE || '331507',
  weight = 0.5,
  length = 15,
  width = 15,
  height = 15,
  paymentMethod = 'Prepaid'
}) => {
  if (!isConfigured()) {
    // Graceful fallback for local development or until user inputs credentials
    return {
      success: true,
      serviceable: true,
      estimatedCost: 60,
      currency: 'INR',
      courierName: 'Standard Express (iThink Partner)',
      expectedDeliveryDays: 3,
      isSimulated: true
    };
  }

  const { access_token, secret_key } = getCredentials();
  const paymentMode = paymentMethod?.toUpperCase() === 'COD' ? 'COD' : 'Prepaid';

  try {
    const payload = {
      data: {
        access_token,
        secret_key,
        from_pincode: String(fromPincode),
        to_pincode: String(toPincode),
        shipping_weight_kg: String(weight),
        shipping_length_cms: String(length),
        shipping_width_cms: String(width),
        shipping_height_cms: String(height),
        weight: parseFloat(weight),
        payment_mode: paymentMode,
        payment_method: paymentMode,
        order_type: 'Forward'
      }
    };

    const res = await axios.post(`${getBaseUrl()}/api_v3/rate/zone_rate.json`, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000
    });

    if (res.data?.status_code === 200 || res.data?.status === 'success') {
      return {
        success: true,
        data: res.data.data || res.data,
        isSimulated: false
      };
    }

    return {
      success: false,
      message: res.data?.message || 'Pincode not serviceable by iThink Logistics'
    };
  } catch (err) {
    console.error('iThink Rate calculation error:', err.response?.data || err.message);
    return {
      success: false,
      message: err.response?.data?.message || err.message,
      fallbackCost: 60
    };
  }
};

/**
 * Create Order / Generate AWB with iThink Logistics
 * @param {Object} order - Local Order document
 */
export const createShipmentOrder = async (order) => {
  if (!isConfigured()) {
    // Generate simulated AWB tracking number so development workflows are seamless
    const simulatedAwb = 'ITL' + Math.floor(100000000000 + Math.random() * 900000000000);
    return {
      success: true,
      waybill: simulatedAwb,
      courierName: 'iThink Logistics Express',
      refnum: order.orderNumber,
      isSimulated: true
    };
  }

  const { access_token, secret_key } = getCredentials();
  const address = order.shippingAddress;
  const isCOD = order.paymentMethod?.toLowerCase() === 'cod';

  const orderItems = order.items.map(item => ({
    product_name: item.name,
    product_sku: item.sku || 'SKU-PKL',
    product_quantity: item.quantity,
    product_price: item.price,
    product_tax_rate: 0
  }));

  const payload = {
    data: {
      access_token,
      secret_key,
      shipments: [
        {
          order_id: order.orderNumber,
          order_date: new Date(order.createdAt).toISOString().split('T')[0],
          payment_mode: isCOD ? 'COD' : 'Prepaid',
          total_amount: order.totalAmount,
          cod_amount: isCOD ? order.totalAmount : 0,
          customer_name: address.fullName || `${address.firstName || ''} ${address.lastName || ''}`.trim(),
          customer_email: order.user?.email || 'customer@singodhiafoods.com',
          customer_phone: address.phone,
          customer_address: `${address.addressLine1 || address.street || ''} ${address.addressLine2 || ''}`.trim(),
          customer_pincode: address.pincode || address.postalCode,
          customer_city: address.city,
          customer_state: address.state,
          pick_location: process.env.ITHINK_LOGISTICS_PICKUP_LOCATION || 'Primary Warehouse',
          weight: 0.5,
          shipment_length: 15,
          shipment_width: 15,
          shipment_height: 15,
          product_details: orderItems
        }
      ]
    }
  };

  try {
    const res = await axios.post(`${getBaseUrl()}/api/order/add.json`, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000
    });

    const responseData = res.data;
    if (responseData.status_code === 200 && responseData.data) {
      const firstResult = Object.values(responseData.data)[0];
      if (firstResult?.status === 'Success' || firstResult?.waybill) {
        return {
          success: true,
          waybill: firstResult.waybill,
          courierName: firstResult.courier_name || 'iThink Logistics Express',
          refnum: firstResult.refnum || order.orderNumber
        };
      }
    }

    return {
      success: false,
      message: responseData.message || 'Failed to generate AWB from iThink Logistics'
    };
  } catch (err) {
    console.error('iThink order creation error:', err.response?.data || err.message);
    throw new Error(err.response?.data?.message || err.message);
  }
};

/**
 * Track Shipment by AWB
 * @param {String} waybill
 */
export const trackShipment = async (waybill) => {
  if (!isConfigured() || waybill.startsWith('ITL')) {
    return {
      success: true,
      waybill,
      currentStatus: 'In Transit',
      courierName: 'iThink Logistics Express',
      events: [
        { status: 'Order Dispatched', location: 'Jaipur Hub', timestamp: new Date().toISOString() },
        { status: 'In Transit', location: 'Regional Sorting Facility', timestamp: new Date().toISOString() }
      ],
      isSimulated: true
    };
  }

  const { access_token, secret_key } = getCredentials();

  try {
    const res = await axios.post(`${getBaseUrl()}/api_v3/order/track.json`, {
      data: {
        access_token,
        secret_key,
        waybill
      }
    }, { timeout: 10000 });

    return {
      success: true,
      data: res.data?.data || res.data
    };
  } catch (err) {
    console.error('iThink track error:', err.response?.data || err.message);
    return {
      success: false,
      message: err.response?.data?.message || err.message
    };
  }
};

/**
 * Cancel Shipment Order
 * @param {String} waybill
 */
export const cancelShipment = async (waybill) => {
  if (!isConfigured() || waybill.startsWith('ITL')) {
    return { success: true, message: 'Shipment cancelled successfully (simulated)' };
  }

  const { access_token, secret_key } = getCredentials();

  try {
    const res = await axios.post(`${getBaseUrl()}/api_v3/order/cancel.json`, {
      data: {
        access_token,
        secret_key,
        waybill
      }
    });

    return {
      success: true,
      data: res.data
    };
  } catch (err) {
    console.error('iThink cancel error:', err.response?.data || err.message);
    return {
      success: false,
      message: err.response?.data?.message || err.message
    };
  }
};

export default {
  calculateShippingRate,
  createShipmentOrder,
  trackShipment,
  cancelShipment,
  isConfigured
};

