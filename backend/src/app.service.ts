import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getTokenContractAddress() {
    return { result: "<token contract address>" }
  }
}
