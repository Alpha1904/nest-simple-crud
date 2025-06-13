import { Injectable } from '@nestjs/common';
import { FisrtService } from 'src/fisrt/fisrt.service';

@Injectable()
export class UserService {
    constructor( private readonly fisrtService: FisrtService) {}
}
