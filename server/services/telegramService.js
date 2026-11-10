// server/services/telegramService.js
// Instant Telegram Bot Notifications for Singodhia Foods
// Dispatches alerts on New Orders, Customer Signups, etc.

const TELEGRAM_API_BASE = 'https://api.telegram.org';

/**
 * Base dispatcher to send a Telegram message via Bot API
 */
export const sendTelegramMessage = async (messageText, parseMode = 'HTML') => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    // Graceful skip if Telegram credentials are not yet configured
    return { success: false, skipped: true, message: 'Telegram credentials not set in process.env' };
  }

  try {
    const url = `${TELEGRAM_API_BASE}/bot${botToken}/sendMessage`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageText,
        parse_mode: parseMode,
        disable_web_page_preview: true
      })
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) {
      console.warn('[TelegramService] Telegram API error:', data?.description || res.statusText);
      return { success: false, error: data?.description };
    }

    return { success: true, messageId: data.result?.message_id };
  } catch (err) {
    console.warn('[TelegramService] Network error sending Telegram alert:', err.message);
    return { success: false, error: err.message };
  }
};

/**
 * Notify owner when a new order is paid & confirmed or placed via COD
 */
export const notifyNewOrder = async (order) => {
  try {
    const orderNumber = order.orderNumber || order._id;
    const customerName = order.customer?.name || 'Customer';
    const customerPhone = order.customer?.phone || 'N/A';
    const customerEmail = order.customer?.email || 'N/A';
    const city = order.shippingAddress?.city || '';
    const state = order.shippingAddress?.state || '';
    const pincode = order.shippingAddress?.pincode || '';
    const totalAmount = order.totalAmount || 0;
    const paymentMethod = (order.paymentMethod || 'razorpay').toUpperCase();
    const isCOD = paymentMethod === 'COD';
    const paymentModeText = isCOD ? 'Cash on Delivery (COD)' : 'Prepaid (Razorpay)';
    const paymentId = order.razorpayPaymentId || (isCOD ? 'Pay on Delivery' : 'Online');
    const tracking = order.trackingNumber || 'Pending pickup';

    const itemsList = (order.items || [])
      .map(item => `  • <b>${item.name}</b> (${item.weight || 'Std'}) × ${item.quantity} = ₹${(item.price || 0) * (item.quantity || 1)}`)
      .join('\n');

    const message = `
🎉 <b>नया ऑर्डर प्राप्त हुआ! (New Order Placed)</b>
━━━━━━━━━━━━━━━━━━
📦 <b>Order ID:</b> <code>${orderNumber}</code>
💰 <b>कुल राशि:</b> ₹${totalAmount} (${paymentModeText})
💳 <b>भुगतान मोड:</b> <code>${paymentMethod}</code> ${paymentId !== 'Pay on Delivery' && paymentId !== 'Online' ? `(${paymentId})` : ''}

👤 <b>ग्राहक विवरण (Customer):</b>
  • नाम: <b>${customerName}</b>
  • फोन: <a href="tel:${customerPhone}">${customerPhone}</a>
  • ईमेल: ${customerEmail}

📍 <b>डिलीवरी पता (Address):</b>
  ${order.shippingAddress?.addressLine1 || ''} ${order.shippingAddress?.addressLine2 || ''}
  ${city}${order.shippingAddress?.district && order.shippingAddress.district !== city ? `, ज़िला ${order.shippingAddress.district}` : ''}, ${state} - <b>${pincode}</b>

🛍️ <b>आइटम्स (Items Ordered):</b>
${itemsList || '  • Order details in Admin Panel'}

🚚 <b>Courier Tracking:</b> <code>${tracking}</code>
━━━━━━━━━━━━━━━━━━
🌐 <a href="https://singodiafoodstore.in/admin/orders">Admin Panel में ऑर्डर देखें</a>
`.trim();

    return await sendTelegramMessage(message, 'HTML');
  } catch (err) {
    console.warn('[TelegramService] Error formatting new order alert:', err.message);
    return { success: false, error: err.message };
  }
};

/**
 * Notify owner when a new customer registers via Google
 */
export const notifyNewCustomer = async (user) => {
  try {
    const name = user.name || 'New Customer';
    const email = user.email || 'N/A';
    const date = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const message = `
👋 <b>नया ग्राहक जुड़ा (New Google Signup)</b>
━━━━━━━━━━━━━━━━━━
👤 <b>नाम:</b> ${name}
📧 <b>ईमेल:</b> ${email}
📅 <b>समय:</b> ${date}
━━━━━━━━━━━━━━━━━━
🌐 <a href="https://singodiafoodstore.in/admin/users">Admin Panel Users देखें</a>
`.trim();

    return await sendTelegramMessage(message, 'HTML');
  } catch (err) {
    console.warn('[TelegramService] Error formatting new customer alert:', err.message);
    return { success: false, error: err.message };
  }
};

export default {
  sendTelegramMessage,
  notifyNewOrder,
  notifyNewCustomer
};
