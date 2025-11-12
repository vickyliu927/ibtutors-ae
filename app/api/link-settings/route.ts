import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';

export async function GET() {
  try {
    const data = await client.fetch(`
      *[_type == "linkSettings" && !(_id in path("drafts.**"))][0]{
        "defaultNofollow": defaultNofollow,
        "nofollowDomains": nofollowDomains,
        "followDomains": followDomains
      }
    `);
    return NextResponse.json(
      data || { defaultNofollow: false, nofollowDomains: [], followDomains: [] },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { defaultNofollow: false, nofollowDomains: [], followDomains: [] },
      { status: 200 }
    );
  }
}


