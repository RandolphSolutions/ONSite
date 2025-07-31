function getQueryParam(param) {
  return new URLSearchParams(window.location.search).get(param);
}

// 🔽 Handle email input + reset on load
document.addEventListener('DOMContentLoaded', () => {
  const bin = getQueryParam('bin');
  const desc = getQueryParam('desc');

  document.getElementById('bin_id').textContent = bin || 'N/A';
  document.getElementById('desc').textContent = decodeURIComponent(desc || '');

  const emailInput = document.getElementById('email');
  const resetBtn = document.getElementById('email-reset');
  const savedEmail = localStorage.getItem('userEmail');

  if (savedEmail && emailInput && resetBtn) {
    emailInput.value = savedEmail;
    emailInput.style.display = 'none';
    resetBtn.style.display = 'inline';
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      localStorage.removeItem('userEmail');
      emailInput.value = '';
      emailInput.style.display = 'inline';
      resetBtn.style.display = 'none';
    });
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
    email = localStorage.getItem('userEmail');
  } else {
    localStorage.setItem('userEmail', email);
  }

  const qty = type === 'used' ? qtyUsed.value : qtyOrder.value;

  if (!qty || qty <= 0 || !email) {
    alert("Please enter a valid quantity and email.");
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
