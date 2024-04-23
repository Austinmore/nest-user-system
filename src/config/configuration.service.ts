import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigurationService {
  private readonly envConfig: { [key: string]: string };

  constructor() {
    this.envConfig = {
      jwtAccessTokenKey: process.env.JWT_ACCESS_TOKEN_SECRET || 'your_default_jwt_secret_here',
    };
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}
