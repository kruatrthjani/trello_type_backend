import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const mailOptions = {
      from: process.env.SMTP_USER || 'test@example.com',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}`,
    };
    // console.log("send mail=",mailOptions)
    try {
      const transporter = await this.getTransporter();
      await transporter.sendMail(mailOptions);
      // console.log('is there');
      // Store OTP in Redis with 5 minutes TTL
      const encryptedOtp = await this.hashPassword(otp);
      console.log("encrypted otp=",encryptedOtp)
      await this.redisService.set(`otp:${email}`, encryptedOtp, 300);
      return "Otp sended successfully";
    } catch (error) {
      console.error('Email sending error:', error);
      throw new InternalServerErrorException('Failed to send email');
    }
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const storedOtp = await this.redisService.get(`otp:${email}`);
    if (!storedOtp) {
      return false;
    }
    console.log("before decrypt=",storedOtp)
    const isMatch = await this.comparePassword(otp, storedOtp);
    if (isMatch) {
      // Delete the OTP after successful verification
      await this.redisService.del(`otp:${email}`);
      return true;
    }
    return false;
  }
}