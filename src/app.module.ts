import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FisrtModule } from './fisrt/fisrt.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [FisrtModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
