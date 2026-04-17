import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

@Injectable()
export class ContactService {
  async sendMessage(name: string, email: string, subject: string, message: string) {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'Atoz96automation@gmail.com',
      subject: `📩 New Contact Message: ${subject || "No Subject"}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>From:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    return { message: 'Message sent successfully' };
  }
}