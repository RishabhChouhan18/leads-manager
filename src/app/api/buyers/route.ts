// import { NextRequest, NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth/next';
// import { db } from '@/lib/db';
// import { buyers, buyerHistory } from '@/lib/db/schema';
// import { buyerSchema, buyerSearchSchema } from '@/lib/validations/buyer';
// import { authOptions } from '@/lib/auth/config';
// import { nanoid } from 'nanoid';
// import { eq, like, and, or, desc, count } from 'drizzle-orm';

// export async function GET(request: NextRequest) {
//   const session = await getServerSession(authOptions);
//   if (!session?.user?.id) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   const { searchParams } = new URL(request.url);
//   const searchData = {
//     search: searchParams.get('search') || undefined,
//     city: searchParams.get('city') || undefined,
//     propertyType: searchParams.get('propertyType') || undefined,
//     status: searchParams.get('status') || undefined,
//     timeline: searchParams.get('timeline') || undefined,
//     page: parseInt(searchParams.get('page') || '1'),
//     limit: parseInt(searchParams.get('limit') || '10'),
//   };

//   try {
//     const validatedSearch = buyerSearchSchema.parse(searchData);
    
//     // Build where conditions
//     const conditions = [];
    
//     if (validatedSearch.search) {
//       conditions.push(
//         or(
//           like(buyers.fullName, `%${validatedSearch.search}%`),
//           like(buyers.phone, `%${validatedSearch.search}%`),
//           like(buyers.email, `%${validatedSearch.search}%`)
//         )
//       );
//     }
    
//     if (validatedSearch.city) {
//       conditions.push(eq(buyers.city, validatedSearch.city));
//     }
    
//     if (validatedSearch.propertyType) {
//       conditions.push(eq(buyers.propertyType, validatedSearch.propertyType));
//     }
    
//     if (validatedSearch.status) {
//       conditions.push(eq(buyers.status, validatedSearch.status));
//     }
    
//     if (validatedSearch.timeline) {
//       conditions.push(eq(buyers.timeline, validatedSearch.timeline));
//     }

//     const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

//     // Get total count for pagination
//     const totalCountResult = await db
//       .select({ count: count() })
//       .from(buyers)
//       .where(whereClause);
    
//     const totalCount = totalCountResult[0].count;

//     // Get paginated results
//     const offset = (validatedSearch.page - 1) * validatedSearch.limit;
//     const result = await db
//       .select()
//       .from(buyers)
//       .where(whereClause)
//       .orderBy(desc(buyers.updatedAt))
//       .limit(validatedSearch.limit)
//       .offset(offset);

//     return NextResponse.json({
//       data: result,
//       pagination: {
//         page: validatedSearch.page,
//         limit: validatedSearch.limit,
//         total: totalCount,
//         pages: Math.ceil(totalCount / validatedSearch.limit),
//       },
//     });
//   } catch (error) {
//     console.error('Error fetching buyers:', error);
//     return NextResponse.json({ error: 'Failed to fetch buyers' }, { status: 500 });
//   }
// }

// export async function POST(request: NextRequest) {
//   const session = await getServerSession(authOptions);
//   if (!session?.user?.id) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   try {
//     const body = await request.json();
//     const validatedData = buyerSchema.parse(body);
    
//     const buyerId = nanoid();
//     const now = Date.now();
    
//     // Create buyer record
//     const newBuyer = {
//       id: buyerId,
//       ...validatedData,
//       email: validatedData.email || null,
//       tags: JSON.stringify(validatedData.tags || []),
//       ownerId: session.user.id,
//       createdAt: new Date(now),
//       updatedAt: new Date(now),
//     };
    
//     const result = await db.insert(buyers).values(newBuyer).returning();
    
//     // Create history entry
//     await db.insert(buyerHistory).values({
//       id: nanoid(),
//       buyerId,
//       changedBy: session.user.id,
//       changedAt: new Date(now),
//       diff: JSON.stringify({ action: 'created', data: validatedData }),
//     });
    
//     return NextResponse.json(result[0], { status: 201 });
//   } catch (error) {
//     console.error('Error creating buyer:', error);
//     if (error instanceof Error) {
//       return NextResponse.json({ error: error.message }, { status: 400 });
//     }
//     return NextResponse.json({ error: 'Failed to create buyer' }, { status: 400 });
//   }
// }


// src/app/api/buyers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { buyers, buyerHistory } from '@/lib/db/schema';
import { buyerSchema, buyerSearchSchema } from '@/lib/validations/buyer';
import { nanoid } from 'nanoid';
import { eq, like, and, or, desc, count } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/buyers - Starting request');

    const { searchParams } = new URL(request.url);
    const searchData = {
      search: searchParams.get('search') || undefined,
      city: searchParams.get('city') || undefined,
      propertyType: searchParams.get('propertyType') || undefined,
      status: searchParams.get('status') || undefined,
      timeline: searchParams.get('timeline') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
    };

    const validatedSearch = buyerSearchSchema.parse(searchData);
    
    // Build where conditions
    const conditions = [];
    
    if (validatedSearch.search) {
      conditions.push(
        or(
          like(buyers.fullName, `%${validatedSearch.search}%`),
          like(buyers.phone, `%${validatedSearch.search}%`),
          like(buyers.email, `%${validatedSearch.search}%`)
        )
      );
    }
    
    if (validatedSearch.city) {
      conditions.push(eq(buyers.city, validatedSearch.city));
    }
    
    if (validatedSearch.propertyType) {
      conditions.push(eq(buyers.propertyType, validatedSearch.propertyType));
    }
    
    if (validatedSearch.status) {
      conditions.push(eq(buyers.status, validatedSearch.status));
    }
    
    if (validatedSearch.timeline) {
      conditions.push(eq(buyers.timeline, validatedSearch.timeline));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get total count for pagination
    const totalCountResult = await db
      .select({ count: count() })
      .from(buyers)
      .where(whereClause);
    
    const totalCount = totalCountResult[0].count;

    // Get paginated results
    const offset = (validatedSearch.page - 1) * validatedSearch.limit;
    const result = await db
      .select()
      .from(buyers)
      .where(whereClause)
      .orderBy(desc(buyers.updatedAt))
      .limit(validatedSearch.limit)
      .offset(offset);

    console.log('GET /api/buyers - Success:', result.length, 'buyers found');

    return NextResponse.json({
      data: result,
      pagination: {
        page: validatedSearch.page,
        limit: validatedSearch.limit,
        total: totalCount,
        pages: Math.ceil(totalCount / validatedSearch.limit),
      },
    });
  } catch (error) {
    console.error('GET /api/buyers - Error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch buyers',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/buyers - Starting request');

    // Parse request body
    let body;
    try {
      body = await request.json();
      console.log('POST /api/buyers - Request body parsed:', Object.keys(body));
    } catch (parseError) {
      console.error('POST /api/buyers - JSON parse error:', parseError);
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

    // Validate data
    let validatedData;
    try {
      validatedData = buyerSchema.parse(body);
      console.log('POST /api/buyers - Data validated successfully');
    } catch (validationError) {
      console.error('POST /api/buyers - Validation error:', validationError);
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validationError instanceof Error ? validationError.message : 'Unknown validation error'
      }, { status: 400 });
    }
    
    const buyerId = nanoid();
    const now = new Date();
    
    // Create buyer record
    const newBuyer = {
      id: buyerId,
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
      status: 'New' as const,
      notes: validatedData.notes || null,
      tags: JSON.stringify(validatedData.tags || []),
      // ownerId: 'anonymous', // No auth, so use anonymous
      createdAt: now,
      updatedAt: now,
    };

    console.log('POST /api/buyers - Creating buyer with data:', {
      id: newBuyer.id,
      fullName: newBuyer.fullName,
      phone: newBuyer.phone,
    });
    
    // Insert buyer
    let result;
    try {
      result = await db.insert(buyers).values(newBuyer).returning();
      console.log('POST /api/buyers - Buyer created successfully:', result[0].id);
    } catch (dbError) {
      console.error('POST /api/buyers - Database error creating buyer:', dbError);
      return NextResponse.json({ 
        error: 'Database error creating buyer',
        details: dbError instanceof Error ? dbError.message : 'Unknown database error'
      }, { status: 500 });
    }
    
    // Create history entry
    try {
      await db.insert(buyerHistory).values({
        id: nanoid(),
        buyerId,
        changedBy: 'anonymous', // No auth, so use anonymous
        changedAt: now,
        diff: JSON.stringify({ action: 'created', data: validatedData }),
      });
      console.log('POST /api/buyers - History entry created');
    } catch (historyError) {
      console.error('POST /api/buyers - Error creating history entry:', historyError);
      // Don't fail the request for history errors
    }
    
    console.log('POST /api/buyers - Success, returning buyer:', result[0].id);
    return NextResponse.json(result[0], { status: 201 });
    
  } catch (error) {
    console.error('POST /api/buyers - Unexpected error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}