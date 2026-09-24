
const nodemailer = require("nodemailer");
const messages = require("../models/messageModel");

//send message
exports.sendMessageController = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        console.log(name, email, subject, message);

        // Validate required fields
        if (!name || !email || !message || !subject) {
            return res.status(400).json({
                success: false,
                message: "Name, email, subject and message are required",
            });
        }

        // Create email transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        // Send email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            replyTo: email,

            subject: subject
                ? `Website Contact: ${subject}`
                : `New message from ${name}`,

            text: `
                  New message from your website - Green Gold Spices

                  Name: ${name}
                  Email: ${email}
                  Subject: ${subject}

                  Message:${message}`,
        });
        const newMessage = await messages.create({
            name,
            email,
            subject,
            message
        })
        return res.status(200).json({
            success: true,
            message: "Message sent successfully",
        });

    } catch (error) {
        console.error("Contact form error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to send message",
        });
    }
}