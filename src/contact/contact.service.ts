import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

@Injectable()
export class ContactService {
  async sendMessage(name: string, email: string, subject: string, message: string) {
    resend.emails.send({
      from: 'A to Z Automation <noreply@atozautomation.de>',
      to: 'Atoz96automation@gmail.com',
      subject: `📩 New Contact Message: ${subject || 'No Subject'}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>From:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    }).then(() => console.log('Email sent (contact)'))
      .catch((err: any) => console.error('Email error (contact):', err.message));

    return { message: 'Message sent successfully' };
  }
}
