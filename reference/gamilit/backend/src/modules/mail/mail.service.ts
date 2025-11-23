import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// TODO: Instalar nodemailer: npm install nodemailer @types/nodemailer
// import * as nodemailer from 'nodemailer';
// import { Transporter } from 'nodemailer';

type Transporter = any; // Temporal hasta instalar nodemailer

/**
 * Mail Service
 *
 * ISSUE: #10 (P1) - Integración Email Service
 * FECHA: 2025-11-04
 * SPRINT: Sprint 0 - Día 2
 *
 * Gestiona el envío de emails usando Nodemailer
 * Soporta: SMTP, SendGrid, Mailgun
 */
@Injectable()
export class MailService {
  private transporter: Transporter;
  private readonly logger = new Logger(MailService.name);
  private readonly frontendUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
    this.initializeTransporter();
  }

  /**
   * Inicializar transporter de Nodemailer
   */
  private initializeTransporter() {
    const smtpHost = this.configService.get<string>('SMTP_HOST');
    const smtpPort = this.configService.get<number>('SMTP_PORT', 587);
    const smtpUser = this.configService.get<string>('SMTP_USER');
    const smtpPass = this.configService.get<string>('SMTP_PASS');
    const smtpSecure = this.configService.get<boolean>('SMTP_SECURE', false);

    if (!smtpHost || !smtpUser || !smtpPass) {
      this.logger.warn('SMTP credentials not configured. Emails will be logged only.');
      return;
    }

    // TODO: Descomentar cuando nodemailer esté instalado
    /*
    this.transporter = nodemailer.createTransporter({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure, // true para puerto 465, false para otros
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });

    // Verificar conexión
    this.transporter.verify((error, success) => {
      if (error) {
        this.logger.error('SMTP connection failed:', error);
      } else {
        this.logger.log('SMTP server ready to send emails');
      }
    });
    */
  }

  /**
   * Enviar email de recuperación de contraseña
   */
  async sendPasswordResetEmail(email: string, token: string, userName?: string): Promise<void> {
    const resetUrl = `${this.frontendUrl}/reset-password/${token}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Recuperación de Contraseña</h1>
            <p>GAMILIT Platform</p>
          </div>
          <div class="content">
            <p>Hola ${userName || 'Usuario'},</p>
            <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en GAMILIT.</p>
            <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>
            <p style="text-align: center;">
              <a href="${resetUrl}" class="button">Restablecer Contraseña</a>
            </p>
            <p>O copia y pega este enlace en tu navegador:</p>
            <p style="word-break: break-all; background: #e0e0e0; padding: 10px; border-radius: 5px;">
              ${resetUrl}
            </p>
            <p><strong>⏰ Este enlace expirará en 1 hora.</strong></p>
            <p>Si no solicitaste este cambio, puedes ignorar este correo de forma segura.</p>
            <p>Saludos,<br>El equipo de GAMILIT</p>
          </div>
          <div class="footer">
            <p>Este es un correo automático, por favor no respondas.</p>
            <p>&copy; 2025 GAMILIT - Plataforma Educativa Gamificada</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject: 'Recuperación de Contraseña - GAMILIT',
      html: htmlContent
    });

    this.logger.log(`Password reset email sent to: ${email}`);
  }

  /**
   * Enviar email de verificación de cuenta
   */
  async sendVerificationEmail(email: string, token: string, userName?: string): Promise<void> {
    const verifyUrl = `${this.frontendUrl}/verify-email/${token}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✉️ Verifica tu Email</h1>
            <p>GAMILIT Platform</p>
          </div>
          <div class="content">
            <p>¡Bienvenido/a ${userName || 'Usuario'}!</p>
            <p>Gracias por registrarte en GAMILIT. Para completar tu registro, por favor verifica tu dirección de correo electrónico.</p>
            <p style="text-align: center;">
              <a href="${verifyUrl}" class="button">Verificar Email</a>
            </p>
            <p>O copia y pega este enlace en tu navegador:</p>
            <p style="word-break: break-all; background: #e0e0e0; padding: 10px; border-radius: 5px;">
              ${verifyUrl}
            </p>
            <p><strong>⏰ Este enlace expirará en 24 horas.</strong></p>
            <p>¡Nos vemos pronto en GAMILIT!</p>
            <p>Saludos,<br>El equipo de GAMILIT</p>
          </div>
          <div class="footer">
            <p>Este es un correo automático, por favor no respondas.</p>
            <p>&copy; 2025 GAMILIT - Plataforma Educativa Gamificada</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject: 'Verifica tu Email - GAMILIT',
      html: htmlContent
    });

    this.logger.log(`Verification email sent to: ${email}`);
  }

  /**
   * Enviar email de bienvenida
   */
  async sendWelcomeEmail(email: string, userName: string, role: string): Promise<void> {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .feature { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #667eea; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 ¡Bienvenido/a a GAMILIT!</h1>
            <p>Plataforma Educativa Gamificada</p>
          </div>
          <div class="content">
            <p>Hola <strong>${userName}</strong>,</p>
            <p>¡Estamos emocionados de tenerte como ${role === 'student' ? 'estudiante' : 'profesor'}!</p>

            <h3>🚀 Comienza tu aventura:</h3>
            <div class="feature">
              <strong>📚 Módulos Educativos</strong>
              <p>Accede a contenido educativo de calidad adaptado a tu nivel.</p>
            </div>
            <div class="feature">
              <strong>🏆 Sistema de Rangos Maya</strong>
              <p>Progresa desde Ajaw hasta K'uk'ulkan y desbloquea recompensas.</p>
            </div>
            <div class="feature">
              <strong>💰 ML Coins</strong>
              <p>Gana monedas virtuales y usa power-ups para mejorar tu aprendizaje.</p>
            </div>

            <p style="text-align: center;">
              <a href="${this.frontendUrl}/dashboard" class="button">Ir al Dashboard</a>
            </p>

            <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
            <p>¡Feliz aprendizaje!</p>
            <p>Saludos,<br>El equipo de GAMILIT</p>
          </div>
          <div class="footer">
            <p>Este es un correo automático, por favor no respondas.</p>
            <p>&copy; 2025 GAMILIT - Plataforma Educativa Gamificada</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject: '¡Bienvenido/a a GAMILIT! 🎉',
      html: htmlContent
    });

    this.logger.log(`Welcome email sent to: ${email}`);
  }

  /**
   * Método genérico para enviar emails
   */
  private async sendEmail(options: {
    to: string;
    subject: string;
    html: string;
    from?: string;
  }): Promise<void> {
    const from = options.from || this.configService.get<string>('MAIL_FROM', 'GAMILIT <noreply@gamilit.com>');

    // Si no hay transporter configurado, solo loggear
    if (!this.transporter) {
      this.logger.warn(`[MOCK EMAIL] To: ${options.to} | Subject: ${options.subject}`);
      this.logger.debug(`Email content:\n${options.html}`);
      return;
    }

    try {
      const info = await this.transporter.sendMail({
        from,
        to: options.to,
        subject: options.subject,
        html: options.html
      });

      this.logger.log(`Email sent successfully: ${info.messageId}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${options.to}:`, error);
      throw error;
    }
  }
}
