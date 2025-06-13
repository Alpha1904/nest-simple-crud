import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { FisrtModule } from 'src/fisrt/fisrt.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [FisrtModule]
})
export class UserModule {}
