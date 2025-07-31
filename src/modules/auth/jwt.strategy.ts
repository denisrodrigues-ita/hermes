/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ENV } from '../../config/env';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    const issuer = ENV.KEYCLOAK_ISSUER;
    const publicKey = ENV.KEYCLOAK_PUBLIC_KEY;
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: publicKey,
      algorithms: ['RS256'],
      issuer: issuer,
      audience: 'account',
    });
  }

  validate(payload: Record<string, unknown>): object {
    if (!payload) {
      throw new UnauthorizedException('Invalid token');
    }

    const payloadString = JSON.stringify(payload);

    const validatedUser = this.authService.validateToken(payloadString);

    if (!validatedUser) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return validatedUser;
  }
}
