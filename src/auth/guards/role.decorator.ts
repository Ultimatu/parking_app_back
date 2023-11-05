import { SetMetadata } from '@nestjs/common';

/**
 *  SetMetadata() is a built-in NestJS function that allows us to attach metadata to a class, method, or property.
 * @param args  The @Roles() decorator takes a variable number of arguments, which are the roles that are allowed to access the resource.
 * @returns  The @Roles() decorator returns a SetMetadata() function, which is a built-in NestJS function that allows us to attach metadata to a class, method, or property.
 */
export const Roles = (...args: string[]) => SetMetadata('roles', args);
