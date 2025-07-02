import { All, Controller, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('poke')
export class PokeController {
  @All('*')
  async proxy(@Req() req: Request, @Res() res: Response) {}
}
