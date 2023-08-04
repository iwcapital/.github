import solanaLogo from "url:../public/solana.svg";
import cardLogo from "url:../public/generic.svg";
import type { ReactElement } from "react";
import React, { useCallback, useMemo } from "react";
import { InvoiceStage } from "./state";
import { useInvoiceState } from "./state";
import { Input } from "../components/input";
import { MultiButton } from "../components/button";
import { useAlert } from "../modules/alert";
import { Headline, Subline } from "../components/text";
import { VerticalSpacer } from "../components/auxillary";

const Initialize = (): ReactElement => {
    const { setStage, invoiceId, setInvoiceId, amount, setAmount } = useInvoiceState();
    const { showAlert } = useAlert();

    const buttonClicked = useCallback((index: number) => {
        if (invoiceId.length !== 7) {
            showAlert("Error: Invalid invoice number", "#f99244");
            return;
        }
        if (amount <= 10) {
            showAlert("Error: Invalid invoice amount", "#f99244");
            return;
        }
        setStage(index === 0 ? InvoiceStage.OnChain : InvoiceStage.OffChain);
    }, [amount, invoiceId, setStage]);

    const invoiceIdChanged = useCallback((text: string) => {
        setInvoiceId(text);
    }, [setInvoiceId]);

    const amountChanged = useCallback((text: string) => {
        const newAmount = parseFloat(text);
        setAmount(isNaN(newAmount) ? 0 : newAmount);
    }, [setAmount]);

    const buttons = useMemo(() => {
        return [
            ["Settle On-chain", solanaLogo],
            ["Settle Off-chain", cardLogo]
        ] as Array<[string, string]>;
    }, []);

    return (
        <>
            <Headline>IW Capital LLC</Headline>
            <Subline>Invoice Settlement</Subline>
            <Input title="Invoice No." onChange={invoiceIdChanged} accessory="#" placeholder="1234567" aria-label="Invoice number" />
            <Input title="Amount" onChange={amountChanged} accessory="$" placeholder="1000" aria-label="Invoice amount" />
            <VerticalSpacer />
            <MultiButton buttons={buttons} columns={2} onClick={buttonClicked} />
        </>
    );
};

export default Initialize;
