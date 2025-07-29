async function sendEmail(type) {
  const bin = getQueryParam('bin');
  const desc = decodeURIComponent(getQueryParam('desc'));
  const qtyUsed = document.getElementById('qty_used');
  const qtyOrder = document.getElementById('qty_order');
  const qty = type === 'used' ? qtyUsed.value : qtyOrder.value;

  if (!qty || qty <= 0) {
    alert("Please enter a valid quantity.");
    return;
  }

  const res = await fetch('/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bin, desc, qty, type })
  });

  const data = await res.json();

  if (res.ok) {
    alert(`✅ ${type === 'used' ? 'Usage' : 'Order'} email sent for ${bin} (Qty: ${qty})`);
    // Clear quantity fields
    qtyUsed.value = '';
    qtyOrder.value = '';
  } else {
    alert(`❌ Failed to send email: ${data.message || 'Unknown error'}`);
  }
}
