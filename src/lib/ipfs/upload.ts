import axios from 'axios';

export const uploadToPinata = async (data: object) => {
  const res = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", data, {
    headers: {
      "Content-Type": "application/json",
      pinata_api_key: process.env.PINATA_API_KEY!,
      pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY!,
    },
  });

  return {
    cid: res.data.IpfsHash,
    url: `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${res.data.IpfsHash}`
  };
}; 