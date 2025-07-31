# How to obtain and configure the Keycloak public key for NestJS

> **Step-by-step guide to ensure correct validation of RS256 JWT tokens**

## 1. Access your realm's certificate endpoint

```bash
curl http://localhost:8080/realms/your-realm/.well-known/openid-configuration | jq
```

Look for the `jwks_uri` field in the response:

```json
{
  "jwks_uri": "http://localhost:8080/realms/your-realm/protocol/openid-connect/certs",
  ...
}
```

## 2. Download the Keycloak public certificate

```bash
curl http://localhost:8080/realms/your-realm/protocol/openid-connect/certs | jq
```

Look for the `x5c` field in the `keys` object. The value is the certificate in base64 (without line breaks).


Example:

```json
{
  "keys": [
    {
      "kid": "...",
      "kty": "RSA",
      ...
      "x5c": [
        "MIICmzCCAYMCBgG...UWAU="
      ]
    }
  ]
}
```

## 3. Save the certificate to a file

Create a file called `cert.pem` and paste the value from `x5c` between the headers:

```
-----BEGIN CERTIFICATE-----
MIICmzCCAYMCBgG...UWAU=
-----END CERTIFICATE-----
```

## 4. Convert the certificate to a PEM public key

In the terminal, run:

```bash
openssl x509 -pubkey -noout -in cert.pem > public.pem
```

The generated `public.pem` file will be the public key in the correct format for RS256 validation.



## 5. Configure the public key in .env

In your `.env` file, add:

```env
KEYCLOAK_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA6wuJ1w4wYK7nJxkvJ+CR\nBo6Q7VkKl0/lL7Gxp8l7it5tbzKj69t6vALjU5qzEHKCaJfSQ4N/nseXDAqBjSEL\nvk8J6VJAiPd99eVzqY+vi4uBIbv9yvCryq9hr2xU766Qd+n9nxzoCGbX7E1ZPlaa\nw1BWB9WpHum8zAeTyotcsU7VRzD/3nW/LtqmX+8bni9jLBrCijsqgsE1DOxcWrbl\nJJtRLRUyAu894vOdqWqPvXGJf1LNgO9Otbr0fH4gIM23u+dl72buU/jnGTtKEncB\nJSbevBdfJQnHX8xvNjJYZqUg7Else0uBYaJacF8Rn032QYuxAnY3aGyJ2ethVX57\nXwIDAQAB\n-----END PUBLIC KEY-----"
```

**Important:**
- Use double quotes and `\n` for each line break.


## 6. (Optional) Obtain the key from the Keycloak Admin Console

1. Log in to the Keycloak Admin Console
2. Select your realm
3. Go to "Realm Settings" > "Keys" > "Public Keys"
4. Copy the RSA public key
5. Save it in a `public.pem` file with the headers:
   - `-----BEGIN PUBLIC KEY-----` at the beginning
   - `-----END PUBLIC KEY-----` at the end



## 7. Important tips

- The issuer (`iss`) value of the JWT token must match the value of the `KEYCLOAK_ISSUER` variable in `.env`.
  - **How to obtain KEYCLOAK_ISSUER:**
    1. Access your realm's OpenID configuration endpoint:
       ```bash
       curl http://localhost:8080/realms/your-realm/.well-known/openid-configuration | jq .issuer
       ```
    2. The value returned (e.g., `http://localhost:8080/realms/your-realm`) is your issuer URL.
    3. Set this value in your `.env` file:
       ```env
       KEYCLOAK_ISSUER=http://localhost:8080/realms/your-realm
       ```
- The audience (`aud`) of the token should be `account` (default for Keycloak access tokens).
- Always use the public key in PEM format (with line breaks and headers).
- Do not use the value of the `n` field from JWKS directly; always extract the certificate or public key.

---
