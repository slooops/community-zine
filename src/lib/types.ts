export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
}

export interface Subscriber {
  subscriberId: string;
  email: string;
  name: string;
  address: Address;
  amountCents: number;
  stripeCustomerId: string;
  stripePaymentIntentId: string;
  status: 'paid';
  createdAt: string;
  updatedAt: string;
}

export interface SubscribeFormData {
  name: string;
  email: string;
  address: Address;
  amountCents: number;
}
