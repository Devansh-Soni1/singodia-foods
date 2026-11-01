// server/services/emailService.js
// Automated Email Notifications via Resend API for Singodhia Foods
// Aesthetic: Royal Rajasthani Heritage • Refined English with Authentic Marwadi Touches

const RESEND_API_URL = 'https://api.resend.com/emails';
const STORE_NAME = 'Singodhia Foods';
const STORE_URL = 'https://singodiafoodstore.in';
const STORE_PHONE = '+91 75979 66707';

/**
 * Base email dispatcher calling Resend HTTP API
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[EmailService] RESEND_API_KEY is not configured in process.env. Email not sent.');
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

    // Fallback if custom domain is still pending verification in Resend
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
 * Royal Rajasthani Heritage HTML Template Wrapper
 * Combines warm terracotta, royal gold, and parchment cream with refined English typography.
 */
const wrapTemplate = (contentHtml, previewText = '') => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Singodhia Foods — Royal Rajasthani Heritage</title>
  <style>
    body { margin: 0; padding: 0; background-color: #FAF5EB; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #2B2118; -webkit-font-smoothing: antialiased; }
    .wrapper { max-width: 600px; margin: 30px auto; background: #FFFFFF; border-radius: 20px; overflow: hidden; border: 1px solid #EADBCA; box-shadow: 0 10px 30px rgba(135,43,0,0.08); }
    .royal-header { background: linear-gradient(135deg, #7A2600 0%, #4D1800 100%); padding: 36px 24px; text-align: center; color: #FFFFFF; position: relative; border-bottom: 3px solid #D4AF37; }
    .heritage-badge { display: inline-block; font-size: 10px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: #EAD098; border: 1px solid rgba(212,175,55,0.4); padding: 4px 14px; border-radius: 999px; margin-bottom: 12px; }
    .brand-title { margin: 0; font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; font-size: 30px; font-weight: 800; letter-spacing: 1px; color: #FFFBF5; }
    .brand-subtitle { margin: 6px 0 0; font-size: 13px; color: #E8D5BF; letter-spacing: 1px; text-transform: uppercase; }
    .content-body { padding: 36px 32px; line-height: 1.65; color: #382E25; }
    .greeting { font-family: 'Playfair Display', Georgia, serif; font-size: 22px; font-weight: 700; color: #7A2600; margin: 0 0 14px; }
    .parchment-card { background: #FAF5EB; border: 1px solid #EADCC8; border-radius: 14px; padding: 20px; margin: 24px 0; }
    .btn-royal { display: inline-block; background: #7A2600; color: #FFFFFF !important; text-decoration: none; padding: 14px 34px; border-radius: 999px; font-weight: 700; font-size: 13px; letter-spacing: 0.8px; text-transform: uppercase; border: 1px solid #D4AF37; box-shadow: 0 4px 14px rgba(122,38,0,0.25); text-align: center; }
    .table-order { width: 100%; border-collapse: collapse; margin-top: 14px; font-size: 13px; }
    .table-order th { text-align: left; padding: 10px 8px; border-bottom: 2px solid #E2D2BC; color: #7A2600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; }
    .table-order td { padding: 12px 8px; border-bottom: 1px solid #EFE4D4; }
    .royal-divider { height: 1px; background: linear-gradient(90deg, transparent, #D4AF37, transparent); margin: 26px 0; }
    .royal-footer { background: #FAF5EB; padding: 28px 24px; text-align: center; font-size: 12px; color: #7D6B5A; border-top: 1px solid #EADBCA; }
    .royal-footer a { color: #7A2600; text-decoration: none; font-weight: 700; }
    .seal-text { font-size: 11px; color: #8F7660; letter-spacing: 1px; text-transform: uppercase; margin-top: 6px; }
  </style>
</head>
<body>
  ${previewText ? `<div style="display:none;font-size:1px;color:#fff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${previewText}</div>` : ''}
  <div class="wrapper">
    <!-- Royal Header with Marwari Aesthetics -->
    <div class="royal-header">
      <div class="heritage-badge">Authentic Marwari Heritage</div>
      <div style="font-size: 32px; line-height: 1; margin-bottom: 6px;">🏺</div>
      <h1 class="brand-title">Singodhia Foods</h1>
      <p class="brand-subtitle">Handcrafted Artisanal Pickles • Rajasthan</p>
    </div>

    <!-- Main Content -->
    <div class="content-body">
      ${contentHtml}
    </div>

    <!-- Royal Footer -->
    <div class="royal-footer">
      <div style="font-size: 16px; margin-bottom: 4px;">✦ ✦ ✦</div>
      <p style="margin: 0 0 6px; font-weight: 700; color: #4D1800; font-size: 13px;">Singodhia Foods — Traditional Pickles Handcrafted in Sujangarh</p>
      <p style="margin: 0 0 10px; color: #6E5A47;">Sun-cured in ceramic martabans • Pure cold-pressed mustard oil • Zero chemical preservatives</p>
      <div class="seal-text">Sujangarh, Churu, Rajasthan (331507) • Customer Care: <a href="tel:${STORE_PHONE}">${STORE_PHONE}</a></div>
      <p style="margin: 12px 0 0;"><a href="${STORE_URL}">${STORE_URL}</a></p>
    </div>
  </div>
</body>
</html>
  `.trim();
};

/**
 * 1. Welcome Email
 * Aesthetic: Royal welcoming tone with Khamma Ghani Sa, minimal Hindi script, clean English presentation.
 */
export const sendWelcomeEmail = async (user) => {
  if (!user?.email) return;

  const userName = user.name || 'Connoisseur of Tradition';

  const html = wrapTemplate(`
    <div style="text-align: center; margin-bottom: 24px;">
      <div class="greeting">Khamma Ghani ${userName} Sa! 🙏</div>
      <p style="margin: 0; color: #6E5A47; font-size: 14px;">A warm royal welcome to the Singodhia Foods family.</p>
    </div>

    <p style="font-size: 14px; margin-bottom: 18px;">
      We are delighted to bring the authentic flavors of royal Rajasthan right to your dining table. In the historic sands of <strong>Sujangarh, Rajasthan</strong>, our family preserves age-old Marwari recipes passed down through generations.
    </p>

    <!-- Heritage Highlights -->
    <div class="parchment-card" style="padding: 22px 24px;">
      <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 15px; font-weight: 700; color: #7A2600; margin-bottom: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
        The Singodhia Heritage Promise:
      </div>
      <div style="font-size: 13px; color: #4A3A2C; line-height: 1.8;">
        <div style="margin-bottom: 8px;">✦ <strong>Sun-Cured in Ceramic Barnis:</strong> Slowly cured under the warm desert sun in authentic glazed earthen martabans.</div>
        <div style="margin-bottom: 8px;">✦ <strong>Cold-Pressed Kachi Ghani Mustard Oil:</strong> Cured exclusively in 100% pure, unadulterated cold-pressed mustard oil.</div>
        <div style="margin-bottom: 8px;">✦ <strong>Zero Chemical Preservatives:</strong> No artificial vinegar, no synthetic food colors, no compromises.</div>
        <div>✦ <strong>Artisanal Small Batches:</strong> Hand-crafted by local women artisans using heritage whole spices.</div>
      </div>
    </div>

    <!-- Heritage Quality & Seal Assurance -->
    <div style="background: #FFFFFF; border: 1px solid #EADBCA; border-radius: 12px; padding: 16px 20px; margin: 24px 0; font-size: 12px; color: #6E5A47; line-height: 1.6;">
      <div style="font-weight: 700; color: #7A2600; font-size: 11px; letter-spacing: 1.2px; text-transform: uppercase; margin-bottom: 4px;">Purity & Freshness Guaranteed:</div>
      Each jar is filled fresh from traditional barnis and double-sealed before dispatch, bringing you uncompromised hygiene and rich Rajasthani flavor.
    </div>

    <div style="text-align: center; margin: 30px 0 10px;">
      <a href="${STORE_URL}/shop/" class="btn-royal">Explore Artisanal Pickles ➔</a>
    </div>

    <p style="font-size: 12px; color: #8F7660; text-align: center; margin-top: 24px;">
      Need personal flavor recommendations? Call or WhatsApp our artisanal kitchen directly at <a href="tel:${STORE_PHONE}" style="color: #7A2600; font-weight: 700;">${STORE_PHONE}</a>.
    </p>
  `, 'Khamma Ghani Sa! Welcome to Singodhia Foods — Authentic Rajasthani Pickles.');

  return sendEmail({
    to: user.email,
    subject: `Khamma Ghani Sa! Welcome to Singodhia Foods 🏺 (Authentic Rajasthani Heritage)`,
    html
  });
};

/**
 * 2. Order Confirmation Email
 * Aesthetic: Regal order receipt with clean English tables, clear totals, and delivery info.
 */
export const sendOrderConfirmationEmail = async (order) => {
  if (!order?.customer?.email) return;

  const customerName = order.customer.name || 'Valued Patron';
  const orderNumber = order.orderNumber || order._id;
  const totalAmount = order.totalAmount || order.subtotal || 0;
  const items = Array.isArray(order.items) ? order.items : [];
  const address = order.shippingAddress || {};

  const itemsRows = items.map(item => `
    <tr>
      <td>
        <strong style="color: #2B2118; font-size: 13px;">${item.name}</strong><br>
        <span style="font-size: 11px; color: #8F7660;">Pack Size: ${item.weight || '500g'}</span>
      </td>
      <td style="text-align: center; color: #4A3A2C;">${item.quantity}</td>
      <td style="text-align: right; color: #4A3A2C;">₹${item.price}</td>
      <td style="text-align: right; font-weight: 700; color: #7A2600;">₹${item.itemTotal || (item.price * item.quantity)}</td>
    </tr>
  `).join('');

  const html = wrapTemplate(`
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="display: inline-block; background: #EAF7EC; color: #166534; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 5px 14px; border-radius: 999px; border: 1px solid #BBF7D0;">
        ✓ Order Confirmed
      </span>
      <div class="greeting" style="margin-top: 12px; margin-bottom: 6px;">Thank You, ${customerName} Sa!</div>
      <p style="margin: 0; color: #6E5A47; font-size: 13px;">Your authentic Rajasthani pickles are being freshly prepared and packed.</p>
    </div>

    <!-- Order Receipt Card -->
    <div class="parchment-card">
      <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px;">
        <span><strong>Order ID:</strong> #${orderNumber}</span>
        <span style="color: #166534; font-weight: 700;">Payment: ${order.paymentStatus === 'completed' ? 'Paid (Verified)' : 'Pending'}</span>
      </div>
      <div style="font-size: 12px; color: #8F7660;">
        Order Date: ${new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
      </div>

      <table class="table-order">
        <thead>
          <tr>
            <th>Pickle Variety</th>
            <th style="text-align: center;">Qty</th>
            <th style="text-align: right;">Price</th>
            <th style="text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>

      <!-- Order Summary Totals -->
      <div style="margin-top: 16px; padding-top: 12px; border-top: 2px dashed #DCCDB8; font-size: 13px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <span style="color: #6E5A47;">Subtotal:</span>
          <span>₹${order.subtotal || totalAmount}</span>
        </div>
        ${order.discount ? `
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: #166534;">
            <span>Discount Applied:</span>
            <span>-₹${order.discount}</span>
          </div>
        ` : ''}
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <span style="color: #6E5A47;">Heritage Shipping:</span>
          <span style="color: #166534; font-weight: 600;">${order.shippingFee ? `₹${order.shippingFee}` : 'FREE (Complimentary)'}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 10px; padding-top: 8px; border-top: 1px solid #E4D5C2; font-size: 16px; font-weight: 800; color: #7A2600;">
          <span>Grand Total:</span>
          <span>₹${totalAmount}</span>
        </div>
      </div>
    </div>

    <!-- Shipping Destination Card -->
    <div style="background: #FFFFFF; border: 1px solid #EADBCA; border-radius: 12px; padding: 16px; margin: 20px 0; font-size: 13px; line-height: 1.5;">
      <div style="font-size: 10px; font-weight: 700; color: #7A2600; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 6px;">Shipping Destination:</div>
      <strong>${address.fullName || customerName}</strong> • ${order.customer.phone || address.phone || ''}<br>
      ${address.addressLine1 || ''} ${address.addressLine2 || ''}<br>
      ${address.city || ''}, ${address.state || ''} — <strong>${address.pincode || ''}</strong>
    </div>

    <!-- Food Safety & Policy Notice -->
    <div style="background: #FDFBF7; border: 1px solid #EADCC8; border-radius: 10px; padding: 12px 16px; margin: 18px 0; font-size: 11px; color: #8F7660; line-height: 1.5;">
      <strong>Food Safety & Return Policy:</strong> As our pickles are pure consumable food products freshly sealed for you, orders are non-returnable and non-refundable once delivered to guarantee complete seal integrity and hygiene for every customer.
    </div>

    <div style="text-align: center; margin: 28px 0 10px;">
      <a href="${STORE_URL}/account" class="btn-royal">Track Order Status ➔</a>
    </div>

    <p style="font-size: 12px; color: #8F7660; text-align: center; margin-top: 22px;">
      Each jar is securely packed in shockproof bubble packaging to ensure it reaches you in pristine condition. You will receive courier dispatch updates once the parcel departs our Sujangarh kitchen.
    </p>
  `, `Order #${orderNumber} Confirmed — Handcrafted with love in Sujangarh, Rajasthan.`);

  return sendEmail({
    to: order.customer.email,
    subject: `Order Confirmed #${orderNumber} | Singodhia Foods (Handcrafted in Rajasthan)`,
    html
  });
};

/**
 * 3. Order Delivered Email
 * Aesthetic: Royal celebratory notification, artisanal care tips, and review request in refined English.
 */
export const sendOrderDeliveredEmail = async (order) => {
  if (!order?.customer?.email) return;

  const customerName = order.customer.name || 'Valued Patron';
  const orderNumber = order.orderNumber || order._id;

  const html = wrapTemplate(`
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="display: inline-block; background: #EAF7EC; color: #166534; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 5px 14px; border-radius: 999px; border: 1px solid #BBF7D0;">
        📦 Delivered Successfully
      </span>
      <div class="greeting" style="margin-top: 12px; margin-bottom: 6px;">Padharo Sa! Your Pickles Have Arrived 🏺</div>
      <p style="margin: 0; color: #6E5A47; font-size: 13px;">Order <strong>#${orderNumber}</strong> has been safely delivered to your doorstep.</p>
    </div>

    <p style="font-size: 14px; line-height: 1.6;">
      Dear <strong>${customerName} Sa</strong>,
    </p>
    <p style="font-size: 14px; line-height: 1.6; color: #4A3A2C;">
      Your handcrafted Rajasthani pickles have completed their journey from our sunlit courtyards in Sujangarh to your home. We truly hope you and your family enjoy the rich, authentic Marwari flavors!
    </p>

    <!-- Artisanal Pickle Care Guide -->
    <div class="parchment-card" style="padding: 20px 22px;">
      <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 14px; font-weight: 700; color: #7A2600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">
        🏺 Traditional Care Rituals (To Keep Fresh for Years):
      </div>
      <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #4A3A2C; line-height: 1.7;">
        <li style="margin-bottom: 6px;">Always use a <strong>clean, completely dry spoon</strong> when scooping out pickle.</li>
        <li style="margin-bottom: 6px;">Ensure the cold-pressed mustard oil layer stays gently above the pickles to seal in freshness naturally.</li>
        <li>Treat the jar to 1-2 hours of gentle afternoon sunshine once a month to let the spices breathe.</li>
      </ul>
    </div>

    <!-- Review Callout -->
    <div style="text-align: center; margin: 30px 0 10px;">
      <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 16px; font-weight: 700; color: #2B2118; margin-bottom: 6px;">How Did It Taste On Your Thali? ⭐</div>
      <p style="font-size: 13px; color: #6E5A47; margin: 0 0 18px;">Your review helps our heritage artisans continue their craft with pride.</p>
      <a href="${STORE_URL}/account" class="btn-royal">Share Your Review & Rating ➔</a>
    </div>

    <p style="font-size: 12px; color: #8F7660; text-align: center; margin-top: 24px;">
      Have queries about your order or need culinary pairing tips? We are always happy to assist at <a href="tel:${STORE_PHONE}" style="color: #7A2600; font-weight: 700;">${STORE_PHONE}</a>.
    </p>
  `, `Order #${orderNumber} Delivered — Enjoy the royal taste of Rajasthan!`);

  return sendEmail({
    to: order.customer.email,
    subject: `Padharo Sa! Your Pickles Have Arrived (#${orderNumber}) — Singodhia Foods`,
    html
  });
};
