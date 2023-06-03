import type { ReactElement } from "react";
import React, { lazy } from "react";
import { InvoiceStage, useInvoiceState } from "./state";
import OffChain from "./offchain";
import Initialize from "./initialize";
import OnChain from "./onchain";
import Finished from "./finished";

const Provider = lazy(async () => import("../modules/provider"));
const AlertProvider = lazy(async () => import("../modules/alert"));
const SolanaProvider = lazy(async () => import("../modules/solana"));
const InvoiceStateProvider = lazy(async () => import("./state"));

const Invoice = (): ReactElement | null => {
    const { stage } = useInvoiceState();
    switch (stage) {
        case InvoiceStage.Initialize: return <Initialize />;
        case InvoiceStage.OnChain: return <OnChain />;
        case InvoiceStage.OffChain: return <OffChain />;
        case InvoiceStage.Finished: return <Finished />;
        default: return null;
    }
};

const providers = [AlertProvider, SolanaProvider, InvoiceStateProvider];

const Root = (): ReactElement => {
    return <Provider providers={providers}><Invoice /></Provider>;
};

export default Root;
