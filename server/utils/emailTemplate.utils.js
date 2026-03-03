const getEmailTemplate = (title, content, buttonText, buttonUrl, footerText) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
            body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                background-color: #f8fafc;
                margin: 0;
                padding: 0;
                color: #1e293b;
            }
            .container {
                max-width: 600px;
                margin: 40px auto;
                background: #ffffff;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
                border: 1px solid #e2e8f0;
            }
            .header {
                background: #4338ca;
                padding: 40px 20px;
                text-align: center;
                color: #ffffff;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
                font-weight: 700;
                letter-spacing: -0.5px;
            }
            .content {
                padding: 40px;
                line-height: 1.6;
            }
            .content h2 {
                color: #0f172a;
                font-size: 20px;
                margin-top: 0;
            }
            .otp-box {
                background: #f1f5f9;
                border-radius: 12px;
                padding: 20px;
                text-align: center;
                margin: 30px 0;
                border: 1px dashed #cbd5e1;
            }
            .otp-code {
                font-size: 32px;
                font-weight: 800;
                color: #4338ca;
                letter-spacing: 8px;
            }
            .button {
                display: inline-block;
                padding: 14px 28px;
                background-color: #4338ca;
                color: #ffffff !important;
                text-decoration: none;
                border-radius: 12px;
                font-weight: 600;
                margin-top: 20px;
            }
            .footer {
                padding: 20px;
                text-align: center;
                font-size: 13px;
                color: #64748b;
                background: #f8fafc;
                border-top: 1px solid #e2e8f0;
            }
            .social-links {
                margin-top: 15px;
            }
            .social-links a {
                margin: 0 10px;
                color: #4338ca;
                text-decoration: none;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>IMS PORTAL</h1>
            </div>
            <div class="content">
                <h2>${title}</h2>
                <p>${content}</p>
                
                ${buttonText && buttonUrl ? `
                    <div style="text-align: center;">
                        <a href="${buttonUrl}" class="button">${buttonText}</a>
                    </div>
                ` : ''}

                <p style="margin-top: 30px;">If you did not request this, please ignore this email.</p>
                <p>Regards,<br><strong>IMS Team</strong></p>
            </div>
            <div class="footer">
                <p>© ${new Date().getFullYear()} Internship Management System. All rights reserved.</p>
                <p>${footerText || 'Empowering careers through professional excellence.'}</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

export const getOTPTemplate = (otp) => {
    const title = "Account Verification";
    const content = `Welcome to the IMS Portal! Please use the following One-Time Password (OTP) to verify your account. This code is valid for 10 minutes.`;
    const baseTemplate = getEmailTemplate(title, content, null, null, "Your security is our priority.");

    // Inject OTP box into the content
    return baseTemplate.replace('<p style="margin-top: 30px;">', `
        <div class="otp-box">
            <div style="font-size: 14px; color: #64748b; margin-bottom: 8px;">YOUR VERIFICATION CODE</div>
            <div class="otp-code">${otp}</div>
        </div>
        <p style="margin-top: 30px;">`);
};

export const getResetOTPTemplate = (otp) => {
    const title = "Password Reset OTP";
    const content = `We received a request to reset your password. Use the following OTP to verify your identity. This code is valid for 10 minutes.`;
    const baseTemplate = getEmailTemplate(title, content, null, null, "Secure your account with ease.");

    return baseTemplate.replace('<p style="margin-top: 30px;">', `
        <div class="otp-box">
            <div style="font-size: 14px; color: #64748b; margin-bottom: 8px;">PASSWORD RESET CODE</div>
            <div class="otp-code">${otp}</div>
        </div>
        <p style="margin-top: 30px;">`);
};

export const getResetTemplate = (resetToken) => {
    const title = "Password Reset Request";
    const content = `We received a request to reset your password. Click the button below to set a new password. This link will expire in 10 minutes.`;
    const buttonUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

    return getEmailTemplate(title, content, "Reset Password", buttonUrl, "Secure your account with a strong password.");
};
