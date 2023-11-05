import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class GuestGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (!request.user) {
      // If no user is already authenticated, allow access.
      return true;
    } else {
      // If a user is already authenticated, throw an UnauthorizedException.
      throw new UnauthorizedException('You are already authenticated.');
    }
  }
}
