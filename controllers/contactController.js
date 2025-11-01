// controllers/contactController.js
import { Resend } from "resend";
import Contact from "../models/Contact.js";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

// ✅ SEND MESSAGE (existing function)
export const sendMessage = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const subjects = [
    "New Contact Form Submission",
    "You've received a message from ExportHills",
    "Someone submitted the contact form",
    "ExportHills: New inquiry received",
    "A new message just arrived"
  ];
  const subject = subjects[Math.floor(Math.random() * subjects.length)];

  const preHeaders = [
    `Message received at ${new Date().toLocaleTimeString()}`,
    `This was sent by ${name}`,
    `Submission at ${new Date().toLocaleString()}`,
    `${name} used the contact form`,
    `Received from ${email}`
  ];
  const preHeader = preHeaders[Math.floor(Math.random() * preHeaders.length)];

  try {
    // Save to DB
    const newMessage = new Contact({ name, email, message });
    await newMessage.save();

    // Send notification email
    await resend.emails.send({
      from: "ExportHills <sales@exporthillsglobal.com>",
      to: process.env.CONTACT_EMAIL,
      subject,
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

// ✅ NEW — GET ALL CONTACT MESSAGES
export const getMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ NEW — DELETE A CONTACT MESSAGE
export const deleteMessage = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.json({ message: "Message deleted successfully!" });
  } catch (err) {
    console.error("Error deleting message:", err);
    res.status(500).json({ message: "Server error while deleting message" });
  }
};

