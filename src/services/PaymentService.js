
import pb from '@/lib/pocketbaseClient';

/**
 * Service for handling payments, refunds, and invoices.
 */
export const PaymentService = {
  async getTransactions(userId) {
    return await pb.collection('Payments').getFullList({
      filter: `user_id = "${userId}"`,
      sort: '-created',
      $autoCancel: false
    });
  },

  async requestRefund(userId, paymentId, amount, reason) {
    return await pb.collection('Refunds').create({
      user_id: userId,
      payment_id: paymentId,
      amount,
      reason,
      status: 'requested'
    }, { $autoCancel: false });
  },

  async getPaymentMethods(userId) {
    // Assuming a PaymentMethods collection exists or fetching from Stripe via backend
    return [
      { id: 'pm_1', brand: 'Visa', last4: '4242', exp_month: 12, exp_year: 2025, is_default: true },
      { id: 'pm_2', brand: 'Mastercard', last4: '5555', exp_month: 8, exp_year: 2026, is_default: false }
    ];
  },

  async generateInvoice(paymentId) {
    // Simulated invoice generation
    return {
      url: `https://example.com/invoices/${paymentId}.pdf`,
      status: 'generated'
    };
  }
};
