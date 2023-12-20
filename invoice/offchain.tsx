import type { SolanaWallet } from "@coinflowlabs/react";
import { CoinflowPurchase } from "@coinflowlabs/react";
import type { Transaction } from "@solana/web3.js";
import { Keypair } from "@solana/web3.js";
import type { ReactElement } from "react";
import React, { useCallback, useState, useEffect, useMemo } from "react";
import { InvoiceStage, useInvoiceState } from "./state";
import { createInvoiceTransaction, usdcMint } from "../utility/transaction";
import { Headline, Subline } from "../components/text";
import { css } from "@emotion/react";
import { useAlert } from "../modules/alert";
import { Spinner } from "../components/spinner";
import { connection } from "../modules/solana";

const OffChain = (): ReactElement => {
    const { setStage, amount, invoiceId, setTxid } = useInvoiceState();
    const { showAlert } = useAlert();
    const [transaction, setTransaction] = useState<Transaction>();

    const signer = useMemo(() => Keypair.generate(), []);

    const sendTransaction = useCallback(async (trans: Transaction) => {
        trans.partialSign(signer);
        const hash = await connection.sendRawTransaction(trans.serialize());
        setTxid(hash);
        return hash;
    }, [signer, connection, setTxid, setStage]);

    const onCompletion = useCallback(() => {
        setStage(InvoiceStage.Finished);
    }, [setStage]);

    const wallet = useMemo(() => {
        return {
            publicKey: signer.publicKey,
            sendTransaction
        } as SolanaWallet;
    }, [signer, sendTransaction]);

    const spinnerStyle = useMemo(() => {
        return css`
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: -1;
        `;
    }, []);

    const blockStyle = useMemo(() => {
        return css`
            height: 1280px;
        `;
    }, []);

    const coinflow = useMemo(() => {
        if (transaction == null) { return null; }
        return (
            <CoinflowPurchase
                wallet={wallet}
                transaction={transaction}
                merchantId="iwcapital"
                amount={amount}
                connection={connection}
                blockchain="solana"
                onSuccess={onCompletion}
                webhookInfo={{ key: signer.secretKey }}
            />
        );
    }, [wallet, transaction, amount, connection, signer, onCompletion]);

    useEffect(() => {
        createInvoiceTransaction(connection, signer.publicKey, usdcMint, amount, invoiceId)
            .then(setTransaction)
            .catch(error => showAlert(`${error}`, "#f99244"));
    }, [signer, connection, invoiceId, amount, setTransaction, showAlert]);

    return (
        <div css={blockStyle}>
            <Headline>Off-chain Settlement</Headline>
            <Subline>Please enter your details below</Subline>
            <div css={spinnerStyle}><Spinner /></div>
            {coinflow}
        </div>
    );
};

export default OffChain;
