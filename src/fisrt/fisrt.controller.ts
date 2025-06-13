import { Controller, Get, Param, Query } from '@nestjs/common';
import { FisrtService } from './fisrt.service';

@Controller('fisrt')
export class FisrtController {
    constructor(private readonly fisrtService: FisrtService) {}

    @Get('hey')
    getHello(): string {
        return this.fisrtService.getHello();
    }
    @Get('user/:name')
    showName(@Param('name') name: string): string {
        return this.fisrtService.showName(name);
    }
    @Get('query')
    showNameq(@Query('name') name: string): string {
        return this.fisrtService.showName(name);
    }
}
