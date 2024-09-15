import React, { useState } from 'react';
import { useWallet } from '@alephium/web3-react';
import { Donations } from '@/artifacts/ts';

const DonationContent = () => {
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('131HszLUNPGyL39NgswDsrL657pwvzVNPqvG87UFzzQsc');
  const { signer } = useWallet();

  const handleDonate = async () => {
    console.log('Donation en cours...');
    try {
      const contractInstance = await Donations.at('51bda4974a767dba4950e48fc3658f6494f2313a90c6b9e4749a85e4cc245f00');
      const donationAmount = BigInt(amount);
      await contractInstance.transact.depositTouser({
        signer,
        args: { recipient: address, amount: donationAmount },
        attoAlphAmount: donationAmount,
      });
      console.log('Donation réussie!');
    } catch (error) {
      console.error('Erreur lors de la donation:', error);
    }
  };

  return (
    <div style={{display: "flex", flexDirection: "column", flex: 1}}>
      <h2>Faire une donation</h2>
      <form>
        <label>
          Montant :
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>
        <button onClick={handleDonate}>Faire une donation</button>
      </form>
    </div>
  );
};

export default DonationContent;
