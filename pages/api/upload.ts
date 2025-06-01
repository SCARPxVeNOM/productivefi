import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { create } from 'ipfs-http-client';
import fs from 'fs';

// Configure IPFS client
const projectId = process.env.INFURA_IPFS_PROJECT_ID;
const projectSecret = process.env.INFURA_IPFS_PROJECT_SECRET;
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable();
    const [fields, files] = await form.parse(req);
    const file = files.file?.[0];

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Read the file
    const fileBuffer = fs.readFileSync(file.filepath);

    // Upload to IPFS
    const result = await client.add(fileBuffer);

    // Clean up the temporary file
    fs.unlinkSync(file.filepath);

    return res.status(200).json({
      success: true,
      ipfsHash: result.path,
      url: `ipfs://${result.path}`,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Error uploading file' });
  }
} 