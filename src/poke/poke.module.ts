import { Module } from '@nestjs/common';
import { PokeController } from './poke.controller';
import { PokeService } from './poke.service';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [HttpModule, AuthModule],
  controllers: [PokeController],
  providers: [PokeService],
})
export class PokeModule {}
