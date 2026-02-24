import { NextResponse } from 'next/server';
import { getStripeServer } from '@/lib/stripe';
import { createServerClient } from '@supabase/ssr';
import type Stripe from 'stripe';

// Use service role for webhook processing (no user session)
function createServiceClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );
}

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = getStripeServer().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = createServiceClient();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const meta = session.metadata!;

      if (meta.type === 'parent_subscription') {
        await supabase
          .from('parent_profiles')
          .update({
            plan: 'premium',
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
          })
          .eq('id', meta.userId);

        await supabase.from('payments').insert({
          user_id: meta.userId,
          type: 'subscription',
          amount: session.amount_total ?? 4900,
          status: 'completed',
          stripe_payment_id: session.payment_intent as string,
        });
      }

      if (meta.type === 'tutor_subscription') {
        await supabase
          .from('tutor_profiles')
          .update({
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
          })
          .eq('id', meta.userId);

        await supabase.from('payments').insert({
          user_id: meta.userId,
          type: 'subscription',
          amount: session.amount_total ?? 9900,
          status: 'completed',
          stripe_payment_id: session.payment_intent as string,
        });
      }

      if (meta.type === 'lesson') {
        // Get tutor's zoom link
        const { data: tutor } = await supabase
          .from('tutor_profiles')
          .select('zoom_link')
          .eq('id', meta.tutorId)
          .single();

        // Get slot info for start/end times
        const { data: slot } = await supabase
          .from('availability_slots')
          .select('*')
          .eq('id', meta.slotId)
          .single();

        if (slot) {
          // Mark slot as booked
          await supabase
            .from('availability_slots')
            .update({ is_booked: true })
            .eq('id', meta.slotId);

          // Create booking
          await supabase.from('lesson_bookings').insert({
            parent_id: meta.userId,
            student_id: meta.studentId,
            tutor_id: meta.tutorId,
            slot_id: meta.slotId,
            subject: meta.subject,
            status: 'confirmed',
            price: session.amount_total ?? 0,
            platform_fee: parseInt(meta.platformFee) || 0,
            meeting_url: tutor?.zoom_link ?? null,
            starts_at: `${slot.date}T${slot.start_time}`,
            ends_at: `${slot.date}T${slot.end_time}`,
          });
        }

        await supabase.from('payments').insert({
          user_id: meta.userId,
          type: 'lesson',
          amount: session.amount_total ?? 0,
          status: 'completed',
          stripe_payment_id: session.payment_intent as string,
          metadata: { tutorId: meta.tutorId, slotId: meta.slotId },
        });
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      const subId = sub.id;

      // Downgrade parent
      await supabase
        .from('parent_profiles')
        .update({ plan: 'free', stripe_subscription_id: null })
        .eq('stripe_subscription_id', subId);

      // Downgrade tutor
      await supabase
        .from('tutor_profiles')
        .update({ stripe_subscription_id: null })
        .eq('stripe_subscription_id', subId);
      break;
    }

    case 'invoice.payment_failed': {
      // Use Record type as Invoice properties vary across Stripe SDK versions
      const invoice = event.data.object as unknown as Record<string, unknown>;
      const meta =
        ((invoice.subscription_details as Record<string, unknown>)
          ?.metadata as Record<string, string>) ?? {};
      await supabase.from('payments').insert({
        user_id: meta.userId ?? '',
        type: 'subscription',
        amount: (invoice.amount_due as number) ?? 0,
        status: 'failed',
        stripe_payment_id: (invoice.payment_intent as string) ?? null,
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
