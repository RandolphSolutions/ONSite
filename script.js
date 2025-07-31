async function sendEmail(type) {
  const binId = document.getElementById("bin_id").textContent.trim();
  const description = document.getElementById("desc").textContent.trim();
  const email = document.getElementById("email").value.trim();
  const qtyUsed = document.getElementById("qty_used").value;
  const qtyOrder = document.getElementById("qty_order").value;

  if (!email) {
    alert("Please enter your email.");
    return;
  }

  const messageType = type === "used" ? "Qty Used" : "Qty to Order";
  const qty = type === "used" ? qtyUsed : qtyOrder;

  const payload = {
    binId,
    description,
    email,
    messageType,
    qty
  };

  try {
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      alert(`Email sent to ${email}`);
      document.getElementById("qty_used").value = "";
      document.getElementById("qty_order").value = "";
    } else {
      const result = await response.json();
      alert("Error sending email: " + result.error);
    }
  } catch (error) {
    alert("Failed to send email: " + error.message);
  }
}
