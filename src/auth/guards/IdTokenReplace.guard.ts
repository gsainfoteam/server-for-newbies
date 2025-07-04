import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class IdTokenReplaceGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    if (request.headers.authorization) {
      const bearerAuthHeader = request.headers.authorization.split(' ');
      if (bearerAuthHeader[0] === 'Bearer') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        request.body = {
          ...(request.body || {}),
          idToken: bearerAuthHeader[1],
        };
      }
    }
    return true;
  }
}
