import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

interface SendMailSuccess {
  isOk: true;
}

interface SendMailError {
  isOk: false;
  email: string;
  error: string;
}

type SendMailResponse = SendMailSuccess | SendMailError;

@Injectable()
export class EmailProviderService {
  constructor(private mailerService: MailerService) {}

  async sendMail(
    to: string,
    subject: string,
    html: string,
  ): Promise<SendMailResponse> {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        html,
      });
      return { isOk: true };
    } catch (err) {
      console.log(err);
      return { isOk: false, email: to, error: err.message };
    }
  }
}
