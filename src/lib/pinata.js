const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY || '';
const PINATA_SECRET_KEY = import.meta.env.VITE_PINATA_SECRET_KEY || '';
const PINATA_JWT = import.meta.env.VITE_PINATA_JWT || '';

export const uploadToPinata = async (data) => {
  try {
    const formData = new FormData();
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    formData.append('file', blob, 'metadata.json');

    const metadata = JSON.stringify({
      name: `GreenLoop-${Date.now()}`,
      keyvalues: {
        type: 'recycling-data',
      },
    });
    formData.append('pinataMetadata', metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append('pinataOptions', options);

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        Authorization: PINATA_JWT ? `Bearer ${PINATA_JWT}` : `Basic ${btoa(`${PINATA_API_KEY}:${PINATA_SECRET_KEY}`)}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Erro ao fazer upload no Pinata');
    }

    const result = await response.json();
    return result.IpfsHash;
  } catch (error) {
    throw new Error(`Erro ao fazer upload no Pinata: ${error.message}`);
  }
};

