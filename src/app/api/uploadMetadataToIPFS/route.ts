import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
  try {
    console.log("API Key loaded:", !!process.env.PINATA_API_KEY);
    console.log("Secret loaded:", !!process.env.PINATA_SECRET_API_KEY);
    const body = await req.json();

    if (!body) {
      return NextResponse.json({ error: 'No metadata provided' }, { status: 400 });
    }

    const res = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", body, {
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: process.env.PINATA_API_KEY!,
        pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY!,
      },
    });

    return NextResponse.json({ ipfsHash: res.data.IpfsHash });
  } catch (error) {
    console.error('Error uploading to Pinata:', error);
    return NextResponse.json({ error: 'Failed to upload to Pinata' }, { status: 500 });
  }
} 