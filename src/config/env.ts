import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

export const ENV = {
  KEYCLOAK_PUBLIC_KEY: configService.get<string>('KEYCLOAK_PUBLIC_KEY')?.replace(/\n/g, '\n'),
  KEYCLOAK_ISSUER: configService.get<string>('KEYCLOAK_ISSUER'),
  KEYCLOAK_CLIENT_ID: configService.get<string>('KEYCLOAK_CLIENT_ID'),
  KEYCLOAK_URL: configService.get<string>('KEYCLOAK_URL'),
  KEYCLOAK_REALM: configService.get<string>('KEYCLOAK_REALM'),
  PORT: configService.get<string>('PORT'),
};
