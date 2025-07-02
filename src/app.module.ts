import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PokeModule } from './poke/poke.module';

@Module({
  imports: [AuthModule, PokeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
