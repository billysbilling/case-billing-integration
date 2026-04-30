import { Injectable } from '@nestjs/common';

@Injectable()
export class ChargebeeService {
  async updatePlan(userId: string, planId: string) {
    // Imagine an Axios call to Chargebee API here
    return { success: true, txId: 'cb_12345' };
  }
}
