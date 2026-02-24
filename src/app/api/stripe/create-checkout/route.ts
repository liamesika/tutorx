import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripeServer } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

type CheckoutType = 'parent_subscription' | 'tutor_subscription' | 'lesson';

interface CheckoutBody {
  type: CheckoutType;
  tutorId?: string;
  slotId?: string;
  studentId?: string;
  subject?: string;
  price?: number;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body: CheckoutBody = await request.json();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  let sessionConfig: Stripe.Checkout.SessionCreateParams;

  switch (body.type) {
    case 'parent_subscription':
      sessionConfig = {
        customer_email: user.email,
        mode: 'subscription',
        line_items: [
          {
            price_data: {
              currency: 'ils',
              product_data: {
                name: 'Tutorix פרימיום - הורה',
                description: 'גישה מלאה לכל הכלים וניתוח AI מתקדם',
              },
              unit_amount: 4900, // ₪49
              recurring: { interval: 'month' },
            },
            quantity: 1,
          },
        ],
        metadata: { userId: user.id, type: 'parent_subscription' },
        success_url: `${appUrl}/parent/subscription?success=true`,
        cancel_url: `${appUrl}/parent/subscription?cancelled=true`,
      };
      break;

    case 'tutor_subscription':
      sessionConfig = {
        customer_email: user.email,
        mode: 'subscription',
        line_items: [
          {
            price_data: {
              currency: 'ils',
              product_data: {
                name: 'Tutorix פרימיום - מורה',
                description: 'חשיפה מקסימלית, תיוג פרימיום, ואפס עמלות',
              },
              unit_amount: 9900, // ₪99
              recurring: { interval: 'month' },
            },
            quantity: 1,
          },
        ],
        metadata: { userId: user.id, type: 'tutor_subscription' },
        success_url: `${appUrl}/tutor/subscription?success=true`,
        cancel_url: `${appUrl}/tutor/subscription?cancelled=true`,
      };
      break;

    case 'lesson': {
      if (!body.price || !body.tutorId) {
        return NextResponse.json(
          { error: 'Missing price or tutorId' },
          { status: 400 }
        );
      }
      const platformFee = Math.round(body.price * 0.15); // 15% commission
      sessionConfig = {
        customer_email: user.email,
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: 'ils',
              product_data: {
                name: 'שיעור פרטי',
                description: body.subject ?? 'שיעור',
              },
              unit_amount: body.price * 100, // Convert to agorot
            },
            quantity: 1,
          },
        ],
        metadata: {
          userId: user.id,
          type: 'lesson',
          tutorId: body.tutorId,
          slotId: body.slotId ?? '',
          studentId: body.studentId ?? '',
          subject: body.subject ?? '',
          platformFee: platformFee.toString(),
        },
        success_url: `${appUrl}/parent?booking=success`,
        cancel_url: `${appUrl}/parent/book-tutor?cancelled=true`,
      };
      break;
    }

    default:
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }

  const session = await getStripeServer().checkout.sessions.create(sessionConfig);

  return NextResponse.json({ url: session.url });
}
