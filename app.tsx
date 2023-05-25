import "css:./app.css";
import React from "react";
import background from "url:./public/background.webp";
import type { ReactElement } from "react";
import { createRoot } from "react-dom/client";


const Root = (): ReactElement => {

    return (
        <>
            <img className="background" src={background} alt="" />
            <span className="headline">IW</span>
        </>
    );
};

createRoot(document.getElementById("root") ?? new HTMLElement()).render(<Root />);
