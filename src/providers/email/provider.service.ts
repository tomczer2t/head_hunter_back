import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailProviderService {
  constructor(private mailerService: MailerService) {}

  async sendMail(to: string, subject: string, html: string): Promise<any> {
    return await this.mailerService.sendMail({
      to,
      subject,
      html,
    });
  }
}
