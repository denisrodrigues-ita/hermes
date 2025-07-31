import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

export const ENV = {
  NODE_ENV: configService.getOrThrow<string>('NODE_ENV'),
  PORT: configService.getOrThrow<string>('PORT'),
  KEYCLOAK_PUBLIC_KEY: configService.getOrThrow<string>('KEYCLOAK_PUBLIC_KEY')?.replace(/\n/g, '\n'),
  KEYCLOAK_ISSUER: configService.getOrThrow<string>('KEYCLOAK_ISSUER'),
  KEYCLOAK_CLIENT_ID: configService.getOrThrow<string>('KEYCLOAK_CLIENT_ID'),
  KEYCLOAK_URL: configService.getOrThrow<string>('KEYCLOAK_URL'),
  KEYCLOAK_REALM: configService.getOrThrow<string>('KEYCLOAK_REALM'),
  KEYCLOAK_CLIENT_SECRET: configService.getOrThrow<string>('KEYCLOAK_CLIENT_SECRET'),
};
