import type { SolanaWallet } from "@coinflowlabs/react";
import { CoinflowPurchase } from "@coinflowlabs/react";
import type { Transaction } from "@solana/web3.js";
import { Keypair } from "@solana/web3.js";
import type { ReactElement } from "react";
import React, { useCallback, useState, useEffect, useMemo } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { CheckoutStage, useCheckoutState } from "./state";
import { createCheckoutTransaction, usdcMint } from "../utility/transaction";
import { Headline, Subline } from "../components/text";
import { css } from "@emotion/react";

const OffChain = (): ReactElement => {
    const { setStage, amount, invoiceId, setTxid } = useCheckoutState();
    const { connection } = useConnection();
    const [transaction, setTransaction] = useState<Transaction | undefined>();

    const signer = useMemo(() => Keypair.generate(), []);

    const sendTransaction = useCallback(async (trans: Transaction) => {
        trans.partialSign(signer);
        const hash = await connection.sendRawTransaction(trans.serialize());
        setTxid(hash);
        setStage(CheckoutStage.Finished);
        return hash;
    }, [signer, connection, setTxid, setStage]);

    const wallet = useMemo(() => {
        return {
            publicKey: signer.publicKey,
            sendTransaction // TODO: <- needs to be tested
        } as SolanaWallet;
    }, [signer, sendTransaction]);

    const onCompletion = useCallback(() => {
        setStage(CheckoutStage.Finished);
    }, [setStage]);

    useEffect(() => {
        createCheckoutTransaction(connection, signer.publicKey, usdcMint, amount, invoiceId)
            .then(setTransaction)
            .catch(() => { /* Empty */ });
    }, [signer, connection, invoiceId, amount, setTransaction]);

    return (
        <div css={css`height: 1280px;`}>
            <Headline>Off-chain Settlement</Headline>
            <Subline>Please enter your details below</Subline>
            <CoinflowPurchase
                wallet={wallet}
                transaction={transaction}
                merchantId="iwcapital"
                env="sandbox"
                amount={amount}
                connection={connection}
                blockchain="solana"
                onSuccess={onCompletion}
                webhookInfo={{ key: signer.secretKey }}
            />
        </div>
    );
};

export default OffChain;
