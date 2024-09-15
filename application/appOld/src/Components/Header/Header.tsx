import React from 'react';
import Link from 'next/link';
import ConnectWalletButton from "@/app/src/Components/Wallet/ConnectWalletButton";

const Page = () => {
  return (
    <div>
      <header className="header">
        <div className="left">
          <ConnectWalletButton />
        </div>
        <div className="right">
          <Link href="#" className="lienA">
            Lien A
          </Link>
          <Link href="#" className="lienB">
            Lien B
          </Link>
        </div>
      </header>
    </div>
  );
}

export default Page;
