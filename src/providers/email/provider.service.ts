import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailProviderService {
  constructor(private mailerService: MailerService) {}

  //@todo add correct response type
  async sendMail(to: string, subject: string, html: string): Promise<any> {
    const sendMailResponse = await this.mailerService.sendMail({
      to,
      subject,
      html,
    });
    console.log({ sendMailResponse });
    return sendMailResponse;
  }
}
