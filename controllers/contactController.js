import nodemailer from "nodemailer";
import Contact from "../models/Contact.js";

export const sendMessage = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // 1. Save in DB
    const newMessage = new Contact({ name, email, message });
    await newMessage.save();

    // 2. Gmail SMTP using App Password
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // 3. Send email
    await transporter.sendMail({
      from: `"ExportHills Contact" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL,
      subject: "📩 New Contact Form Submission",
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <blockquote>${message}</blockquote>
        <br/>
        <p>— ExportHills Global Website</p>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Form saved in DB and sent to client email",
    });
  } catch (err) {
    console.error("❌ Contact form error:", err);
    res.status(500).json({ error: "Failed to process message", details: err.message });
  }
};
