import type { Transaction } from "@solana/web3.js";
import { Connection, PublicKey } from "@solana/web3.js";
import type { StandardConnectFeature, Wallet, WalletWithFeatures } from "@wallet-standard/core";
import type { SolanaSignTransactionFeature } from "@solana/wallet-standard-features";
import { getWallets } from "@wallet-standard/core";
import type { PropsWithChildren, ReactElement } from "react";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export const connection = new Connection("https://solana-mainnet.g.alchemy.com/v2/8jg3wODRNmEHcvSwQesxrbl5fqjsODJ_", "confirmed");

type SupportedWallet = WalletWithFeatures<StandardConnectFeature & SolanaSignTransactionFeature>;

interface IUseSolana {
    wallets: Array<SupportedWallet>;
    connecting: boolean;
    connect: (wallet: SupportedWallet) => Promise<void>;
    pubKey: (wallet: SupportedWallet) => PublicKey;
    signing: boolean;
    sendTransaction: (wallet: SupportedWallet, transaction: Transaction) => Promise<string>;
}

const Context = createContext<IUseSolana>({
    wallets: [],
    connecting: false,
    connect: async () => Promise.reject(new Error("No provider")),
    pubKey: () => { throw new Error("No provider"); },
    signing: false,
    sendTransaction: async () => Promise.reject(new Error("No provider"))
});

export const useSolana = (): IUseSolana => {
    return useContext(Context);
};

const filterSupportedWallets = (wallets: ReadonlyArray<Wallet>): Array<SupportedWallet> => {
    return wallets
        .filter(wallet => Object.hasOwn(wallet.features, "standard:connect"))
        .filter(wallet => Object.hasOwn(wallet.features, "solana:signTransaction")) as Array<SupportedWallet>;
};

// eslint-disable-next-line @typescript-eslint/unbound-method
const { on, get } = getWallets();

const SolanaProvider = (props: PropsWithChildren): ReactElement => {
    const [connecting, setConnecting] = useState(false);
    const [signing, setSigning] = useState(false);
    const [supportedWallets, setSupportedWallets] = useState(filterSupportedWallets(get()));

    useEffect(() => {
        const listeners = [
            on("register", (...wallets) =>
                setSupportedWallets(current => [...current, ...filterSupportedWallets(wallets)])),
            on("unregister", (...wallets) =>
                setSupportedWallets(current =>
                    current.filter(wallet =>
                        wallets.includes(wallet))))
        ];
        return (): void => listeners.forEach(off => off());
    }, []);

    const connect = useCallback(async (wallet: SupportedWallet) => {
        setConnecting(true);
        try {
            await wallet.features["standard:connect"].connect();
        } finally {
            setConnecting(false);
        }
    }, [setConnecting]);

    const pubKey = useCallback((wallet: SupportedWallet) => {
        if (wallet.accounts.length === 0) { throw new Error("No account found"); }
        return new PublicKey(wallet.accounts[0].publicKey);
    }, []);

    const sendTransaction = useCallback(async (wallet: SupportedWallet, transaction: Transaction) => {
        setSigning(true);
        try {
            if (wallet.accounts.length === 0) { throw new Error("No account found"); }
            console.log(transaction);
            const serializedTransaction = transaction.serialize({
                requireAllSignatures: false,
                verifySignatures: false
            });
            const [{ signedTransaction }] = await wallet.features["solana:signTransaction"].signTransaction({
                transaction: serializedTransaction,
                account: wallet.accounts[0]
            });
            console.log(signedTransaction);
            const block = await connection.getLatestBlockhash();
            const signature = await connection.sendRawTransaction(signedTransaction);
            await connection.confirmTransaction({ ...block, signature }, "confirmed");
            return signature;
        } finally {
            setSigning(false);
        }
    }, [setSigning]);

    const context = useMemo(() => ({
        wallets: supportedWallets,
        connecting,
        connect,
        pubKey,
        signing,
        sendTransaction
    }), [supportedWallets]);

    return <Context.Provider value={context}>{props.children}</Context.Provider>;
};

export default SolanaProvider;
