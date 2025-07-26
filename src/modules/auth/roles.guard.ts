import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from './auth.service';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    console.log('Request user:', request.user);
    const { user } = request;

    if (!user) {
      console.log('Usuário não encontrado no request');
      return false;
    }

    const hasRole = requiredRoles.some((role) =>
      this.authService.hasRole(user, role),
    );

    console.log('Usuário tem as roles necessárias?', hasRole);

    if (!hasRole) {
      console.log('Acesso negado: roles insuficientes');
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    console.log('Acesso permitido: roles verificadas com sucesso');
    return true;
  }
}
