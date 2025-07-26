import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private configService: ConfigService) {}

  validateToken(token: string): object | null {
    if (typeof token === 'object') {
      return token;
    }

    try {
      const payload = JSON.parse(token) as Record<string, unknown>;
      return payload;
    } catch {
      const publicKey =
        this.configService.get<string>('KEYCLOAK_PUBLIC_KEY') || '';
      const formattedKey = publicKey.replace(/\n/g, '\n');
      const issuer = this.configService.get<string>('KEYCLOAK_ISSUER');
      try {
        const verifiedToken = jwt.verify(token, formattedKey, {
          algorithms: ['RS256'],
          issuer: issuer,
          audience: 'account',
        }) as object;
        return verifiedToken;
      } catch {
        return null;
      }
    }
  }

  hasRole(
    user: { realm_access?: { roles?: string[] } } | null,
    requiredRole: string,
  ): boolean {
    if (
      !user ||
      !user.realm_access ||
      !Array.isArray(user.realm_access.roles)
    ) {
      return false;
    }
    return user.realm_access.roles.includes(requiredRole);
  }
}
