const connect = async (): Promise<string> => {
  if (!window.kleverWeb) {
    return 'KleverWeb is not installed';
  }

  const address = await window.kleverWeb.initialize();

  return address;
};

export default {
  connect,
};
