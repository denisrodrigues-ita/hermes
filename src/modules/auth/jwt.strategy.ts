/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import * as fs from 'fs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    const publicKeyPath = configService.get<string>('KEYCLOAK_PUBLIC_KEY_PATH');
    const issuer = configService.get<string>('KEYCLOAK_ISSUER');

    if (!publicKeyPath || !fs.existsSync(publicKeyPath)) {
      super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: 'fallback-key-for-initialization',
      });
      return;
    }

    const publicKey = fs.readFileSync(publicKeyPath, 'utf8');

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
