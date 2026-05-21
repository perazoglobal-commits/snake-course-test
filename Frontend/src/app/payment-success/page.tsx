import { redirect } from "next/navigation";
import Link from "next/link";
import Stripe from "stripe";
import { createServiceClient } from "@/lib/supabase/service";
import { createClient } from "@/lib/supabase/server";

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  if (!session_id) {
    redirect("/pricing");
  }

  const supabaseAuth = await createClient();
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  let paid = false;
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (
      session.payment_status === "paid" &&
      session.client_reference_id === user.id
    ) {
      paid = true;
      const supabase = createServiceClient();
      await supabase
        .from("profiles")
        .update({
          has_paid: true,
          stripe_customer_id: session.customer as string | null,
        })
        .eq("id", user.id);
    }
  } catch {
    // invalid session_id — show failure state
  }

  if (!paid) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <div className="bg-white border border-[#E5E5E5] rounded-2xl p-8">
            <p className="text-base font-medium text-gray-900 mb-2">
              Payment not confirmed
            </p>
            <p className="text-sm text-gray-400 mb-6">
              We couldn&apos;t verify your payment. If you completed checkout,
              please wait a moment and try again.
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center bg-black text-white font-medium py-3 px-6 rounded-full text-sm hover:bg-gray-800 transition-colors"
            >
              Back to pricing
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="bg-white border border-[#E5E5E5] rounded-2xl p-8">
          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="text-base font-medium text-gray-900 mb-2">
            Payment successful
          </p>
          <p className="text-sm text-gray-400 mb-6">
            You now have lifetime access to AI Virtual Try-On.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-black text-white font-medium py-3 px-6 rounded-full text-sm hover:bg-gray-800 transition-colors"
          >
            Start generating
          </Link>
        </div>
      </div>
    </div>
  );
}
