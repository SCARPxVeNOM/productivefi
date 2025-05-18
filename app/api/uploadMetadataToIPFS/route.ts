import { NextRequest, NextResponse } from 'next/server';
import pinataSDK from '@pinata/sdk';
import { v4 as uuidv4 } from 'uuid';

const pinata = new pinataSDK(
  process.env.PINATA_API_KEY!,
  process.env.PINATA_API_SECRET!
);

export async function POST(req: NextRequest) {
  try {
    const metadata = await req.json();
    
    const options = {
      pinMetadata: {
        name: `metadata-${uuidv4()}.json`,
      },
    };

    const result = await pinata.pinJSONToIPFS(metadata, options);
    return NextResponse.json({ IpfsHash: result.IpfsHash });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 