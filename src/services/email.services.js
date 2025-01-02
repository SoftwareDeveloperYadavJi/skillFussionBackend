import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const sendEmail = async (to, subject, text, userName, platformUrl, unsubscribeUrl) => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.Google_Email, // Your Gmail address
      pass: process.env.Email_Pass,  // Your Gmail App Password
    },
  });

  // Define email options
  const mailOptions = {
    from: process.env.Google_Email, // Sender address
    to, // Recipient email
    subject, // Subject line
    text, // Plain text body
    html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to LearnSwap</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f5;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 0;">
                <table role="presentation"
                  style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  <tr>
                    <td style="background: linear-gradient(135deg, #6B46C1 0%, #319795 100%); padding: 40px 20px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Welcome to LearnSwap</h1>
                      <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Where Skills Meet Opportunities</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 40px 30px;">
                      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5; color: #4a5568;">
                        Hi ${userName},
                      </p>
                      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5; color: #4a5568;">
                        Welcome to LearnSwap! We're excited to have you join our community of learners and teachers. Your journey of skill exchange and growth begins now.
                      </p>
                      <table role="presentation" style="width: 100%; margin: 30px 0;">
                        <tr>
                          <td style="text-align: center;">
                            <a href="${platformUrl}"
                              style="display: inline-block; padding: 14px 30px; background-color: #6B46C1; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                              Get Started Now
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="background-color: #f8fafc; padding: 30px 20px; text-align: center;">
                      <p style="margin: 0; color: #718096; font-size: 12px;">
                        You received this email because you signed up for LearnSwap.<br>
                        To unsubscribe, <a href="${unsubscribeUrl}" style="color: #6B46C1; text-decoration: underline;">click here</a>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  };

  try {
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error occurred:', error.message);
  }
};
