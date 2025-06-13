import { Module } from '@nestjs/common';
import { FisrtController } from './fisrt.controller';
import { FisrtService } from './fisrt.service';

@Module({
  controllers: [FisrtController],
  providers: [FisrtService],
  exports: [FisrtService],
})
export class FisrtModule {}
