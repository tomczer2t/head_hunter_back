import { registerAs } from '@nestjs/config';

export const emailConfiguration = registerAs('email', () => ({
  user: process.env.EMAIL_USER,
  password: process.env.EMAIL_PASSWORD,
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  from: process.env.EMAIL_FROM,
}));
