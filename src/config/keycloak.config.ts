export const keycloakConfig = () => ({
  keycloak: {
    publicKey: process.env.KEYCLOAK_PUBLIC_KEY,
    issuer: process.env.KEYCLOAK_ISSUER,
    clientId: process.env.KEYCLOAK_CLIENT_ID,
    url: process.env.KEYCLOAK_URL,
    realm: process.env.KEYCLOAK_REALM,
  },
});
