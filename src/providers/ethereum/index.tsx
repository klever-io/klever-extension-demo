const connect = async (): Promise<string> => {
  if (!window.ethereum) {
    return 'Ethereum provider is not installed';
  }

  const addresses = await window.ethereum.enable();
  if (addresses.length === 0) {
    return 'User denied account access';
  }

  return addresses[0];
};

export default {
  connect,
};
