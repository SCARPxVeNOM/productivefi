import { create, IPFSHTTPClient } from 'ipfs-http-client';

// Configure IPFS client for Pinata
const getIPFSClient = (): IPFSHTTPClient | null => {
  if (!process.env.NEXT_PUBLIC_PINATA_JWT) {
    console.error('Pinata JWT not configured');
    return null;
  }

  try {
    return create({
      url: 'https://api.pinata.cloud',
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`
      }
    });
  } catch (error) {
    console.error('Failed to create IPFS client:', error);
    return null;
  }
};

// Upload function
export async function uploadToIPFS(fileToUpload: any, type: "file" | "json" | "buffer"): Promise<string> {
  console.log('Starting IPFS upload...');
  console.log('File type:', type);
  console.log('File details:', fileToUpload instanceof File ? {
    name: fileToUpload.name,
    type: fileToUpload.type,
    size: fileToUpload.size
  } : 'Not a File object');

  const client = getIPFSClient();
  
  if (!client) {
    throw new Error("IPFS client not available. Please check your Pinata JWT configuration.");
  }

  try {
    let result;
    
    if (type === "json") {
      const data = JSON.stringify(fileToUpload);
      result = await client.add(data);
    } else if (fileToUpload instanceof File) {
      // For files, we'll use the add method with proper options
      result = await client.add(fileToUpload, {
        pin: true,
        cidVersion: 1
      });
    } else {
      result = await client.add(fileToUpload);
    }

    console.log('Upload result:', result);

    if (!result || !result.path) {
      throw new Error("Upload failed: No path returned");
    }

    const ipfsUrl = `ipfs://${result.path}`;
    console.log('Successfully uploaded to IPFS:', ipfsUrl);
    return ipfsUrl;
  } catch (error) {
    console.error('Detailed error uploading to IPFS:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw new Error(`Failed to upload to IPFS: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Wrapper for file uploads
export const uploadFileToIPFS = async (file: File): Promise<string> => {
  if (!(file instanceof File)) {
    throw new Error('Input must be a File object');
  }
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }
  
  // Validate file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File size must be less than 10MB');
  }

  return uploadToIPFS(file, "file");
};

// Convert ipfs:// to public gateway URL
export const getIPFSGatewayUrl = (ipfsUri: string): string => {
  if (!ipfsUri.startsWith('ipfs://')) {
    return ipfsUri;
  }

  const hash = ipfsUri.replace('ipfs://', '');
  return `https://gateway.pinata.cloud/ipfs/${hash}`;
};
