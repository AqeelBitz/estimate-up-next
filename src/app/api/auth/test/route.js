// app/api/test/route.js
import dbConnect from '@/lib/db';

export async function GET() {
  try {
    await dbConnect();
    return Response.json({ status: 'Database connected' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}