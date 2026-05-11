import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendActivationEmail(data: {
    to: string;
    name: string;
    activationLink: string;
  }) {
    const info = await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: data.to,
      subject: 'Activa tu cuenta en Easy Clinic',
      html: this.activationTemplate(data.name, data.activationLink),
    });

    console.log('📩 Email preview:', nodemailer.getTestMessageUrl(info));
  }

  private activationTemplate(name: string, link: string): string {
    return `
      <h2>Hola ${name} 👋</h2>
      <p>Para activar tu cuenta haz clic aquí:</p>
      <a href="${link}">Activar cuenta</a>
      <p>Este enlace expira en 24 horas.</p>
    `;
  }
}
