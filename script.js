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

async function sendEmail() {
  const bin = getQueryParam('bin');
  const desc = decodeURIComponent(getQueryParam('desc'));
  const pn = getQueryParam('pn'); // Hidden part number

  const qtyInput = document.getElementById('qty');
  const notesInput = document.getElementById('notes');
  const emailInput = document.getElementById('email');

  const qty = qtyInput ? qtyInput.value : '';
  const notes = notesInput ? notesInput.value : '';
  let email = emailInput ? emailInput.value : '';

  if (!email) {
    alert("Please enter your email.");
    return;
  }

  if (!qty || qty <= 0) {
    alert("Please enter a valid quantity.");
    return;
  }

  // Save email to localStorage
  localStorage.setItem('userEmail', email);

  const res = await fetch('/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bin, desc, qty, pn, email, notes })
  });

  const data = await res.json();

  if (res.ok) {
    alert(`✅ Request sent for (${qty}) ${bin}`);
    qtyInput.value = '';
    notesInput.value = '';
  } else {
    alert(`❌ Email failed: send email sales@randolph.solutions`);
  }
}
