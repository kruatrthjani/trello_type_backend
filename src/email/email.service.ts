import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { RedisService } from '../redis/redis.service';
import * as bcrypt from 'bcrypt';
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
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });
      }
    }
    return this.transporter;
  }

   async hashPassword(password: string): Promise<string> {
     const saltRounds = 10;
     return await bcrypt.hash(password, saltRounds);
   }

   // Method to check password during login
   async comparePassword(password: string, hash: string): Promise<boolean> {
     return await bcrypt.compare(password, hash);
   }

  async sendOtpEmail(email: string): Promise<string> {
    const blockedKey = `otp:blocked:${email}`;
    const sendCountKey = `otp:send_count:${email}`;

    if (await this.redisService.exists(blockedKey)) {
      throw new BadRequestException(
        'Too many OTP requests or failed attempts. Try again later.',
      );
    }

    const sendCount = await this.redisService.incr(sendCountKey);
    if (sendCount === 1) {
      await this.redisService.expire(sendCountKey, 3600); // 1 hour window
    }

    const sendLimit = 5;
    if (sendCount > sendLimit) {
      await this.redisService.set(blockedKey, '1', 900); // 15 minute block
      throw new BadRequestException(
        'Too many OTP requests. Please try again after 15 minutes.',
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const mailOptions = {
      from: process.env.SMTP_USER || 'test@example.com',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}`,
    };

    try {
      const transporter = await this.getTransporter();
      await transporter.sendMail(mailOptions);

      const encryptedOtp = await this.hashPassword(otp);
      const otpData = {
        otp: encryptedOtp,
        isVerified: false,
      };

      await this.redisService.set(`otp:${email}`, JSON.stringify(otpData), 300);
      return 'Otp sended successfully';
    } catch (error) {
      console.error('Email sending error:', error);
      throw new InternalServerErrorException('Failed to send email');
    }
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const blockedKey = `otp:blocked:${email}`;
    const failedKey = `otp:failed:${email}`;
    const key = `otp:${email}`;

    if (await this.redisService.exists(blockedKey)) {
      throw new BadRequestException(
        'Too many failed OTP attempts. Try again later.',
      );
    }

    const storedOtp = await this.redisService.get(key);
    if (!storedOtp) {
      return false;
    }

    const parsed = JSON.parse(storedOtp);
    const isMatch = await this.comparePassword(otp, parsed.otp);

    if (isMatch) {
      await this.redisService.del(failedKey);
      await this.redisService.del(blockedKey);
      await this.redisService.del(key);
      return true;
    }

    const failedCount = await this.redisService.incr(failedKey);
    if (failedCount === 1) {
      await this.redisService.expire(failedKey, 600); // 10 minute window
    }

    const failLimit = 3;
    if (failedCount >= failLimit) {
      await this.redisService.set(blockedKey, '1', 900); // 15 minute block
    }

    return false;
  }
}