import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, JwtFromRequestFunction } from 'passport-jwt';
import { Request } from 'express';

interface JwtPayload {
  userId: string;
  email: string;
}

interface RequestWithCookies extends Request {
  cookies: {
    access_token?: string;
  };
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ((req: Request): string | null => {
          const cookies = (req as RequestWithCookies).cookies;
          return typeof cookies?.access_token === 'string'
            ? cookies.access_token
            : null;
        }) as JwtFromRequestFunction,
      ]),

      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secret',
    });
  }

  validate(payload: JwtPayload): {
    userId: string;
    email: string;
  } {
    return {
      userId: payload.userId,
      email: payload.email,
    };
  }
}
