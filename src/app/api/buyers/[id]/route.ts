// import { NextRequest, NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth/next';
// import { db } from '@/lib/db';
// import { buyers, buyerHistory,  } from '@/lib/db/schema';
// import { buyerUpdateSchema } from '@/lib/validations/buyer';
// import { authOptions } from '@/lib/auth/config';
// import { nanoid } from 'nanoid';
// import { eq, desc } from 'drizzle-orm';

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const session = await getServerSession(authOptions);
//   if (!session?.user?.id) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   try {
//     const buyer = await db.select().from(buyers).where(eq(buyers.id, params.id));
    
//     if (!buyer.length) {
//       return NextResponse.json({ error: 'Buyer not found' }, { status: 404 });
//     }

//     // Get buyer history
//     const history = await db
//       .select({
//         id: buyerHistory.id,
//         changedAt: buyerHistory.changedAt,
//         diff: buyerHistory.diff,
//         // changedBy: users.name,
//       })
//       .from(buyerHistory)
//       // .leftJoin(users, eq(buyerHistory.changedBy, users.id))
//       .where(eq(buyerHistory.buyerId, params.id))
//       .orderBy(desc(buyerHistory.changedAt))
//       .limit(5);

//     return NextResponse.json({
//       buyer: {
//         ...buyer[0],
//         tags: JSON.parse(buyer[0].tags || '[]'),
//       },
//       history: history.map(h => ({
//         ...h,
//         diff: JSON.parse(h.diff),
//       })),
//     });
//   } catch (error) {
//     console.error('Error fetching buyer:', error);
//     return NextResponse.json({ error: 'Failed to fetch buyer' }, { status: 500 });
//   }
// }

// export async function PUT(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const session = await getServerSession(authOptions);
//   if (!session?.user?.id) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   try {
//     const body = await request.json();
//     const validatedData = buyerUpdateSchema.parse(body);
    
//     // Check concurrency - get current record
//     const currentBuyer = await db.select().from(buyers).where(eq(buyers.id, params.id));
    
//     if (!currentBuyer.length) {
//       return NextResponse.json({ error: 'Buyer not found' }, { status: 404 });
//     }

//     const currentUpdatedAt = currentBuyer[0].updatedAt ? new Date(currentBuyer[0].updatedAt).getTime() : 0;
//     if (currentUpdatedAt !== validatedData.updatedAt) {
//       return NextResponse.json({ 
//         error: 'Record has been changed by another user. Please refresh and try again.',
//         code: 'STALE_DATA'
//       }, { status: 409 });
//     }

//     const now = Date.now();
//     const { updatedAt, id, ...updateData } = validatedData;
    
//     // Calculate diff for history
//     const oldData = currentBuyer[0];
//     const diff: any = {};
    
//     Object.keys(updateData).forEach(key => {
//       const oldValue = oldData[key as keyof typeof oldData];
//       const newValue = updateData[key as keyof typeof updateData];
//       if (oldValue !== newValue) {
//         diff[key] = { from: oldValue, to: newValue };
//       }
//     });

//     // Update buyer
//     const updatedBuyer = {
//       ...updateData,
//       email: updateData.email || null,
//       tags: JSON.stringify(updateData.tags || []),
//       updatedAt: new Date(now),
//     };
    
//     const result = await db
//       .update(buyers)
//       .set(updatedBuyer)
//       .where(eq(buyers.id, params.id))
//       .returning();
    
//     // Create history entry if there are changes
//     if (Object.keys(diff).length > 0) {
//       await db.insert(buyerHistory).values({
//         id: nanoid(),
//         buyerId: params.id,
//         changedBy: session.user.id,
//         changedAt: new Date(now),
//         diff: JSON.stringify({ action: 'updated', changes: diff }),
//       });
//     }
    
//     return NextResponse.json(result[0]);
//   } catch (error) {
//     console.error('Error updating buyer:', error);
//     if (error instanceof Error) {
//       return NextResponse.json({ error: error.message }, { status: 400 });
//     }
//     return NextResponse.json({ error: 'Failed to update buyer' }, { status: 400 });
//   }
// }
// import { NextRequest, NextResponse } from 'next/server';
// import { BuyerRepository } from '@/lib/db/index';

// import { revalidatePath } from 'next/cache';

// // GET individual buyer
// export async function GET(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const id = parseInt(params.id);
    
//     if (isNaN(id)) {
//       return NextResponse.json(
//         { error: 'Invalid buyer ID' },
//         { status: 400 }
//       );
//     }

//     const buyer = await BuyerRepository.getById(id);
//     return NextResponse.json({ buyer }, { status: 200 });

//   } catch (error) {
//     console.error('Error fetching buyer:', error);
    
//     if (error instanceof Error && error.message === 'Buyer not found') {
//       return NextResponse.json(
//         { error: 'Buyer not found' },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       { error: 'Failed to fetch buyer' },
//       { status: 500 }
//     );
//   }
// }

// // PUT update buyer
// export async function PUT(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const id = parseInt(params.id);
    
//     if (isNaN(id)) {
//       return NextResponse.json(
//         { error: 'Invalid buyer ID' },
//         { status: 400 }
//       );
//     }

//     const body = await request.json();

//     // Validate required fields
//     const requiredFields = ['fullName', 'phone', 'city', 'propertyType', 'purpose', 'timeline', 'source'];
//     const missingFields = requiredFields.filter(field => !body[field]);
    
//     if (missingFields.length > 0) {
//       return NextResponse.json(
//         { error: `Missing required fields: ${missingFields.join(', ')}` },
//         { status: 400 }
//       );
//     }

//     // Additional validation
//     if (body.fullName && body.fullName.length < 2) {
//       return NextResponse.json(
//         { error: 'Name must be at least 2 characters' },
//         { status: 400 }
//       );
//     }

//     if (body.phone && !/^\d{10,15}$/.test(body.phone)) {
//       return NextResponse.json(
//         { error: 'Phone must be 10-15 digits' },
//         { status: 400 }
//       );
//     }

//     if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
//       return NextResponse.json(
//         { error: 'Invalid email format' },
//         { status: 400 }
//       );
//     }

//     // Check if BHK is required for property type
//     const requiresBhk = ['Apartment', 'Villa'].includes(body.propertyType);
//     if (requiresBhk && !body.bhk) {
//       return NextResponse.json(
//         { error: 'BHK is required for this property type' },
//         { status: 400 }
//       );
//     }

//     // Validate budget range
//     if (body.budgetMin && body.budgetMax && body.budgetMax < body.budgetMin) {
//       return NextResponse.json(
//         { error: 'Maximum budget must be greater than minimum' },
//         { status: 400 }
//       );
//     }

//     // Update the buyer
//     const updatedBuyer = await BuyerRepository.update(id, body);

//     // Revalidate pages
//     revalidatePath('/');
//     revalidatePath('/buyers');

//     return NextResponse.json(
//       { message: 'Buyer updated successfully', buyer: updatedBuyer },
//       { status: 200 }
//     );

//   } catch (error) {
//     console.error('Error updating buyer:', error);
    
//     if (error instanceof Error && error.message === 'Buyer not found') {
//       return NextResponse.json(
//         { error: 'Buyer not found' },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       { error: 'Failed to update buyer' },
//       { status: 500 }
//     );
//   }
// }

// // DELETE buyer
// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const id = parseInt(params.id);
    
//     if (isNaN(id)) {
//       return NextResponse.json(
//         { error: 'Invalid buyer ID' },
//         { status: 400 }
//       );
//     }

//     await BuyerRepository.delete(id);

//     // Revalidate pages
//     revalidatePath('/');
//     revalidatePath('/buyers');

//     return NextResponse.json(
//       { message: 'Buyer deleted successfully' },
//       { status: 200 }
//     );

//   } catch (error) {
//     console.error('Error deleting buyer:', error);
    
//     if (error instanceof Error && error.message === 'Buyer not found') {
//       return NextResponse.json(
//         { error: 'Buyer not found' },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       { error: 'Failed to delete buyer' },
//       { status: 500 }
//     );
//   }
// }

// File: src/app/api/buyers/[id]/route.ts

// import { NextRequest, NextResponse } from 'next/server';
// import { BuyerRepository } from '@/lib/db/index';
// import { revalidatePath } from 'next/cache';

// // GET individual buyer
// export async function GET(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const id = params.id;
    
//     // Remove the parseInt validation since IDs are strings
//     if (!id || id.trim() === '') {
//       return NextResponse.json(
//         { error: 'Buyer ID is required' },
//         { status: 400 }
//       );
//     }

//     const buyer = await BuyerRepository.getById(id); // Pass string ID directly
//     return NextResponse.json({ buyer }, { status: 200 });

//   } catch (error) {
//     console.error('Error fetching buyer:', error);
    
//     if (error instanceof Error && error.message === 'Buyer not found') {
//       return NextResponse.json(
//         { error: 'Buyer not found' },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       { error: 'Failed to fetch buyer' },
//       { status: 500 }
//     );
//   }
// }

// // PUT update buyer
// export async function PUT(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const id = params.id;
    
//     // Validate string ID
//     if (!id || id.trim() === '') {
//       return NextResponse.json(
//         { error: 'Buyer ID is required' },
//         { status: 400 }
//       );
//     }

//     const body = await request.json();

//     // Validate required fields
//     const requiredFields = ['fullName', 'phone', 'city', 'propertyType', 'purpose', 'timeline', 'source'];
//     const missingFields = requiredFields.filter(field => !body[field]);
    
//     if (missingFields.length > 0) {
//       return NextResponse.json(
//         { error: `Missing required fields: ${missingFields.join(', ')}` },
//         { status: 400 }
//       );
//     }

//     // Additional validation
//     if (body.fullName && body.fullName.length < 2) {
//       return NextResponse.json(
//         { error: 'Name must be at least 2 characters' },
//         { status: 400 }
//       );
//     }

//     if (body.phone && !/^\d{10,15}$/.test(body.phone)) {
//       return NextResponse.json(
//         { error: 'Phone must be 10-15 digits' },
//         { status: 400 }
//       );
//     }

//     if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
//       return NextResponse.json(
//         { error: 'Invalid email format' },
//         { status: 400 }
//       );
//     }

//     // Check if BHK is required for property type
//     const requiresBhk = ['Apartment', 'Villa'].includes(body.propertyType);
//     if (requiresBhk && !body.bhk) {
//       return NextResponse.json(
//         { error: 'BHK is required for this property type' },
//         { status: 400 }
//       );
//     }

//     // Validate budget range
//     if (body.budgetMin && body.budgetMax && body.budgetMax < body.budgetMin) {
//       return NextResponse.json(
//         { error: 'Maximum budget must be greater than minimum' },
//         { status: 400 }
//       );
//     }

//     // Update the buyer with string ID
//     const updatedBuyer = await BuyerRepository.update(id, body);

//     // Revalidate pages
//     revalidatePath('/');
//     revalidatePath('/buyers');

//     return NextResponse.json(
//       { message: 'Buyer updated successfully', buyer: updatedBuyer },
//       { status: 200 }
//     );

//   } catch (error) {
//     console.error('Error updating buyer:', error);
    
//     if (error instanceof Error && error.message === 'Buyer not found') {
//       return NextResponse.json(
//         { error: 'Buyer not found' },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       { error: 'Failed to update buyer' },
//       { status: 500 }
//     );
//   }
// }

// // DELETE buyer
// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const id = params.id;
    
//     // Validate string ID
//     if (!id || id.trim() === '') {
//       return NextResponse.json(
//         { error: 'Buyer ID is required' },
//         { status: 400 }
//       );
//     }

//     await BuyerRepository.delete(id); // Pass string ID

//     // Revalidate pages
//     revalidatePath('/');
//     revalidatePath('/buyers');

//     return NextResponse.json(
//       { message: 'Buyer deleted successfully' },
//       { status: 200 }
//     );

//   } catch (error) {
//     console.error('Error deleting buyer:', error);
    
//     if (error instanceof Error && error.message === 'Buyer not found') {
//       return NextResponse.json(
//         { error: 'Buyer not found' },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       { error: 'Failed to delete buyer' },
//       { status: 500 }
//     );
//   }
// }






// src/app/api/buyers/[id]/route.ts - IMPROVED VERSION

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { buyers, buyerHistory } from '@/lib/db/schema';
import { buyerSchema } from '@/lib/validations/buyer'; // Use your existing schema
import { nanoid } from 'nanoid';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// GET individual buyer
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('GET /api/buyers/[id] - Starting request for ID:', params.id);

    const id = params.id;
    
    if (!id || id.trim() === '') {
      return NextResponse.json(
        { error: 'Buyer ID is required' },
        { status: 400 }
      );
    }

    // Get buyer
    const result = await db
      .select()
      .from(buyers)
      .where(eq(buyers.id, id))
      .limit(1);
    
    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Buyer not found' },
        { status: 404 }
      );
    }

    const buyer = {
      ...result[0],
      tags: JSON.parse(result[0].tags || '[]')
    };

    // Optionally get buyer history
    const history = await db
      .select()
      .from(buyerHistory)
      .where(eq(buyerHistory.buyerId, id))
      .orderBy(desc(buyerHistory.changedAt))
      .limit(10);

    console.log('GET /api/buyers/[id] - Success:', buyer.id);

    return NextResponse.json({
      buyer,
      history: history.map(h => ({
        ...h,
        diff: JSON.parse(h.diff || '{}')
      }))
    });

  } catch (error) {
    console.error('GET /api/buyers/[id] - Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch buyer',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PUT update buyer
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('PUT /api/buyers/[id] - Starting update for ID:', params.id);

    const id = params.id;
    
    if (!id || id.trim() === '') {
      return NextResponse.json(
        { error: 'Buyer ID is required' },
        { status: 400 }
      );
    }

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Use your existing validation schema
    let validatedData;
    try {
      validatedData = buyerSchema.parse(body);
    } catch (validationError) {
      console.error('PUT /api/buyers/[id] - Validation error:', validationError);
      return NextResponse.json({
        error: 'Validation failed',
        details: validationError instanceof Error ? validationError.message : 'Unknown validation error'
      }, { status: 400 });
    }

    // Check if buyer exists
    const existingBuyer = await db
      .select()
      .from(buyers)
      .where(eq(buyers.id, id))
      .limit(1);
    
    if (existingBuyer.length === 0) {
      return NextResponse.json(
        { error: 'Buyer not found' },
        { status: 404 }
      );
    }

    const now = new Date();
    
    // Prepare update data
    const updateData = {
      fullName: validatedData.fullName,
      email: validatedData.email || null,
      phone: validatedData.phone,
      city: validatedData.city,
      propertyType: validatedData.propertyType,
      bhk: validatedData.bhk || null,
      purpose: validatedData.purpose,
      budgetMin: validatedData.budgetMin || null,
      budgetMax: validatedData.budgetMax || null,
      timeline: validatedData.timeline,
      source: validatedData.source,
      status: validatedData.status || existingBuyer[0].status,
      notes: validatedData.notes || null,
      tags: JSON.stringify(validatedData.tags || []),
      updatedAt: now,
    };

    // Update the buyer
    const result = await db
      .update(buyers)
      .set(updateData)
      .where(eq(buyers.id, id))
      .returning();

    // Create history entry
    try {
      await db.insert(buyerHistory).values({
        id: nanoid(),
        buyerId: id,
        changedBy: 'anonymous', // Since no auth
        changedAt: now,
        diff: JSON.stringify({ 
          action: 'updated', 
          changes: updateData 
        }),
      });
    } catch (historyError) {
      console.error('PUT /api/buyers/[id] - History creation error:', historyError);
      // Don't fail the update for history errors
    }

    // Revalidate pages
    revalidatePath('/');
    revalidatePath('/buyers');

    const updatedBuyer = {
      ...result[0],
      tags: JSON.parse(result[0].tags || '[]')
    };

    console.log('PUT /api/buyers/[id] - Success:', updatedBuyer.id);

    return NextResponse.json({
      message: 'Buyer updated successfully',
      buyer: updatedBuyer
    });

  } catch (error) {
    console.error('PUT /api/buyers/[id] - Error:', error);
    return NextResponse.json({
      error: 'Failed to update buyer',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE buyer
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('DELETE /api/buyers/[id] - Starting delete for ID:', params.id);

    const id = params.id;
    
    if (!id || id.trim() === '') {
      return NextResponse.json(
        { error: 'Buyer ID is required' },
        { status: 400 }
      );
    }

    // Check if buyer exists
    const existingBuyer = await db
      .select()
      .from(buyers)
      .where(eq(buyers.id, id))
      .limit(1);
    
    if (existingBuyer.length === 0) {
      return NextResponse.json(
        { error: 'Buyer not found' },
        { status: 404 }
      );
    }

    // Delete buyer history first (foreign key constraint)
    await db
      .delete(buyerHistory)
      .where(eq(buyerHistory.buyerId, id));

    // Delete the buyer
    await db
      .delete(buyers)
      .where(eq(buyers.id, id));

    // Revalidate pages
    revalidatePath('/');
    revalidatePath('/buyers');

    console.log('DELETE /api/buyers/[id] - Success:', id);

    return NextResponse.json({
      message: 'Buyer deleted successfully'
    });

  } catch (error) {
    console.error('DELETE /api/buyers/[id] - Error:', error);
    return NextResponse.json({
      error: 'Failed to delete buyer',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}