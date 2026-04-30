import { Controller, Post, Body, Req, Headers, BadRequestException } from '@nestjs/common';
import { BillingService } from './billing.service';
import { ChargebeeService } from './providers/chargebee.service';

@Controller('billing')
export class BillingController {
  constructor(
    private readonly billingService: BillingService,
    private readonly chargebee: ChargebeeService, // Problem: Hardcoded provider
  ) {}

  @Post('upgrade')
  async upgradeSubscription(@Body() body: any) {
    const { userId, planId } = body;

    console.log(`Checking if user ${userId} can upgrade to ${planId}`);
    
    const result = await this.chargebee.updatePlan(userId, planId);

    if (result.success) {
      await this.billingService.updateLocalSubscription(userId, planId);
      return { status: 'success' };
    }

    throw new BadRequestException('Upgrade failed');
  }

  @Post('webhook')
  async handleWebhook(@Body() payload: any) {
    console.log('Received webhook from provider:', payload.type);
    
    if (payload.type === 'subscription.updated') {
      await this.billingService.syncSubscription(payload.data);
    }
    
    return { received: true };
  }
}
