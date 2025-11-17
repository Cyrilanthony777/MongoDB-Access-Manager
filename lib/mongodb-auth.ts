import { MongoClient } from 'mongodb';
import { cookies } from 'next/headers';

export async function getAuthenticatedClient(): Promise<MongoClient> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('mongodb_auth');

  if (!authCookie) {
    throw new Error('Not authenticated');
  }

  const authData = Buffer.from(authCookie.value, 'base64').toString('utf-8');
  const { mongoUrl, username, password } = JSON.parse(authData);

  let authenticatedUri = mongoUrl;

  if (username && password) {
    const uriParts = mongoUrl.split('://');
    const protocol = uriParts[0];
    const hostPart = uriParts[1];
    authenticatedUri = `${protocol}://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${hostPart}`;
  }

  const client = new MongoClient(authenticatedUri);
  await client.connect();

  return client;
}
