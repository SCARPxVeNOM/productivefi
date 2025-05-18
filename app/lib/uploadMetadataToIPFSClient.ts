export async function uploadMetadataToIPFS(metadata: any): Promise<string> {
  const res = await fetch('/api/uploadMetadataToIPFS', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(metadata),
  });

  if (!res.ok) {
    throw new Error('Failed to upload metadata to IPFS');
  }

  const data = await res.json();
  return `ipfs://${data.IpfsHash}`;
} 