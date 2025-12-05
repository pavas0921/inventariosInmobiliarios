import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class InternalApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.headers['x-internal-api-key'];
    if (!apiKey || apiKey !== process.env.INTERNAL_API_KEY) {
      throw new UnauthorizedException('Invalid internal API key');
    }
    return true;
  }
}
