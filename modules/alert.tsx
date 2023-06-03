import type { PropsWithChildren, ReactElement } from "react";
import React, { createContext, useContext, useMemo, useCallback, useState } from "react";
import { css } from "@emotion/react";

interface IUseAlert {
    showAlert: (text: string, color: string, icon?: string) => void;
}

const Context = createContext<IUseAlert>({
    showAlert: () => { /* Empty */ }
});

export const useAlert = (): IUseAlert => {
    return useContext(Context);
};

const AlertProvider = (props: PropsWithChildren): ReactElement => {
    const [text, setText] = useState("");
    const [color, setColor] = useState("");
    const [icon, setIcon] = useState("");
    const [show, setShow] = useState(false);
    const [endTimout, setEndTimout] = useState<() => void>();

    // TODO: floating on window not on popup
    // TODO: does not auto remove after timer
    // TODO: not clickable if not visible

    const showAlert = useCallback((alertText: string, alertColor: string, alertIcon?: string): void => {
        if (endTimout != null) { endTimout(); }
        setText(alertText);
        setColor(alertColor);
        setIcon(alertIcon ?? "");
        setShow(true);
        const id = setTimeout(() => setShow(false), 3000);
        setEndTimout(() => clearTimeout(id));
    }, [endTimout, setEndTimout, setText, setColor, setIcon, setShow]);

    const alertClicked = useCallback(() => {
        setShow(false);
        if (endTimout != null) { endTimout(); }
    }, [setShow]);

    const alertStyle = useMemo(() => {
        return css`
            background-color: ${color};
            color: #ffffff;
            border-radius: 4px;
            padding: 8px;
            position: fixed;
            top: 10%;
            left: 50%;
            width: 80%;
            transform: translateX(-50%);
            opacity: ${show ? 1 : 0};
            transition: opacity 300ms ease-out 100ms;
            cursor: ${show ? "pointer" : "default"};
        `;
    }, [color, show]);

    const alertIcon = useMemo(() => {
        if (icon == null || icon.length === 0) { return null; }
        return <img src={icon} alt="alert icon" width={32} height={32} />;
    }, [icon]);

    const alert = useMemo(() => {
        return (
            <div css={alertStyle} onClick={alertClicked}>
                {alertIcon}
                <span css={{ height: 32 }}>{text}</span>
            </div>
        );
    }, [alertClicked, alertStyle, alertIcon, text]);

    const context = useMemo(() => {
        return { showAlert };
    }, [showAlert]);

    return <Context.Provider value={context}>{props.children}{alert}</Context.Provider>;
};

export default AlertProvider;

