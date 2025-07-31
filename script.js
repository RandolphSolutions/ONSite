function getQueryParam(param) {
  return new URLSearchParams(window.location.search).get(param);
}

// Load part info and email (if stored)
document.addEventListener('DOMContentLoaded', () => {
  const bin = getQueryParam('bin');
  const desc = getQueryParam('desc');

  document.getElementById('bin_id').textContent = bin || 'N/A';
  document.getElementById('desc').textContent = decodeURIComponent(desc || '');

  const emailInput = document.getElementById('email');
  const savedEmail = localStorage.getItem('userEmail');

  if (savedEmail && emailInput) {
    emailInput.value = savedEmail;
  }
});

async function sendEmail(type) {
  const bin = getQueryParam('bin');
  const desc = decodeURIComponent(getQueryParam('desc'));
  const pn = getQueryParam('pn'); // Hidden part number

  const qtyUsed = document.getElementById('qty_used');
  const qtyOrder = document.getElementById('qty_order');
  const emailInput = document.getElementById('email');
  let email = emailInput ? emailInput.value : '';

  if (!email) {
    alert("Please enter your email.");
    return;
  }

  // Save email to localStorage
  localStorage.setItem('userEmail', email);

  const qty = type === 'used' ? qtyUsed.value : qtyOrder.value;

  if (!qty || qty <= 0) {
    alert("Please enter a valid quantity.");
    return;
  }

  const res = await fetch('/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bin, desc, qty, type, pn, email })
  });

  const data = await res.json();

  if (res.ok) {
    alert(`✅ ${type === 'used' ? 'Usage' : 'Order'} email sent for ${bin} (Qty: ${qty})`);
    qtyUsed.value = '';
    qtyOrder.value = '';
  } else {
    alert(`❌ Email failed: ${data.message}`);
  }
}
