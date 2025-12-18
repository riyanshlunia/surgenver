import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, participantName, eventName, certificateUrl, verificationUrl, customMessage } = body;

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'certificates@yourdomain.com',
      to,
      subject: `Your Certificate for ${eventName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
              .button:hover { background: #5568d3; }
              .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
              .message-box { background: #fff; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; font-style: italic; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎓 Congratulations ${participantName}!</h1>
              </div>
              <div class="content">
                <p>You have successfully completed <strong>${eventName}</strong>!</p>
                
                ${customMessage ? `<div class="message-box">${customMessage}</div>` : ''}

                <p>Your certificate of completion is now ready for download.</p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${certificateUrl}" class="button">📥 Download Certificate</a>
                  <a href="${verificationUrl}" class="button">✓ Verify Certificate</a>
                </div>
                
                <p><strong>What you can do:</strong></p>
                <ul>
                  <li>Download your certificate and share it on social media</li>
                  <li>Add it to your LinkedIn profile</li>
                  <li>Use the verification link to prove authenticity</li>
                </ul>
                
                <p style="margin-top: 30px; padding: 15px; background: #e3f2fd; border-left: 4px solid #2196f3; border-radius: 4px;">
                  <strong>📌 Pro Tip:</strong> Your certificate has a unique verification code. Anyone can verify its authenticity using the verification link above.
                </p>
              </div>
              <div class="footer">
                <p>This is an automated email. Please do not reply.</p>
                <p>© ${new Date().getFullYear()} Certificate Pro. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, messageId: data?.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
