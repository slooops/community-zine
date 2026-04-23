'use client';

import { useState } from 'react';
import AmountSelector from './AmountSelector';

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

export default function SubscribeForm() {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    zip: '',
    amountCents: 1000, // default $10
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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg w-full">
      {/* Personal info */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Your info</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
          <input
            required
            value={form.name}
            onChange={set('name')}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="Jane Smith"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={set('email')}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="jane@example.com"
          />
        </div>
      </div>

      {/* Mailing address */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Mailing address</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address line 1</label>
          <input
            required
            value={form.line1}
            onChange={set('line1')}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="123 Castro St"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address line 2 <span className="text-gray-400">(optional)</span>
          </label>
          <input
            value={form.line2}
            onChange={set('line2')}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="Apt 4B"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              required
              value={form.city}
              onChange={set('city')}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="San Francisco"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <input
              required
              value={form.state}
              onChange={set('state')}
              maxLength={2}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 uppercase"
              placeholder="CA"
            />
          </div>
        </div>
        <div className="max-w-xs">
          <label className="block text-sm font-medium text-gray-700 mb-1">ZIP code</label>
          <input
            required
            value={form.zip}
            onChange={set('zip')}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
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

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gray-900 text-white font-semibold py-3 rounded hover:bg-gray-700 disabled:opacity-50 transition text-lg"
      >
        {loading ? 'Redirecting to checkout…' : `Subscribe for $${(form.amountCents / 100).toFixed(0)}/month →`}
      </button>

      <p className="text-xs text-gray-400 text-center">
        Secure payment via Stripe. Cancel anytime. Apple Pay & Google Pay accepted.
      </p>
    </form>
  );
}
