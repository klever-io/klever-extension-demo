import { TransactionType } from '@klever/sdk'

const connect = async (): Promise<string> => {
  if (!window.kleverWeb) {
    return 'KleverWeb is not installed';
  }

  const address = await window.kleverWeb.initialize();

  return address;
};

const balance = async (): Promise<number> => {
  let balance = 0
  if (!window.kleverWeb) {
    console.log('KleverWeb is not installed')
    return balance
  }

  try {
    balance = await window.kleverWeb.getBalance()
  } catch (e) {
    console.log(e)
  }

  return balance;
}

const address = (): string => {
  if (!window.kleverWeb) {
    console.log('KleverWeb is not installed')
    return ''
  }

  return window.kleverWeb.address
}

const send = async (to: string, amount: number): Promise<string | undefined> => {
  if (!window.kleverWeb) {
    console.log('KleverWeb is not installed')
    return
  }

  const tx = await window.kleverWeb.buildTransaction([
    {
      type: TransactionType.Transfer,
      payload: {
        receiver:
          to,
        amount: amount,
        asset: "KLV",
      },
    },
  ])

  await window.kleverWeb.signTransaction(tx)
  const res = await window.kleverWeb.broadcastTransactions([tx])
  return res
}


export default {
  connect,
  balance,
  address,
  send
};
