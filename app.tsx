import "css:./app.css";
import React, { useMemo, useCallback, lazy, useEffect } from "react";
import background from "url:./public/background.webp";
import type { ReactElement } from "react";
import { createRoot } from "react-dom/client";

const Checkout = lazy(() => import("./checkout"));

const Root = (): ReactElement => {
    const [popupContent, setPopupContent] = React.useState<ReactElement | null>(null);

    const closePopup = useCallback(() => {
        const path = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.replaceState({ path }, "", path);
        setPopupContent(null);
    }, []);

    const popup = useMemo(() => {
        if (popupContent == null) { return; }
        return (
            <>
                <div className="popup-overlay" onClick={closePopup} />
                <div className="popup-background">{popupContent}</div>
            </>
        );
    }, [popupContent]);

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        if (query.get("checkout") === "") {
            setPopupContent(<Checkout />);
        }
    }, []);

    return (
        <>
            <img className="background" src={background} alt="" />
            <span className="headline">IW</span>
            {popup}
        </>
    );
};

createRoot(document.getElementById("root") ?? new HTMLElement()).render(<Root />);
