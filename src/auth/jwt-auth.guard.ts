import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

// Metadata key to mark routes as public, avoiding JWT checks
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,  // Injects the JWT service for token verification
        private reflector: Reflector      // Injects the Reflector to access route metadata
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Retrieve 'isPublic' metadata from the current context to check if the route is publicly accessible
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // If the route is public, skip JWT authentication
        if (isPublic) {
            return true;
        }

        // Extract the JWT from the request headers
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        // Throw UnauthorizedException if no token is found
        if (!token) {
            throw new UnauthorizedException('No authentication token found');
        }

        try {
            // Verify the token with the JWT service using a secret key from the environment or a default one
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_ACCESS_TOKEN_SECRET || 'your_default_jwt_secret_here',
            });

            // Attach the verified user payload to the request object
            request.user = payload;
        } catch (error) {
            // Handle token verification failures by throwing an UnauthorizedException
            throw new UnauthorizedException('Invalid or expired authentication token');
        }

        return true;
    }

    // Utility function to extract the JWT token from the request's authorization header
    private extractTokenFromHeader(request: any): string | null {
        const authHeader = request.headers['authorization'] || '';
        const [type, token] = authHeader.split(' ');

        // Ensure the Authorization type is Bearer
        if (type !== 'Bearer') {
            return null;
        }

        return token;
    }
}
