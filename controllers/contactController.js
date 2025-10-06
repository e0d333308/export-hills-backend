import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendMessage = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Define subject variants
  const subjects = [
    "New Contact Form Submission",
    "You've received a message from ExportHills",
    "Someone submitted the contact form",
    "ExportHills: New inquiry received",
    "A new message just arrived"
  ];
  
  // Pick a random subject
  const subject = subjects[Math.floor(Math.random() * subjects.length)];
  
  // Define dynamic headers for each email
  const preHeaders = [
    `Message received at ${new Date().toLocaleTimeString()}`,
    `This was sent by ${name}`,
    `Submission at ${new Date().toLocaleString()}`,
    `${name} used the contact form`,
    `Received from ${email}`
  ];
  
  const preHeader = preHeaders[Math.floor(Math.random() * preHeaders.length)];
  
  try {
    // Save in DB
    const newMessage = new Contact({ name, email, message });
    await newMessage.save();

    // Send email with dynamic subject and header
    await resend.emails.send({
      from: "ExportHills <sales@exporthillsglobal.com>",
      to: process.env.CONTACT_EMAIL,
      subject: subject,
      html: `
        ${preHeader}
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <blockquote>${message}</blockquote>
        <br/>
        <p>— ExportHills Global Website</p>
      `,
      text: `
        ${preHeader}
        New Contact Form Submission
        Name: ${name}
        Email: ${email}
        Message: ${message}
        — ExportHills Global Website
      `
    });

    res.status(200).json({
      success: true,
      message: "Form saved in DB and sent to client email",
    });
  } catch (err) {
    console.error("❌ Contact form error:", err);
    res.status(500).json({
      error: "Failed to process message",
      details: err.message,
    });
  }
};
