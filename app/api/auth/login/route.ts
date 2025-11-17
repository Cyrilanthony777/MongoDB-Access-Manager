import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { mongoUrl, username, password } = await request.json();

    if (!mongoUrl) {
      return NextResponse.json(
        { error: 'MongoDB URL is required' },
        { status: 400 }
      );
    }

    let authenticatedUri = mongoUrl;

    if (username && password) {
      const uriParts = mongoUrl.split('://');
      const protocol = uriParts[0];
      const hostPart = uriParts[1];
      authenticatedUri = `${protocol}://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${hostPart}`;
    }

    const client = new MongoClient(authenticatedUri, {
      serverSelectionTimeoutMS: 5000,
    });

    try {
      await client.connect();
      await client.db('admin').admin().ping();

      await client.close();

      const response = NextResponse.json({
        success: true,
        message: 'Authentication successful'
      });

      const authData = JSON.stringify({ mongoUrl, username, password });
      response.cookies.set('mongodb_auth', Buffer.from(authData).toString('base64'), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 8,
      });

      return response;
    } catch (authError: any) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Authentication failed' },
      { status: 500 }
    );
  }
}
