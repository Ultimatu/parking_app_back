import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * RoleGuard is a custom guard used to protect routes based on user roles.
 * For example, it can restrict access to routes for roles like 'admin', 'customer', etc.
 */
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * Check if the user's role matches any of the required roles.
   * @param roles - Array of required roles
   * @param userRole - Role of the user
   * @returns True if there is a match, indicating the user is allowed access; otherwise, false.
   */
  matchRoles(roles: string[], userRole: string) {
    return roles.some((role) => role === userRole);
  }

  /**
   * Determine whether the user is allowed to access the route based on their role.
   * @param context - The execution context
   * @returns True if the user is allowed access; otherwise, false.
   */
  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      // If no roles are specified for the route, access is allowed.
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Check if the user's role matches any of the required roles.
    return this.matchRoles(roles, user.role);
  }
}
