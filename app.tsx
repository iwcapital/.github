import React, { useMemo, lazy, useEffect } from "react";
import background from "url:./public/background.webp";
import type { ReactElement } from "react";
import { createRoot } from "react-dom/client";
import { css } from "@emotion/react";

const Invoice = lazy(async () => import("./invoice/root"));

const Root = (): ReactElement => {
    const [popupContent, setPopupContent] = React.useState<ReactElement>();

    const popupStyle = useMemo(() => {
        return css`
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #f1f1ef;
            border-radius: 24px;
            filter: drop-shadow(4px 4px 20px #00000020);
            max-height: 90vh;
            width: 70vw;
            max-width: 512px;
            background-color: #2f323a;
            padding: 16px 32px;
            overflow: hidden auto;
        `;
    }, []);

    const popup = useMemo(() => {
        if (popupContent == null) { return null; }
        return <div css={popupStyle}>{popupContent}</div>;
    }, [popupContent]);

    const backgroundStyle = useMemo(() => {
        return css`
            width: 100%;
            height: 100%;
            object-fit: cover;
        `;
    }, []);

    const headlineStyle = useMemo(() => {
        return css`
            color: #ffffff;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-family: 'Times New Roman', Times, serif;
            font-size: 150px;
            font-weight: bold;
        `;
    }, []);

    useEffect(() => {
        const path = window.location.pathname.slice(1);
        switch (path) {
            case "invoice": setPopupContent(<Invoice />); break;
            default: window.history.replaceState({}, "", "/"); break;
        }
    }, []);

    useEffect(() => {
        import("./modules/firebase")
            .catch(() => { /* Ignore */ });
    }, []);

    return (
        <>
            <img css={backgroundStyle} src={background} alt="" />
            <span css={headlineStyle}>IW</span>
            {popup}
        </>
    );
};

createRoot(document.getElementById("root") ?? new HTMLElement()).render(<Root />);
