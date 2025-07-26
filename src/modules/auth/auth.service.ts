import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private configService: ConfigService) {}

  async validateToken(token: string): Promise<any> {
    try {
      if (typeof token === 'object') {
        return token;
      }

      let payload;

      try {
        payload = JSON.parse(token);
        return payload;
      } catch (e) {
        try {
          const publicKey =
            this.configService.get<string>('KEYCLOAK_PUBLIC_KEY') || '';

          const formattedKey = publicKey.replace(/\\n/g, '\n');

          const issuer = this.configService.get<string>('KEYCLOAK_ISSUER');
          const audience = this.configService.get<string>('KEYCLOAK_CLIENT_ID');

          const verifiedToken = jwt.verify(token, formattedKey, {
            algorithms: ['RS256'],
            issuer: issuer,
            audience: 'account',
          });

          return verifiedToken;
        } catch (jwtError) {
          try {
            throw new Error(
              'Jsonwebtoken verification failed, jose is not configured for RS256',
            );
          } catch (joseError) {
            throw joseError;
          }
        }
      }
    } catch (error) {
      return null;
    }
  }

  hasRole(user: any, requiredRole: string): boolean {
    if (!user || !user.realm_access || !user.realm_access.roles) {
      return false;
    }
    const has = user.realm_access.roles.includes(requiredRole);
    return has;
  }
}
