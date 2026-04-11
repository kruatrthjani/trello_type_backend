import {
  Injectable,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
  HttpException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  /* ---------------- TOKEN HELPERS ---------------- */

  private generateAccessToken(userId: string) {
    return jwt.sign(
      { sub: userId, type: 'access' },
      process.env.JWT_ACCESS_SECRET!,
      { expiresIn: '5m' },
    );
  }

  private generateRefreshToken(userId: string) {
    return jwt.sign(
      { sub: userId, type: 'refresh' },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '1d' },
    );
  }

  /* ---------------- REGISTER ---------------- */

  async register(dto: AuthDto) {
    const { email, password, name,role } = dto;

    if (!email || !password) {
      throw new BadRequestException('Email and password required');
    }

    const exists = await this.prisma.user.findUnique({ where: { email } });
    if (exists) throw new ConflictException('User already exists');

    const hash = await bcrypt.hash(password, 10);

    await this.prisma.user.create({
      data: { email, password: hash, name ,role},
    });

    return { message: 'User registered successfully' };
  }

  /* ---------------- LOGIN ---------------- */

  async login(dto: AuthDto) {
    const { email, password } = dto;

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !user.password || !password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return {
      accessToken: this.generateAccessToken(user.id),
      refreshToken: this.generateRefreshToken(user.id),
    };
  }

  /* ---------------- REFRESH TOKEN ---------------- */

  async refreshAccessToken(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException({ code: 'REFRESH_TOKEN_MISSING' });
    }

    try {
      const payload = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET!,
      ) as { sub: string; type: string };

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException({ code: 'INVALID_REFRESH_TOKEN' });
      }

      return {
        accessToken: this.generateAccessToken(payload.sub),
      };
    } catch {
      throw new HttpException(
        { code: 'REFRESH_TOKEN_EXPIRED', message: 'Session expired' },
        419,
      );
    }
  }

  /* ---------------- SOCIAL LOGIN ---------------- */

  async socialLogin(dto: AuthDto) {
    const { provider, code } = dto;

    if (!provider || !code) {
      throw new BadRequestException('Invalid social login payload');
    }

    let profile: {
      providerId: string;
      email: string;
      name?: string;
    };

    if (provider === 'google') {
      profile = await this.verifyGoogle(code);
    } else if (provider === 'github') {
      profile = await this.verifyGithub(code);
    } else {
      throw new BadRequestException('Unsupported provider');
    }

    let user = await this.prisma.user.findFirst({
      where: {
        provider,
        providerId: profile.providerId,
      },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          provider,
          providerId: profile.providerId,
          email: profile.email,
          name: profile.name ?? null,
          password: null,
        },
      });
    }

    return {
      accessToken: this.generateAccessToken(user.id),
      refreshToken: this.generateRefreshToken(user.id),
    };
  }

  /* ---------------- GOOGLE ---------------- */

  private async verifyGoogle(code: string) {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
        grant_type: 'authorization_code',
      }),
    });

    type GoogleTokenResponse = {
      id_token?: string;
    };

    const tokenData = (await tokenRes.json()) as GoogleTokenResponse;

    if (!tokenData.id_token) {
      throw new UnauthorizedException('Invalid Google auth code');
    }

    const decoded = jwt.decode(tokenData.id_token) as {
      sub: string;
      email: string;
      name?: string;
      aud?: string;
    } | null;

    if (!decoded || decoded.aud !== process.env.GOOGLE_CLIENT_ID) {
      throw new UnauthorizedException('Invalid Google token');
    }

    return {
      providerId: decoded.sub,
      email: decoded.email,
      name: decoded.name,
    };
  }

  /* ---------------- GITHUB ---------------- */

  private async verifyGithub(code: string) {
    const tokenRes = await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new URLSearchParams({
          client_id: process.env.GITHUB_CLIENT_ID!,
          client_secret: process.env.GITHUB_CLIENT_SECRET!,
          code,
        }),
      },
    );

    type GithubTokenResponse = {
      access_token?: string;
    };

    const tokenData = (await tokenRes.json()) as GithubTokenResponse;

    if (!tokenData.access_token) {
      throw new UnauthorizedException('Invalid GitHub auth code');
    }

    const userRes = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const emailRes = await fetch('https://api.github.com/user/emails', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    type GithubUser = {
      id: number;
      name: string | null;
    };

    type GithubEmail = {
      email: string;
      primary: boolean;
    };

    const user = (await userRes.json()) as GithubUser;
    const emails = (await emailRes.json()) as GithubEmail[];

    if (!user.id) {
      throw new UnauthorizedException('Invalid account data from GitHub');
    }

    const primaryEmail = emails.find(e => e.primary)?.email;

if (!primaryEmail) {
  throw new UnauthorizedException('Email not available from GitHub');
}

return {
  providerId: String(user.id),
  email: primaryEmail,
  name: user.name ?? undefined,
};
  }
}