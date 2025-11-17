import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedClient } from '@/lib/mongodb-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  let client;
  try {
    client = await getAuthenticatedClient();
    const db = client.db(process.env.MONGODB_DB_NAME || 'admin');

    const usersInfo = await db.command({ usersInfo: 1 });

    return NextResponse.json({ users: usersInfo.users || [] });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch users' },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}

export async function POST(request: NextRequest) {
  let client;
  try {
    const { username, password, roles, database } = await request.json();

    if (!username || !password || !roles || !database) {
      return NextResponse.json(
        { error: 'Username, password, roles, and database are required' },
        { status: 400 }
      );
    }

    client = await getAuthenticatedClient();
    const db = client.db(database);

    await db.command({
      createUser: username,
      pwd: password,
      roles: roles,
    });

    return NextResponse.json({ success: true, message: 'User created successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create user' },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}

export async function DELETE(request: NextRequest) {
  let client;
  try {
    const { username, database } = await request.json();

    if (!username || !database) {
      return NextResponse.json(
        { error: 'Username and database are required' },
        { status: 400 }
      );
    }

    client = await getAuthenticatedClient();
    const db = client.db(database);

    await db.command({
      dropUser: username,
    });

    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete user' },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}
