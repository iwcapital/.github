import usdtLogo from "url:../public/usdt.svg";
import usdcLogo from "url:../public/usdc.svg";
import type { ReactElement } from "react";
import React, { useState, useCallback, useMemo } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletReadyState } from "@solana/wallet-adapter-base";
import { createCheckoutTransaction, usdcMint, usdtMint } from "../utility/transaction";
import { CheckoutStage, useCheckoutState } from "./state";
import { MultiButton } from "../components/button";
import { Disclaimer, Headline, Subline } from "../components/text";
import { useAlert } from "../modules/alert";
import { PublicKey } from "@solana/web3.js";

const OnChain = (): ReactElement => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { wallets, wallet, select, connect, sendTransaction } = useWallet();
    const { setStage, amount, invoiceId, setTxid } = useCheckoutState();
    const { showAlert } = useAlert();
    const { connection } = useConnection();
    const [mint, setMint] = useState(usdcMint);

    const selectToken = useCallback((index: number) => {
        setMint(index === 0 ? usdcMint : usdtMint);
    }, [setMint]);

    const connectWallet = useCallback((index: number) => {
        const newWallet = wallets[index];
        select(newWallet.adapter.name);
    }, [wallets, select]);

    const walletButtons = useMemo(() => {
        return wallets.map(x => [x.adapter.name, x.adapter.icon] as [string, string]);
    }, [wallets]);

    const tokenButtons = useMemo(() => {
        return [
            ["USDC", usdcLogo],
            ["USDT", usdtLogo]
        ] as Array<[string, string]>;
    }, []);

    const selectedToken = useMemo(() => {
        return mint.equals(usdcMint) ? 0 : 1;
    }, [mint]);

    const selectedWallet = useMemo(() => {
        if (wallet == null) { return -1; }
        return wallets.findIndex(x => x.adapter.name === wallet.adapter.name);
    }, [wallet, wallets]);

    const purchasePressed = useCallback(() => {
        if (wallet == null) { return; }
        const isInstalled = wallet.readyState === WalletReadyState.Installed;
        const isLoadable = wallet.readyState === WalletReadyState.Loadable;
        const isReady = isInstalled || isLoadable;
        if (!isReady) {
            window.open(wallet.adapter.url, "_blank", "noopener,noreferrer");
            return;
        }
        const publicKey = (): PublicKey => wallet.adapter.publicKey ?? PublicKey.default;
        connect() // TODO: <- wallet not connected in time (the first time)
            .then(async () => createCheckoutTransaction(connection, publicKey(), mint, amount, invoiceId, true))
            .then(async transaction => sendTransaction(transaction, connection))
            .then(setTxid)
            .then(() => setStage(CheckoutStage.Finished))
            .catch(error => showAlert(`${error}`, "#f99244"));
    }, [wallet, connect, sendTransaction, connection, showAlert, setStage, setTxid, mint, amount, invoiceId]);

    return (
        <>
            <Headline>On-chain Settlement</Headline>
            <Subline>Please follow the steps below</Subline>
            <MultiButton title="1. Select your token" buttons={tokenButtons} selected={selectedToken} columns={2} onClick={selectToken} />
            <MultiButton title="2. Select your wallet" buttons={walletButtons} selected={selectedWallet} columns={3} onClick={connectWallet} />
            <MultiButton buttons={[["Purchase", ""]]} selected={0} columns={1} onClick={purchasePressed} />
            <Disclaimer>By approving the transaction you are agreeing to the IW Capital Inc. terms, privacy and refund policy.</Disclaimer>
        </>
    );
};

export default OnChain;
