import usdtLogo from "url:../public/usdt.svg";
import usdcLogo from "url:../public/usdc.svg";
import type { ReactElement } from "react";
import React, { useState, useCallback, useMemo } from "react";
import { createInvoiceTransaction, usdcMint, usdtMint } from "../utility/transaction";
import { InvoiceStage, useInvoiceState } from "./state";
import { MultiButton } from "../components/button";
import { Disclaimer, Headline, Subline } from "../components/text";
import { useAlert } from "../modules/alert";
import { Spinner } from "../components/spinner";
import { css } from "@emotion/react";
import { connection, useSolana } from "../modules/solana";

const OnChain = (): ReactElement => {
    const { wallets, connecting, connect, signing, sendTransaction, pubKey } = useSolana();
    const [wallet, setWallet] = useState(wallets[0]);
    const { setStage, amount, invoiceId, setTxid } = useInvoiceState();
    const { showAlert } = useAlert();
    const [mint, setMint] = useState(usdcMint);

    const selectToken = useCallback((index: number) => {
        setMint(index === 0 ? usdcMint : usdtMint);
    }, [setMint]);

    const connectWallet = useCallback((index: number) => {
        setWallet(wallets[index]);
    }, [wallets, setWallet]);

    const walletButtons = useMemo(() => {
        return wallets
            .filter(x => x.chains.includes("solana:mainnet"))
            .map(x => [x.name, x.icon] as [string, string]);
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
        return wallets.findIndex(x => x.name === wallet.name);
    }, [wallet, wallets]);

    const submitTransaction = async (): Promise<string> => {
        await connect(wallet);
        const publicKey = pubKey(wallet);
        const transaction = await createInvoiceTransaction(connection, publicKey, mint, amount, invoiceId);
        return sendTransaction(wallet, transaction);
    };

    const purchasePressed = useCallback(() => {
        submitTransaction()
            .then(setTxid)
            .then(() => setStage(InvoiceStage.Finished))
            .catch(error => {
                showAlert(`${error}`, "#f99244");
            });
    }, [submitTransaction]);

    const actionButton = useMemo(() => {
        if (connecting || signing) {
            return <div css={css`display: flex; justify-content: center; height: 59px;`}><Spinner /></div>;
        }
        return <MultiButton buttons={[["Purchase", ""]]} selected={0} columns={1} onClick={purchasePressed} />;
    }, [connecting, signing, purchasePressed]);

    return (
        <>
            <Headline>On-chain Settlement</Headline>
            <Subline>Please follow the steps below</Subline>
            <MultiButton title="1. Select your token" buttons={tokenButtons} selected={selectedToken} columns={2} onClick={selectToken} />
            <MultiButton title="2. Select your wallet" buttons={walletButtons} selected={selectedWallet} columns={3} onClick={connectWallet} />
            {actionButton}
            <Disclaimer>By approving the transaction you are agreeing to the IW Capital terms, privacy and refund policy.</Disclaimer>
        </>
    );
};

export default OnChain;
