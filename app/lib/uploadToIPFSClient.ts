export async function uploadFileToIPFS(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/api/uploadToIPFS', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Failed to upload to IPFS');
  }

  const data = await res.json();
  return `ipfs://${data.IpfsHash}`;
} 