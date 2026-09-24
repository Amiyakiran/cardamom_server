//reset password
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendResetEmail = async (email, resetUrl) => {
    console.log('inside sendresetemail');
    
  await transporter.sendMail({
    from: `"Green Gold Spices" <${process.env.EMAIL_USER}>`,
    to: email,

    subject: "Reset Your Green Gold Spices Password",

    html: `
      <!DOCTYPE html>
      <html>
      <body style="
        margin:0;
        padding:0;
        background:#f5f2e9;
        font-family:Arial,sans-serif;
      ">

        <div style="
          max-width:600px;
          margin:40px auto;
          background:white;
          padding:40px;
          border-radius:12px;
        ">

          <h1 style="
            color:#176b3a;
            margin-bottom:10px;
          ">
            Green Gold Spices
          </h1>

          <h2>
            Reset Your Password
          </h2>

          <p>
            We received a request to reset the
            password for your account.
          </p>

          <p>
            Click the button below to create
            a new password.
          </p>

          <div style="
            margin:30px 0;
          ">

            <a
              href="${resetUrl}"
              style="
                background:#176b3a;
                color:white;
                padding:14px 25px;
                text-decoration:none;
                border-radius:8px;
                display:inline-block;
              "
            >
              Reset Password
            </a>

          </div>

          <p>
            This link will expire in 30 minutes.
          </p>

          <p style="color:#777;">
            If you didn't request this password
            reset, you can safely ignore this email.
          </p>

          <hr />

          <p style="color:#777;">
            Green Gold Spices
          </p>

        </div>

      </body>
      </html>
    `,
  });
};

module.exports = {sendResetEmail,};