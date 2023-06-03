import type { PropsWithChildren, ReactElement } from "react";
import React, { createContext, useContext, useMemo, useState } from "react";

export enum CheckoutStage {
    Initialize = "initialize",
    OnChain = "onchain",
    OffChain = "offchain",
    Finished = "finished"
}

interface IUseCheckoutState {
    stage: CheckoutStage;
    setStage: (state: CheckoutStage) => void;
    invoiceId: string;
    setInvoiceId: (invoiceId: string) => void;
    amount: number;
    setAmount: (amount: number) => void;
    txid: string;
    setTxid: (txid: string) => void;
}

const Context = createContext<IUseCheckoutState>({
    stage: CheckoutStage.Initialize,
    setStage: () => { /* Empty */ },
    invoiceId: "",
    setInvoiceId: () => { /* Empty */ },
    amount: 0,
    setAmount: () => { /* Empty */ },
    txid: "",
    setTxid: () => { /* Empty */ }
});

export const useCheckoutState = (): IUseCheckoutState => {
    return useContext(Context);
};

const CheckoutStateProvider = (props: PropsWithChildren): ReactElement => {
    const [stage, setStage] = useState(CheckoutStage.Initialize);
    const [invoiceId, setInvoiceId] = useState("");
    const [amount, setAmount] = useState(0);
    const [txid, setTxid] = useState("");

    const context = useMemo(() => {
        return { stage, setStage, invoiceId, setInvoiceId, amount, setAmount, txid, setTxid };
    }, [stage, setStage, invoiceId, setInvoiceId, amount, setAmount, txid, setTxid]);

    return <Context.Provider value={context}>{props.children}</Context.Provider>;
};

export default CheckoutStateProvider;

