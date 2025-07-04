import { Controller, Get } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

@Controller()
export class AppController {
  private readonly publishedAt: string;

  constructor() {
    this.publishedAt = new Date().toISOString();
  }

  @ApiOperation({
    summary: 'Get information about the service',
    description:
      'Gets basic information about the service including name, version, and published date.',
  })
  @ApiOkResponse({
    description: '성공',
    example: {
      name: 'infoteam-idp',
      version: 'v2.0.0',
      publishedAt: new Date().toISOString(),
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @Get()
  info() {
    return {
      name: 'newbies',
      version: '1.0.0',
      publishedAt: this.publishedAt,
    };
  }
}
