import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import * as fs from 'fs';
import * as passportJwt from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    const publicKeyPath = configService.get<string>('KEYCLOAK_PUBLIC_KEY_PATH');

    if (!publicKeyPath) {
      super({
        jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: 'fallback-key-for-initialization',
      });
      return;
    }

    try {
      const publicKey = fs.readFileSync(publicKeyPath, 'utf8');

      super({
        jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: publicKey,
        algorithms: ['RS256'],
        issuer: configService.get<string>('KEYCLOAK_ISSUER'),
        audience: 'account',
      });
    } catch (_fileError: unknown) {
      super({
        jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: 'fallback-key-for-initialization',
      });
    }
  }

  validate(payload: Record<string, unknown>) {
    if (!payload) {
      throw new UnauthorizedException('Token inválido');
    }
    const validatedUser = this.authService.validateToken(
      JSON.stringify(payload),
    );
    if (!validatedUser) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
    return validatedUser;
  }
}
