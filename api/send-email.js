export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { bin, desc, qty, type } = req.body;
  const subject = type === 'used' 
    ? `Part Used - ${bin}` 
    : `Reorder Request - ${bin}`;
  const body = `
Part: ${bin}
Description: ${desc}
Quantity ${type === 'used' ? 'Used' : 'To Order'}: ${qty}
`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: "onboarding@resend.dev",
      to: "braden@randolph.solutions",
      subject,
      text: body
    })
  });

  if (!response.ok) {
    return res.status(500).json({ message: "Failed to send email" });
  }

  return res.status(200).json({ message: "Email sent!" });
}
