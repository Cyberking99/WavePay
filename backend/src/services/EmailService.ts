import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    private async compileTemplate(templateName: string, data: any): Promise<string> {
        const templatePath = path.join(__dirname, '../templates', `${templateName}.hbs`);
        const templateSource = fs.readFileSync(templatePath, 'utf-8');
        const template = handlebars.compile(templateSource);
        return template(data);
    }

    async sendWelcomeEmail(to: string, name: string): Promise<void> {
        try {
            const html = await this.compileTemplate('onboarding', {
                name,
                dashboardUrl: `${process.env.FRONTEND_URL}/dashboard`,
            });

            await this.transporter.sendMail({
                from: process.env.SMTP_FROM,
                to,
                subject: 'Welcome to WavePay!',
                html,
            });

            console.log(`Welcome email sent to ${to}`);
        } catch (error) {
            console.error('Error sending welcome email:', error);
        }
    }
}

export default new EmailService();
