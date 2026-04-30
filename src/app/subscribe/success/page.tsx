import Link from 'next/link';

export const metadata = {
  title: 'Order confirmed! — ComMunity Magazine',
};

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="text-6xl">🚌</div>
        <h1 className="text-3xl font-bold text-gray-900">Order confirmed!</h1>
        <p className="text-gray-600 text-lg">
          Thank you for supporting ComMunity. We&apos;ll get your print copy in the mail soon.
          Your purchase helps fund Issue 3 — we&apos;re stoked to keep this going.
        </p>
        <p className="text-gray-500 text-sm">
          Check your email for a receipt from Stripe.
        </p>
        <div className="flex flex-col gap-3 pt-2">
          <Link
            href="/read"
            className="bg-gray-900 text-white font-bold px-6 py-3 rounded hover:bg-gray-700 transition"
          >
            Keep reading online →
          </Link>
          <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm underline">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
