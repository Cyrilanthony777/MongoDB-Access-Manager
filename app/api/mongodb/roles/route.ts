import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedClient } from '@/lib/mongodb-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  let client;
  try {
    client = await getAuthenticatedClient();
    const db = client.db(process.env.MONGODB_DB_NAME || 'admin');

    const rolesInfo = await db.command({ rolesInfo: 1, showPrivileges: true, showBuiltinRoles: true });

    return NextResponse.json({ roles: rolesInfo.roles || [] });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch roles' },
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
    const { roleName, privileges, roles, database } = await request.json();

    if (!roleName || !database) {
      return NextResponse.json(
        { error: 'Role name and database are required' },
        { status: 400 }
      );
    }

    client = await getAuthenticatedClient();
    const db = client.db(database);

    await db.command({
      createRole: roleName,
      privileges: privileges || [],
      roles: roles || [],
    });

    return NextResponse.json({ success: true, message: 'Role created successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create role' },
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
    const { roleName, database } = await request.json();

    if (!roleName || !database) {
      return NextResponse.json(
        { error: 'Role name and database are required' },
        { status: 400 }
      );
    }

    client = await getAuthenticatedClient();
    const db = client.db(database);

    await db.command({
      dropRole: roleName,
    });

    return NextResponse.json({ success: true, message: 'Role deleted successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete role' },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}
