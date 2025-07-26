import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import * as fs from 'fs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    try {
      // Lê o caminho do arquivo da chave pública do .env
      const publicKeyPath = configService.get<string>(
        'KEYCLOAK_PUBLIC_KEY_PATH',
      );
      let publicKey = '';
      if (publicKeyPath) {
        publicKey = fs.readFileSync(publicKeyPath, 'utf8');
      } else {
        throw new Error('KEYCLOAK_PUBLIC_KEY_PATH não definido no .env');
      }

      super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: publicKey,
        algorithms: ['RS256'],
        issuer: configService.get<string>('KEYCLOAK_ISSUER'),
        audience: 'account',
      });
    } catch (error) {
      super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: 'fallback-key-for-initialization',
      });
    }
  }

  async validate(payload: any) {
    // Use o AuthService para validação adicional
    // Este método é chamado APÓS o Passport validar a assinatura do token
    // então aqui já temos o payload decodificado
    if (!payload) {
      throw new UnauthorizedException('Token inválido');
    }

    // Chamamos manualmente o AuthService para garantir que os logs sejam exibidos
    const validatedUser = await this.authService.validateToken(
      JSON.stringify(payload),
    );

    if (!validatedUser) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }

    return validatedUser; // Este objeto ficará disponível no Request como req.user
  }
}
