import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { db } from '@/lib/db';
import { buyers, buyerHistory, users } from '@/lib/db/schema';
import { buyerUpdateSchema } from '@/lib/validations/buyer';
import { authOptions } from '@/lib/auth/config';
import { nanoid } from 'nanoid';
import { eq, desc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const buyer = await db.select().from(buyers).where(eq(buyers.id, params.id));
    
    if (!buyer.length) {
      return NextResponse.json({ error: 'Buyer not found' }, { status: 404 });
    }

    // Get buyer history
    const history = await db
      .select({
        id: buyerHistory.id,
        changedAt: buyerHistory.changedAt,
        diff: buyerHistory.diff,
        changedBy: users.name,
      })
      .from(buyerHistory)
      .leftJoin(users, eq(buyerHistory.changedBy, users.id))
      .where(eq(buyerHistory.buyerId, params.id))
      .orderBy(desc(buyerHistory.changedAt))
      .limit(5);

    return NextResponse.json({
      buyer: {
        ...buyer[0],
        tags: JSON.parse(buyer[0].tags || '[]'),
      },
      history: history.map(h => ({
        ...h,
        diff: JSON.parse(h.diff),
      })),
    });
  } catch (error) {
    console.error('Error fetching buyer:', error);
    return NextResponse.json({ error: 'Failed to fetch buyer' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = buyerUpdateSchema.parse(body);
    
    // Check concurrency - get current record
    const currentBuyer = await db.select().from(buyers).where(eq(buyers.id, params.id));
    
    if (!currentBuyer.length) {
      return NextResponse.json({ error: 'Buyer not found' }, { status: 404 });
    }

    const currentUpdatedAt = currentBuyer[0].updatedAt ? new Date(currentBuyer[0].updatedAt).getTime() : 0;
    if (currentUpdatedAt !== validatedData.updatedAt) {
      return NextResponse.json({ 
        error: 'Record has been changed by another user. Please refresh and try again.',
        code: 'STALE_DATA'
      }, { status: 409 });
    }

    const now = Date.now();
    const { updatedAt, id, ...updateData } = validatedData;
    
    // Calculate diff for history
    const oldData = currentBuyer[0];
    const diff: any = {};
    
    Object.keys(updateData).forEach(key => {
      const oldValue = oldData[key as keyof typeof oldData];
      const newValue = updateData[key as keyof typeof updateData];
      if (oldValue !== newValue) {
        diff[key] = { from: oldValue, to: newValue };
      }
    });

    // Update buyer
    const updatedBuyer = {
      ...updateData,
      email: updateData.email || null,
      tags: JSON.stringify(updateData.tags || []),
      updatedAt: new Date(now),
    };
    
    const result = await db
      .update(buyers)
      .set(updatedBuyer)
      .where(eq(buyers.id, params.id))
      .returning();
    
    // Create history entry if there are changes
    if (Object.keys(diff).length > 0) {
      await db.insert(buyerHistory).values({
        id: nanoid(),
        buyerId: params.id,
        changedBy: session.user.id,
        changedAt: new Date(now),
        diff: JSON.stringify({ action: 'updated', changes: diff }),
      });
    }
    
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error updating buyer:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update buyer' }, { status: 400 });
  }
}