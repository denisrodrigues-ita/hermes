
# Como obter e configurar a chave pública do Keycloak para NestJS

> **Passo a passo completo para garantir a validação correta de tokens JWT RS256**

## 1. Acesse o endpoint de certificados do seu realm

```bash
curl http://localhost:8080/realms/your-realm/.well-known/openid-configuration | jq
```

Procure pelo campo `jwks_uri` na resposta:

```json
{
  "jwks_uri": "http://localhost:8080/realms/your-realm/protocol/openid-connect/certs",
  ...
}
```

## 2. Baixe o certificado público do Keycloak

```bash
curl http://localhost:8080/realms/your-realm/protocol/openid-connect/certs | jq
```

Procure pelo campo `x5c` no objeto `keys`. O valor é o certificado em base64 (sem quebras de linha).

Exemplo:

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

## 3. Salve o certificado em um arquivo

Crie um arquivo chamado `cert.pem` e cole o valor do `x5c` entre os cabeçalhos:

```
-----BEGIN CERTIFICATE-----
MIICmzCCAYMCBgG...UWAU=
-----END CERTIFICATE-----
```

## 4. Converta o certificado para chave pública PEM

No terminal, execute:

```bash
openssl x509 -pubkey -noout -in cert.pem > public.pem
```

O arquivo `public.pem` gerado será a chave pública no formato correto para validação RS256.

## 5. Configure o caminho da chave pública no .env

No seu arquivo `.env`, adicione:

```env
KEYCLOAK_PUBLIC_KEY_PATH=./certs/public.pem
```

E ajuste o código para ler a chave pública desse arquivo (já está implementado no projeto).

## 6. (Opcional) Obtenha a chave pelo Admin Console do Keycloak

1. Faça login no Admin Console do Keycloak
2. Selecione seu realm
3. Vá para "Realm Settings" > "Keys" > "Public Keys"
4. Copie a chave RSA pública
5. Salve em um arquivo `public.pem` com os cabeçalhos:
   - `-----BEGIN PUBLIC KEY-----` no início
   - `-----END PUBLIC KEY-----` no final

## 7. Dicas importantes

- O valor do issuer (`iss`) do token JWT deve ser igual ao valor da variável `KEYCLOAK_ISSUER` no `.env`.
- O audience (`aud`) do token deve ser `account` (padrão do Keycloak para access tokens).
- Sempre use a chave pública no formato PEM (com quebras de linha e cabeçalhos).
- Não use o valor do campo `n` do JWKS diretamente, sempre extraia o certificado ou a chave pública.

---

Pronto! Agora sua aplicação NestJS está pronta para validar tokens JWT do Keycloak usando RS256 de forma segura e compatível.
