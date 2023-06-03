import type { PropsWithChildren, ReactElement } from "react";
import React, { useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { GlowWalletAdapter } from "@solana/wallet-adapter-glow";
import { CoinbaseWalletAdapter } from "@solana/wallet-adapter-coinbase";
import { TrustWalletAdapter } from "@solana/wallet-adapter-trust";
import { TokenPocketWalletAdapter } from "@solana/wallet-adapter-tokenpocket";
import { LedgerWalletAdapter } from "@solana/wallet-adapter-ledger";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";
import { SolongWalletAdapter } from "@solana/wallet-adapter-solong";
import { MathWalletAdapter } from "@solana/wallet-adapter-mathwallet";

const SolanaProvider = (props: PropsWithChildren): ReactElement => {
    const endpoint = useMemo(() => {
        return "https://solana-mainnet.g.alchemy.com/v2/8jg3wODRNmEHcvSwQesxrbl5fqjsODJ_";
    }, []);

    const wallets = useMemo(() => {
        return [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
            new SolongWalletAdapter(),
            new MathWalletAdapter(),
            new LedgerWalletAdapter(),
            new GlowWalletAdapter(),
            new CoinbaseWalletAdapter(),
            new TrustWalletAdapter(),
            new TokenPocketWalletAdapter()
        ];
    }, []);

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets}>
                {props.children}
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default SolanaProvider;
