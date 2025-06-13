import { Injectable } from '@nestjs/common';

@Injectable()
export class FisrtService {
    getHello(): string{
        return 'Hey World! all is good!';
    }
    showName(name: string): string {
        return `Hello ${name}, welcome to the NestJS world!`;
    }
}
