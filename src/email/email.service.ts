import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor(private readonly redisService: RedisService) {}

  private async getTransporter(): Promise<nodemailer.Transporter> {
    if (!this.transporter) {
      // console.log("process=",process.env.SMTP_PASS)
      
      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        // Use Ethereal for testing
        const testAccount = await nodemailer.createTestAccount();
        console.log("test account=",testAccount)
        console.log('Using Ethereal test account:', testAccount);
        this.transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          // host: 'smtp.gmail.com',
          port: 465 ,
          secure: true,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
          // tls:{
          //   rejectUnauthorized:false,
          // }
        });
      } else {
        console.log('SMTP Config:', {
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: process.env.SMTP_PORT || '587',
          user: 'SET',
          pass: 'SET',
        });
        this.transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: true,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });
      }
    }
    return this.transporter;
  }

  async sendOtpEmail(email: string): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const mailOptions = {
      from: process.env.SMTP_USER || 'test@example.com',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}`,
    };
    console.log("send mail=",mailOptions)
    try {
      const transporter = await this.getTransporter();
      await transporter.sendMail(mailOptions);
      // Store OTP in Redis with 5 minutes TTL
      await this.redisService.set(`otp:${email}`, otp, 300);
      return otp;
    } catch (error) {
      console.error('Email sending error:', error);
      throw new InternalServerErrorException('Failed to send email');
    }
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const storedOtp = await this.redisService.get(`otp:${email}`);
    if (storedOtp === otp) {
      // Delete the OTP after successful verification
      await this.redisService.del(`otp:${email}`);
      return true;
    }
    return false;
  }
}