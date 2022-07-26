import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailProviderService {
  constructor(private mailerService: MailerService) {}

  async sendMail(
    to: string,
    subject: string,
    html: string,
  ): Promise<{ isOk: boolean; email: string }> {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        html,
      });
      return { isOk: true, email: to };
    } catch (err) {
      return { isOk: false, email: to };
    }
  }
}
