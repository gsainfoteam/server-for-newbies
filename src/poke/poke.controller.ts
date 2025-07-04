import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { UserGuard } from 'src/auth/guards/user.guard';
import { PokeService } from './poke.service';

@ApiTags('poke')
@ApiBearerAuth('user:jwt')
@Controller('poke')
@UseGuards(UserGuard)
export class PokeController {
  constructor(private readonly pokeService: PokeService) {}

  @ApiOperation({
    summary: 'Poke endpoint',
    description:
      'This endpoint replaces /poke/anything/here to https://pokeapi.co/api/v2/anything/here',
  })
  @ApiParam({
    name: 'path',
    description: 'The path to poke, can be anything.',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description:
      'Returns the response from the Poke API. please refer to the Poke API documentation for details.',
  })
  @Get('*path')
  proxy(@Req() req: Request) {
    return this.pokeService.proxy(req);
  }
}
