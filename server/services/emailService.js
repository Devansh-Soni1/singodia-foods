// server/services/emailService.js
// Automated Email Notifications via Resend API for Singodhia Foods

const RESEND_API_URL = 'https://api.resend.com/emails';
const STORE_NAME = 'Singodhia Foods';
const STORE_URL = 'https://singodiafoodstore.in';
const STORE_PHONE = '+91 97829 83909';

/**
 * Base email dispatcher calling Resend HTTP API
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[EmailService] RESEND_API_KEY is not configured. Email not sent.');
    return { success: false, message: 'Missing API key' };
  }

  if (!to) {
    console.warn('[EmailService] Recipient "to" address missing.');
    return { success: false, message: 'Missing recipient' };
  }

  const primaryFrom = process.env.RESEND_FROM_EMAIL || 'Singodhia Foods <orders@singodiafoodstore.in>';
  const fallbackFrom = 'Singodhia Foods <onboarding@resend.dev>';

  const attemptSend = async (fromAddress) => {
    const payload = {
      from: fromAddress,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      ...(text ? { text } : {})
    };

    const res = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));
    return { status: res.status, ok: res.ok, data };
  };

  try {
    let result = await attemptSend(primaryFrom);

    // If custom domain is not yet verified on Resend (HTTP 403), fallback to onboarding@resend.dev
    if (!result.ok && result.status === 403 && primaryFrom !== fallbackFrom) {
      console.warn(`[EmailService] Custom sender "${primaryFrom}" not verified yet on Resend. Falling back to "${fallbackFrom}"...`);
      result = await attemptSend(fallbackFrom);
    }

    if (!result.ok) {
      console.error('[EmailService] Failed to send email via Resend:', result.status, result.data);
      return { success: false, error: result.data };
    }

    console.log(`[EmailService] Email sent successfully to ${to} (ID: ${result.data?.id})`);
    return { success: true, id: result.data?.id };
  } catch (err) {
    console.error('[EmailService] Network error sending email:', err.message);
    return { success: false, error: err.message };
  }
};

/**
 * Common HTML Wrapper with Singodhia Foods Rajasthani Theme
 */
const wrapTemplate = (contentHtml, previewText = '') => {
  return `
<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Singodhia Foods</title>
  <style>
    body { margin: 0; padding: 0; background-color: #FAF6EF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2D2721; }
    .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #EFE6D8; box-shadow: 0 4px 16px rgba(179,84,0,0.06); }
    .header { background: linear-gradient(135deg, #b35400 0%, #8c3e00 100%); padding: 32px 24px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 0.5px; }
    .header p { margin: 6px 0 0; font-size: 13px; color: #FCEFD9; letter-spacing: 0.3px; }
    .body { padding: 32px 28px; line-height: 1.6; }
    .btn { display: inline-block; background: #b35400; color: #ffffff !important; text-decoration: none; padding: 13px 28px; border-radius: 999px; font-weight: 700; font-size: 14px; margin: 18px 0; text-align: center; }
    .order-box { background: #FAF6EF; border: 1px solid #EAE0CE; border-radius: 12px; padding: 16px; margin: 20px 0; }
    .table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 13px; }
    .table th { text-align: left; padding: 8px 6px; border-bottom: 2px solid #EAE0CE; color: #6E5A44; font-size: 11px; text-transform: uppercase; }
    .table td { padding: 10px 6px; border-bottom: 1px solid #F2EBE0; }
    .footer { background: #FAF6EF; padding: 24px; text-align: center; font-size: 12px; color: #8A7761; border-top: 1px solid #EFE6D8; }
    .footer a { color: #b35400; text-decoration: none; font-weight: 600; }
    .badge { display: inline-block; background: #EAF7EC; color: #166534; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 999px; }
  </style>
</head>
<body>
  ${previewText ? `<div style="display:none;font-size:1px;color:#fff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${previewText}</div>` : ''}
  <div class="container">
    <div class="header">
      <div style="font-size: 38px; margin-bottom: 6px;">🏺</div>
      <h1>Singodhia Foods</h1>
      <p>स्वाद घर जैसा, परंपरा राजस्थान की</p>
    </div>
    <div class="body">
      ${contentHtml}
    </div>
    <div class="footer">
      <p style="margin: 0 0 8px;"><strong>Singodhia Foods — पारंपरिक राजस्थानी देसी आचार</strong></p>
      <p style="margin: 0 0 8px;">सुजानगढ़, चूरू, राजस्थान (331507) | हेल्पलाइन: <a href="tel:${STORE_PHONE}">${STORE_PHONE}</a></p>
      <p style="margin: 0;"><a href="${STORE_URL}">${STORE_URL}</a></p>
    </div>
  </div>
</body>
</html>
  `.trim();
};

/**
 * 1. Send Welcome Email upon new user registration / first login
 */
export const sendWelcomeEmail = async (user) => {
  if (!user?.email) return;

  const userName = user.name || 'आदरणीय ग्राहक';
  const html = wrapTemplate(`
    <h2 style="color: #2D2721; margin-top: 0; font-size: 20px;">नमस्ते ${userName} जी! 🙏</h2>
    <p><strong>Singodhia Foods</strong> परिवार में आपका हार्दिक स्वागत है!</p>
    
    <p>हम आपके लिए लाते हैं राजस्थान के सुजानगढ़ का 100% असली, पारंपरिक और घर जैसा आचार। हमारी विशेषताएँ:</p>
    
    <div style="background: #FFF9ED; border-left: 4px solid #b35400; padding: 12px 16px; margin: 18px 0; border-radius: 4px;">
      <ul style="margin: 0; padding-left: 18px; color: #5B472A; font-size: 13px;">
        <li style="margin-bottom: 6px;"><strong>कच्ची घानी शुद्ध सरसों का तेल</strong> में तैयार।</li>
        <li style="margin-bottom: 6px;"><strong>पारंपरिक चीनी-मिट्टी की बरनी</strong> में धूप में प्राकृतिक रूप से पकाया गया।</li>
        <li style="margin-bottom: 6px;">बिना किसी कृत्रिम रंग या हानिकारक केमिकल प्रीजर्वेटिव के।</li>
        <li>दादी-नानी की पारंपरिक मारवाड़ी रेसिपी से बना असली स्वाद।</li>
      </ul>
    </div>

    <div style="background: #FDF3E5; border: 1px dashed #b35400; border-radius: 12px; padding: 14px; text-align: center; margin: 22px 0;">
      <span style="font-size: 12px; color: #8A4000; font-weight: 600; text-transform: uppercase;">आपके पहले ऑर्डर पर 10% की विशेष छूट</span>
      <div style="font-size: 20px; font-weight: 800; color: #b35400; letter-spacing: 2px; margin: 6px 0;">WELCOME10</div>
      <span style="font-size: 11px; color: #6E5A44;">चेकआउट के समय इस कूपन कोड का उपयोग करें</span>
    </div>

    <div style="text-align: center;">
      <a href="${STORE_URL}/shop/" class="btn">अभी आचार देखें और ऑर्डर करें ➔</a>
    </div>

    <p style="font-size: 13px; color: #6E5A44; margin-top: 24px;">यदि आपको आचार के चयन में कोई सहायता चाहिए, तो आप हमें सीधे व्हाट्सएप या कॉल पर <a href="tel:${STORE_PHONE}" style="color: #b35400; font-weight: 700;">${STORE_PHONE}</a> पर संपर्क कर सकते हैं।</p>
  `, 'Singodhia Foods में आपका हार्दिक स्वागत है!');

  return sendEmail({
    to: user.email,
    subject: `🫙 Singodhia Foods परिवार में आपका स्वागत है! (फ्लैट 10% छूट कूपन अंदर)`,
    html
  });
};

/**
 * 2. Send Order Confirmation Email when an order is placed and confirmed
 */
export const sendOrderConfirmationEmail = async (order) => {
  if (!order?.customer?.email) return;

  const customerName = order.customer.name || 'ग्राहक';
  const orderNumber = order.orderNumber || order._id;
  const totalAmount = order.totalAmount || order.subtotal || 0;
  const items = Array.isArray(order.items) ? order.items : [];
  const address = order.shippingAddress || {};

  const itemsRows = items.map(item => `
    <tr>
      <td>
        <strong>${item.name}</strong><br>
        <span style="font-size: 11px; color: #8A7761;">वज़न: ${item.weight || '500g'}</span>
      </td>
      <td style="text-align: center;">${item.quantity}</td>
      <td style="text-align: right;">₹${item.price}</td>
      <td style="text-align: right; font-weight: bold;">₹${item.itemTotal || (item.price * item.quantity)}</td>
    </tr>
  `).join('');

  const html = wrapTemplate(`
    <div style="text-align: center; margin-bottom: 20px;">
      <span class="badge" style="background: #E8F5E9; color: #2E7D32; font-size: 12px; padding: 6px 14px;">✅ ऑर्डर कन्फर्म हो गया</span>
      <h2 style="color: #2D2721; margin: 12px 0 4px; font-size: 20px;">धन्यवाद ${customerName} जी!</h2>
      <p style="margin: 0; color: #6E5A44; font-size: 13px;">आपका आचार ऑर्डर सफलतापूर्वक दर्ज हो चुका है।</p>
    </div>

    <div class="order-box">
      <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px;">
        <span><strong>Order ID:</strong> #${orderNumber}</span>
        <span style="color: #166534; font-weight: 700;">पेमेंट: ${order.paymentStatus === 'completed' ? 'Paid (ऑनलाइन)' : 'Cash on Delivery'}</span>
      </div>
      <div style="font-size: 12px; color: #8A7761;">
        दिनांक: ${new Date(order.createdAt || Date.now()).toLocaleDateString('hi-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
      </div>

      <table class="table">
        <thead>
          <tr>
            <th>आचार</th>
            <th style="text-align: center;">मात्रा</th>
            <th style="text-align: right;">दर</th>
            <th style="text-align: right;">कुल</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>

      <div style="margin-top: 14px; padding-top: 10px; border-top: 2px dashed #E0D3C1; font-size: 13px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span>सब-टोटल:</span>
          <span>₹${order.subtotal || totalAmount}</span>
        </div>
        ${order.discount ? `
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px; color: #166534;">
            <span>छूट (Discount):</span>
            <span>-₹${order.discount}</span>
          </div>
        ` : ''}
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span>डिलीवरी शुल्क:</span>
          <span>${order.shippingFee ? `₹${order.shippingFee}` : 'मुफ़्त (FREE)'}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 8px; padding-top: 6px; border-top: 1px solid #EAE0CE; font-size: 16px; font-weight: 800; color: #b35400;">
          <span>कुल भुगतान:</span>
          <span>₹${totalAmount}</span>
        </div>
      </div>
    </div>

    <div style="background: #FAF6EF; border: 1px solid #EAE0CE; border-radius: 12px; padding: 14px; margin-bottom: 20px; font-size: 12px; line-height: 1.5;">
      <strong style="color: #6E5A44; text-transform: uppercase; font-size: 11px;">डिलीवरी का पता:</strong><br>
      <strong>${address.fullName || customerName}</strong> (${order.customer.phone || address.phone})<br>
      ${address.addressLine1 || ''} ${address.addressLine2 || ''}<br>
      ${address.city || ''}, ${address.state || ''} - <strong>${address.pincode || ''}</strong>
    </div>

    <div style="text-align: center;">
      <a href="${STORE_URL}/account" class="btn">ऑर्डर ट्रैक करें (View in Account) ➔</a>
    </div>

    <p style="font-size: 12px; color: #8A7761; text-align: center; margin-top: 20px;">
      हम आपका आचार सुरक्षित रूप से पैक करके 24-48 घंटे में कूरियर द्वारा रवाना कर देंगे। कूरियर ट्रैकिंग नंबर आपको ईमेल और व्हाट्सएप पर प्राप्त होगा।
    </p>
  `, `ऑर्डर #${orderNumber} सफलतापूर्वक कन्फर्म हो चुका है!`);

  return sendEmail({
    to: order.customer.email,
    subject: `🎉 ऑर्डर कन्फर्म! ऑर्डर #${orderNumber} | Singodhia Foods`,
    html
  });
};

/**
 * 3. Send Order Delivered Email when an order is marked as Delivered
 */
export const sendOrderDeliveredEmail = async (order) => {
  if (!order?.customer?.email) return;

  const customerName = order.customer.name || 'ग्राहक';
  const orderNumber = order.orderNumber || order._id;

  const html = wrapTemplate(`
    <div style="text-align: center; margin-bottom: 22px;">
      <span class="badge" style="background: #E8F5E9; color: #2E7D32; font-size: 13px; padding: 6px 16px;">📦 डिलीवर हो गया</span>
      <h2 style="color: #2D2721; margin: 12px 0 4px; font-size: 22px;">आपका आचार पहुँच गया है!</h2>
      <p style="margin: 0; color: #6E5A44; font-size: 13px;">ऑर्डर <strong>#${orderNumber}</strong> आपके पते पर सफलतापूर्वक डिलीवर कर दिया गया है।</p>
    </div>

    <p>नमस्ते <strong>${customerName} जी</strong>,</p>
    <p>हमें उम्मीद है कि शुद्ध सरसों के तेल और पारंपरिक मसालों में धूप में पके हमारे देसी आचार का स्वाद आपके पूरे परिवार को बहुत पसंद आएगा!</p>

    <div style="background: #FFF9ED; border: 1px solid #F0DFBF; border-radius: 12px; padding: 16px; margin: 20px 0;">
      <h4 style="margin: 0 0 8px; color: #8A4000; font-size: 13px;">🏺 आचार को सालों-साल ताज़ा रखने के महत्वपूर्ण टिप्स:</h4>
      <ul style="margin: 0; padding-left: 18px; color: #5B472A; font-size: 12px; line-height: 1.6;">
        <li>आचार निकालने के लिए हमेशा <strong>सूखे और साफ़ चम्मच</strong> का ही इस्तेमाल करें।</li>
        <li>आचार के ऊपर तेल की हल्की परत रहने दें, जिससे आचार कभी खराब नहीं होता।</li>
        <li>महीने में 1-2 बार बरनी को 1-2 घंटे हल्की धूप में ज़रूर रखें।</li>
      </ul>
    </div>

    <div style="text-align: center; margin: 28px 0;">
      <p style="font-size: 14px; font-weight: 700; color: #2D2721; margin-bottom: 8px;">कैसा लगा आचार का स्वाद? कृपया अपना रिव्यू दें ⭐</p>
      <a href="${STORE_URL}/account" class="btn" style="background: #166534;">अपना अनुभव साझा करें (Leave Review) ➔</a>
    </div>

    <p style="font-size: 12px; color: #8A7761; text-align: center;">
      यदि आपको ऑर्डर से संबंधित कोई भी समस्या हो, तो कृपया हमें <a href="tel:${STORE_PHONE}" style="color: #b35400; font-weight: 700;">${STORE_PHONE}</a> पर संपर्क करें। हम आपकी सेवा के लिए सदैव तत्पर हैं।
    </p>
  `, `आपका आचार ऑर्डर #${orderNumber} सफलतापूर्वक डिलीवर हो गया है!`);

  return sendEmail({
    to: order.customer.email,
    subject: `📦 आपका आचार डिलीवर हो गया! (#${orderNumber}) — Singodhia Foods`,
    html
  });
};
