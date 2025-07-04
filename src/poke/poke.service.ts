import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PokeService {
  private readonly pokeApiUrl = 'https://pokeapi.co/api/v2/';
  constructor(private readonly httpService: HttpService) {}

  async proxy(req: Request): Promise<JSON> {
    const response = await firstValueFrom(
      this.httpService.get<JSON>(`${this.pokeApiUrl}${req.params['path']}`, {
        params: req.query,
      }),
    );
    return response.data;
  }
}
