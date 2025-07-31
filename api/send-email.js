export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { bin, desc, qty, email, notes } = req.body;

  if (!bin || !desc || !qty || !email) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const subject = `Quote / Order Request - ${bin}`;

  const body = `
User Email: ${email}
Part: ${bin}
Description: ${desc}
Quantity Requested: ${qty}
Notes: ${notes || 'None'}
`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Randolph Solutions <onboarding@resend.dev>",  // Update if using your domain
        to: "braden@randolph.solutions",
        subject,
        text: body
      })
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Resend error:", result);
      return res.status(500).json({ message: "Resend API failed" });
    }

    return res.status(200).json({ message: "Email sent!" });

  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
