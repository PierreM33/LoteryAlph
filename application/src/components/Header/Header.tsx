import React from 'react';
import Link from 'next/link';
import {AlephiumConnectButton} from "@alephium/web3-react";

const Header = () => {
  return (
    <div className="header">
        <div className="left">
          <AlephiumConnectButton />
        </div>
        <div className="right">
          <Link href="#" className="lienA">
            Lien A
          </Link>
          <Link href="#" className="lienB">
            Lien B
          </Link>
        </div>
    </div>
  );
}

export default Header;
