# HTTPS Setup for Local Development

This guide explains how to set up HTTPS for local development in the Hermes API project.

## Why use HTTPS in development?

- Testing secure cookies and HTTP-only cookies
- Testing security headers and policies
- Simulating production environment more accurately
- Required by some modern browser features and APIs

## Using the provided script

We've created a script that makes it easy to generate self-signed SSL certificates for local development. **Note: The certificates will be generated in the directory where you run this script.**

```bash
#!/bin/sh
# filepath: generate-ssl-cert.sh

set -e

# Check if openssl is installed
if ! command -v openssl > /dev/null; then
  echo "OpenSSL is not installed. Installing..."
  apk add --no-cache openssl
fi

echo "Generating SSL certificates for localhost..."

# Create directory for certificates if it doesn't exist
mkdir -p "$(pwd)"

# Generate private key
openssl genrsa -out ssl.key 2048

# Generate certificate configuration
cat > openssl.cnf << EOF
[req]
default_bits = 2048
prompt = no
default_md = sha256
distinguished_name = dn
x509_extensions = v3_req

[dn]
C=BR
ST=Sao Paulo
L=Sao Paulo
O=Hermes
OU=TI
CN=localhost
emailAddress=denisrodrigues.ita@gmail.com

[v3_req]
subjectAltName = @alt_names
basicConstraints = CA:FALSE
keyUsage = nonRepudiation, digitalSignature, keyEncipherment

[alt_names]
DNS.1 = localhost
IP.1 = 127.0.0.1
EOF

# Generate self-signed certificate
openssl req -new -x509 -key ssl.key -out ssl.crt -days 365 -config openssl.cnf

# Remove temporary configuration file
rm openssl.cnf

echo "✅ Certificates successfully generated!"
echo "📁 Files generated in folder $(pwd):"
echo "   - ssl.key (private key)"
echo "   - ssl.crt (certificate)"
```

> **Important:** The certificate files will be generated in the current directory where the script is executed. If you want to generate the certificates in a specific location, navigate to that directory before running the script.

## Configuring the application

After generating the certificates, you need to add them to your `.env` file as environment variables:

```
# SSL Configuration for local HTTPS
SSL_KEY="-----BEGIN PRIVATE KEY-----\n...(your key content)...\n-----END PRIVATE KEY-----"
SSL_CRT="-----BEGIN CERTIFICATE-----\n...(your certificate content)...\n-----END CERTIFICATE-----"
```

### Converting certificates to environment variable format

To properly format your certificates for the `.env` file, you can use these commands:

```bash
# For the key
awk 'NF {sub(/\r/, ""); printf "%s\\n", $0}' ssl.key

# For the certificate
awk 'NF {sub(/\r/, ""); printf "%s\\n", $0}' ssl.crt
```

Copy the output of these commands and use them as values for the `SSL_KEY` and `SSL_CRT` environment variables.

## Browser Trust Configuration

When using self-signed certificates, browsers will show security warnings. For development purposes, you can:

1. **Chrome/Edge**: Click "Advanced" > "Proceed to localhost (unsafe)"
2. **Firefox**: Click "Advanced" > "Accept the Risk and Continue"
3. **Safari**: Click "Show Details" > "visit this website" > "Visit Website"

For a better development experience, you can add the certificate to your system's trusted certificates, but the process varies by operating system.

## Security Considerations

- Self-signed certificates should **never** be used in production environments
- The generated certificates are only valid for `localhost` and `127.0.0.1`
- Certificate validity is set to 365 days by default
