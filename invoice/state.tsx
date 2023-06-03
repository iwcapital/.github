import type { PropsWithChildren, ReactElement } from "react";
import React, { createContext, useContext, useMemo, useState } from "react";

export enum InvoiceStage {
    Initialize = "initialize",
    OnChain = "onchain",
    OffChain = "offchain",
    Finished = "finished"
}

interface IUseInvoiceState {
    stage: InvoiceStage;
    setStage: (state: InvoiceStage) => void;
    invoiceId: string;
    setInvoiceId: (invoiceId: string) => void;
    amount: number;
    setAmount: (amount: number) => void;
    txid: string;
    setTxid: (txid: string) => void;
}

const Context = createContext<IUseInvoiceState>({
    stage: InvoiceStage.Initialize,
    setStage: () => { /* Empty */ },
    invoiceId: "",
    setInvoiceId: () => { /* Empty */ },
    amount: 0,
    setAmount: () => { /* Empty */ },
    txid: "",
    setTxid: () => { /* Empty */ }
});

export const useInvoiceState = (): IUseInvoiceState => {
    return useContext(Context);
};

const InvoiceStateProvider = (props: PropsWithChildren): ReactElement => {
    const [stage, setStage] = useState(InvoiceStage.Initialize);
    const [invoiceId, setInvoiceId] = useState("");
    const [amount, setAmount] = useState(0);
    const [txid, setTxid] = useState("");

    const context = useMemo(() => {
        return { stage, setStage, invoiceId, setInvoiceId, amount, setAmount, txid, setTxid };
    }, [stage, setStage, invoiceId, setInvoiceId, amount, setAmount, txid, setTxid]);

    return <Context.Provider value={context}>{props.children}</Context.Provider>;
};

export default InvoiceStateProvider;

