
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard, Lock } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient';
import { toast } from 'sonner';

const PaymentFormComponent = ({ amount, onSuccess, planId = null, isSubscription = false, frequency = 'monthly' }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'US'
  });
  const [errors, setErrors] = useState({});

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const validateForm = () => {
    const newErrors = {};
    const cleanCard = formData.cardNumber.replace(/\s+/g, '');
    if (cleanCard.length < 15) newErrors.cardNumber = 'Invalid card number';
    if (!formData.expiryMonth || parseInt(formData.expiryMonth) > 12) newErrors.expiryMonth = 'Invalid month';
    if (!formData.expiryYear || formData.expiryYear.length < 4) newErrors.expiryYear = 'Invalid year';
    if (formData.cvv.length < 3) newErrors.cvv = 'Invalid CVV';
    if (!formData.cardholderName) newErrors.cardholderName = 'Name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const endpoint = isSubscription ? '/payments/converge/subscription' : '/payments/converge/charge';
      const payload = {
        amount: parseFloat(amount),
        cardNumber: formData.cardNumber.replace(/\s+/g, ''),
        expiryMonth: parseInt(formData.expiryMonth, 10),
        expiryYear: parseInt(formData.expiryYear, 10),
        cvv: formData.cvv,
        cardholderName: formData.cardholderName,
        billingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country
        }
      };

      if (isSubscription) {
        payload.frequency = frequency;
        payload.planId = planId;
      } else {
        payload.description = 'VaykAIo Payment';
      }

      const response = await apiServerClient.fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || 'Payment failed');
      }

      const data = await response.json();
      toast.success(isSubscription ? 'Subscription created successfully!' : 'Payment processed successfully!');
      setFormData({ cardNumber: '', expiryMonth: '', expiryYear: '', cvv: '', cardholderName: '', street: '', city: '', state: '', zip: '', country: 'US' });
      if (onSuccess) onSuccess(data);
      
    } catch (error) {
      toast.error(error.message || 'An error occurred during payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Cardholder Name</Label>
          <Input 
            value={formData.cardholderName} 
            onChange={e => setFormData({...formData, cardholderName: e.target.value})} 
            placeholder="Name on card" 
            className={errors.cardholderName ? 'border-destructive' : ''}
          />
          {errors.cardholderName && <p className="text-xs text-destructive">{errors.cardholderName}</p>}
        </div>

        <div className="space-y-2">
          <Label>Card Number</Label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              value={formData.cardNumber} 
              onChange={(e) => setFormData({...formData, cardNumber: formatCardNumber(e.target.value)})} 
              maxLength="19"
              placeholder="0000 0000 0000 0000" 
              className={`pl-10 font-mono ${errors.cardNumber ? 'border-destructive' : ''}`}
            />
          </div>
          {errors.cardNumber && <p className="text-xs text-destructive">{errors.cardNumber}</p>}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Month</Label>
            <Input 
              value={formData.expiryMonth} 
              onChange={e => setFormData({...formData, expiryMonth: e.target.value})} 
              placeholder="MM" 
              maxLength="2" 
              className={errors.expiryMonth ? 'border-destructive' : ''}
            />
          </div>
          <div className="space-y-2">
            <Label>Year</Label>
            <Input 
              value={formData.expiryYear} 
              onChange={e => setFormData({...formData, expiryYear: e.target.value})} 
              placeholder="YYYY" 
              maxLength="4" 
              className={errors.expiryYear ? 'border-destructive' : ''}
            />
          </div>
          <div className="space-y-2">
            <Label>CVV</Label>
            <Input 
              type="password" 
              value={formData.cvv} 
              onChange={e => setFormData({...formData, cvv: e.target.value})} 
              placeholder="123" 
              maxLength="4" 
              className={errors.cvv ? 'border-destructive' : ''}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Billing Address</h3>
        <div className="space-y-2">
          <Label>Street Address</Label>
          <Input value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>City</Label>
            <Input value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} required />
          </div>
          <div className="space-y-2">
            <Label>State/Province</Label>
            <Input value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} required />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>ZIP/Postal Code</Label>
            <Input value={formData.zip} onChange={e => setFormData({...formData, zip: e.target.value})} required />
          </div>
          <div className="space-y-2">
            <Label>Country</Label>
            <Input value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} required placeholder="US" />
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
        {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Lock className="w-5 h-5 mr-2" />}
        Pay ${amount}
      </Button>
    </form>
  );
};

export default PaymentFormComponent;
