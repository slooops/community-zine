'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import AmountSelector from './AmountSelector';
import Button, { inputClass } from './Button';

interface FormState {
  name: string;
  email: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  zip: string;
  amountCents: number;
}

const labelClass = 'block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5';
const sectionHead = 'text-xs font-semibold text-gray-500 uppercase tracking-wider pb-2 border-b border-gray-800';

export default function SubscribeForm() {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    zip: '',
    amountCents: 1000,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.amountCents < 500) {
      setError('Minimum amount is $5.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          address: {
            line1: form.line1,
            line2: form.line2 || undefined,
            city: form.city,
            state: form.state,
            zip: form.zip,
          },
          amountCents: form.amountCents,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong');
      window.location.href = data.url;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 w-full">
      {/* Personal info */}
      <div className="space-y-4">
        <p className={sectionHead}>Your info</p>
        <div>
          <label className={labelClass}>Full name</label>
          <input
            required
            value={form.name}
            onChange={set('name')}
            className={`${inputClass} w-full`}
            placeholder="Jane Smith"
          />
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={set('email')}
            className={`${inputClass} w-full`}
            placeholder="jane@example.com"
          />
        </div>
      </div>

      {/* Mailing address */}
      <div className="space-y-4">
        <p className={sectionHead}>Mailing address</p>
        <div>
          <label className={labelClass}>Address line 1</label>
          <input
            required
            value={form.line1}
            onChange={set('line1')}
            className={`${inputClass} w-full`}
            placeholder="123 Castro St"
          />
        </div>
        <div>
          <label className={labelClass}>
            Address line 2{' '}
            <span className="normal-case font-normal text-gray-600">(optional)</span>
          </label>
          <input
            value={form.line2}
            onChange={set('line2')}
            className={`${inputClass} w-full`}
            placeholder="Apt 4B"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 sm:col-span-1">
            <label className={labelClass}>City</label>
            <input
              required
              value={form.city}
              onChange={set('city')}
              className={`${inputClass} w-full`}
              placeholder="San Francisco"
            />
          </div>
          <div>
            <label className={labelClass}>State</label>
            <input
              required
              value={form.state}
              onChange={set('state')}
              maxLength={2}
              className={`${inputClass} w-full uppercase`}
              placeholder="CA"
            />
          </div>
        </div>
        <div className="max-w-xs">
          <label className={labelClass}>ZIP code</label>
          <input
            required
            value={form.zip}
            onChange={set('zip')}
            className={`${inputClass} w-full`}
            placeholder="94114"
            maxLength={10}
          />
        </div>
      </div>

      {/* Amount */}
      <AmountSelector
        value={form.amountCents}
        onChange={(cents) => setForm((f) => ({ ...f, amountCents: cents }))}
      />

      {error && <p className="text-[#D94550] text-sm">{error}</p>}

      <Button
        type="submit"
        disabled={loading}
        className="w-full py-4 text-base"
      >
        {loading
          ? 'Redirecting to checkout…'
          : `Buy a Print Copy — $${(form.amountCents / 100).toFixed(0)}`}
        {!loading && <ArrowRight size={16} strokeWidth={2.5} />}
      </Button>

      <p className="text-xs text-gray-600 text-center">
        Secure one-time payment via Stripe. Apple Pay &amp; Google Pay accepted.
      </p>
    </form>
  );
}
