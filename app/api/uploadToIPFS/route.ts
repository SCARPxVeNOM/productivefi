import { NextRequest, NextResponse } from 'next/server';
import pinataSDK from '@pinata/sdk';

const pinata = new pinataSDK(
  process.env.PINATA_API_KEY!,
  process.env.PINATA_API_SECRET!
);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await pinata.pinFileToIPFS(buffer, {
      pinMetadata: { name: file.name },
    });

    return NextResponse.json({ IpfsHash: result.IpfsHash });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 