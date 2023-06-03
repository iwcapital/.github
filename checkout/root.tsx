import type { ReactElement } from "react";
import React, { lazy } from "react";
import { CheckoutStage, useCheckoutState } from "./state";
import OffChain from "./offchain";
import Initialize from "./initialize";
import OnChain from "./onchain";
import Finished from "./finished";

const Provider = lazy(async () => import("../modules/provider"));
const AlertProvider = lazy(async () => import("../modules/alert"));
const SolanaProvider = lazy(async () => import("../modules/solana"));
const CheckoutStateProvider = lazy(async () => import("./state"));

const Checkout = (): ReactElement | null => {
    const { stage } = useCheckoutState();
    switch (stage) {
        case CheckoutStage.Initialize: return <Initialize />;
        case CheckoutStage.OnChain: return <OnChain />;
        case CheckoutStage.OffChain: return <OffChain />;
        case CheckoutStage.Finished: return <Finished />;
        default: return null;
    }
};

const providers = [AlertProvider, SolanaProvider, CheckoutStateProvider];

const Root = (): ReactElement => {
    return <Provider providers={providers}><Checkout /></Provider>;
};

export default Root;
