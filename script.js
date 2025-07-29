// Email localStorage logic
document.addEventListener("DOMContentLoaded", function () {
  const emailInput = document.getElementById("email");
  const resetBtn = document.getElementById("email-reset");
  const savedEmail = localStorage.getItem("userEmail");

  if (savedEmail) {
    emailInput.value = savedEmail;
    emailInput.style.display = "none";
    resetBtn.style.display = "inline";
  }

  resetBtn.addEventListener("click", function () {
    localStorage.removeItem("userEmail");
    emailInput.style.display = "inline";
    emailInput.value = "";
    resetBtn.style.display = "none";
  });
});

function sendEmail(type) {
  const binId = document.getElementById("bin_id").textContent;
  const desc = document.getElementById("desc").textContent;
  const qty = type === 'used'
    ? document.getElementById("qty_used").value
    : document.getElementById("qty_order").value;

  let email = document.getElementById("email").value;
  if (!email) {
    email = localStorage.getItem("userEmail");
  } else {
    localStorage.setItem("userEmail", email);
  }

  if (!email || !qty) {
    alert("Please enter your email and quantity.");
    return;
  }

  const payload = {
    bin_id: binId,
    description: desc,
    qty: qty,
    type: type,
    email: email
  };

  fetch("/api/send-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  .then(response => {
    if (response.ok) {
      alert("Email sent successfully!");
      document.getElementById("qty_used").value = "";
      document.getElementById("qty_order").value = "";
    } else {
      alert("Error sending email.");
    }
  })
  .catch(e
