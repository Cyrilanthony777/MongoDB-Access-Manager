import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedClient } from '@/lib/mongodb-auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  let client;
  try {
    const { username, roles, database } = await request.json();

    if (!username || !roles || !database) {
      return NextResponse.json(
        { error: 'Username, roles, and database are required' },
        { status: 400 }
      );
    }

    client = await getAuthenticatedClient();
    const db = client.db(database);

    await db.command({
      grantRolesToUser: username,
      roles: roles,
    });

    return NextResponse.json({ success: true, message: 'Roles granted successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to grant roles' },
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
    const { username, roles, database } = await request.json();

    if (!username || !roles || !database) {
      return NextResponse.json(
        { error: 'Username, roles, and database are required' },
        { status: 400 }
      );
    }

    client = await getAuthenticatedClient();
    const db = client.db(database);

    await db.command({
      revokeRolesFromUser: username,
      roles: roles,
    });

    return NextResponse.json({ success: true, message: 'Roles revoked successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to revoke roles' },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}
