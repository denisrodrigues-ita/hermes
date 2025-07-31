import { ENV } from './env';

export const keycloakConfig = () => ({
  keycloak: {
    publicKey: ENV.KEYCLOAK_PUBLIC_KEY,
    issuer: ENV.KEYCLOAK_ISSUER,
    clientId: ENV.KEYCLOAK_CLIENT_ID,
    url: ENV.KEYCLOAK_URL,
    realm: ENV.KEYCLOAK_REALM,
  },
});
