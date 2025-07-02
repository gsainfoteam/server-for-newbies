import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class PokeService {
  constructor(private readonly httpService: HttpService) {}

  proxy(req: Request) {
    console.log(req.path);
  }
}
