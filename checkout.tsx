import { CoinflowPurchase, SolanaWallet } from "@coinflowlabs/react";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import type { ReactElement } from "react";
import React, { useMemo } from "react";

const Checkout = (): ReactElement => {
    const endpoint = useMemo(() => {
        return window.location.hostname === "iwcapital.xyz"
            ? "https://sol.getblock.io/351cac6e-6401-462d-ad89-2b585b334b1f/mainnet/"
            : "https://api.devnet.solana.com";
    }, []);

    const connection = useMemo(() => new Connection(endpoint, "confirmed"), [endpoint]);

    const wallet = useMemo(() => {
        return { publicKey: PublicKey.default } as SolanaWallet;
    }, []);

    return (
        <CoinflowPurchase
            wallet={wallet}
            merchantId={"iwcapital"}
            env={"sandbox"}
            connection={connection}
            blockchain={"solana"}
        />
    );
};

export default Checkout;
