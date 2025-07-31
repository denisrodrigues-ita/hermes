
import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ENV } from '../../config/env';

@Injectable()
export class AuthService {
  validateToken(token: string): object | null {
    try {
      const payload = JSON.parse(token) as Record<string, unknown>;
      return payload;
    } catch {
      const formattedKey = ENV.KEYCLOAK_PUBLIC_KEY || '';
      const issuer = ENV.KEYCLOAK_ISSUER;
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
