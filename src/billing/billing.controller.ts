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
    // 1. Missing Validation: body is 'any'
    const { userId, planId } = body;

    // 2. Business Logic in Controller: Should be in a Service
    console.log(`Checking if user ${userId} can upgrade to ${planId}`);
    
    // 3. Direct External Call: What if we switch to Stripe?
    const result = await this.chargebee.updatePlan(userId, planId);

    if (result.success) {
      // 4. Data Integrity: What if this DB update fails but the money was taken?
      await this.billingService.updateLocalSubscription(userId, planId);
      return { status: 'success' };
    }

    throw new BadRequestException('Upgrade failed');
  }

  @Post('webhook')
  async handleWebhook(@Body() payload: any) {
    // 5. Security: No signature verification
    // 6. Idempotency: What if we process this twice?
    console.log('Received webhook from provider:', payload.type);
    
    if (payload.type === 'subscription.updated') {
      await this.billingService.syncSubscription(payload.data);
    }
    
    return { received: true };
  }
}
