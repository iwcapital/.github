import explorerIcon from "url:../public/explorer.svg";
import type { ReactElement } from "react";
import React, { useCallback, useMemo } from "react";
import { useCheckoutState } from "./state";
import { MultiButton } from "../components/button";
import { Headline, Subline } from "../components/text";

const Finished = (): ReactElement => {
    const { txid } = useCheckoutState();

    const explorerClicked = useCallback(() => {
        window.open(`https://solscan.io/tx/${txid}`, "_blank", "noopener,noreferrer");
    }, [txid]);

    const buttons = useMemo(() => {
        return [
            ["View on explorer", explorerIcon]
        ] as Array<[string, string]>;
    }, []);

    return (
        <>
            <Headline>Settlement Completed</Headline>
            <Subline>Thank you for your payment. You can now close this page.</Subline>
            <MultiButton buttons={buttons} columns={1} onClick={explorerClicked} />
        </>
    );
};

export default Finished;
