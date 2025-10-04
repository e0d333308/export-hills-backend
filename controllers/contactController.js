import { Resend } from "resend";
import Contact from "../models/Contact.js";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendMessage = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // 1. Save in DB
    const newMessage = new Contact({ name, email, message });
    await newMessage.save();

    // 2. Send email using Resend API
    await resend.emails.send({
      from: "ExportHills <sales@exporthillsglobal.com>",
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
    res.status(500).json({
      error: "Failed to process message",
      details: err.message,
    });
  }
};
