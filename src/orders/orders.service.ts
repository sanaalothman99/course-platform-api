import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia' as any,
});

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createCheckoutSession(userId: string, courseId: string) {
    try {
      const course = await this.prisma.course.findUnique({
        where: { id: courseId },
      });

      if (!course) throw new Error('Course not found');

      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        success_url: 'https://google.com',
        cancel_url: 'https://google.com',
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: course.title,
              },
              unit_amount: Math.round(course.price * 100),
            },
            quantity: 1,
          },
        ],
        metadata: {
          userId,
          courseId,
        },
      });

      return { url: session.url };
} catch (error) {
  if (error instanceof Error) {
    console.error('Stripe Error:', error.message);
  } else {
    console.error('Stripe Error:', error);
  }
  throw error;
}
  }

  async handleWebhook(payload: Buffer, signature: string) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch {
      throw new Error('Invalid webhook signature');
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const { userId, courseId } = session.metadata!;

      await this.prisma.order.create({
        data: { userId, courseId },
      });
    }

    return { received: true };
  }

  async getUserOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { course: { include: { lessons: true } } },
    });
  }

  async checkEnrollment(userId: string, courseId: string) {
    const order = await this.prisma.order.findFirst({
      where: { userId, courseId },
    });
    return { enrolled: !!order };
  }

  async getAllOrders() {
    return this.prisma.order.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        course: { select: { id: true, title: true, price: true } },
      },
    });
  }
  async grantAccess(userId: string, courseId: string) {
  const existing = await this.prisma.order.findFirst({
    where: { userId, courseId },
  });

  if (existing) {
    return { message: 'User already has access' };
  }

  return this.prisma.order.create({
    data: { userId, courseId },
  });
}
}