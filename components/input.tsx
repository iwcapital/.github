import type { ReactElement, ChangeEvent } from "react";
import React, { useCallback, useState, useMemo } from "react";
import { stripNonDigits } from "../utility/string";
import { css } from "@emotion/react";

export enum InputType {
    Number = "number",
    Decimal = "decimal"
}

export interface InputProps {
    readonly initial?: string;
    readonly title?: string;
    readonly accessory?: string;
    readonly placeholder?: string;
    readonly label?: string;
    readonly type?: InputType;
    readonly onChange?: (text: string) => void;
}

export const Input = (props: InputProps): ReactElement => {
    const [rawValue, setRawValue] = useState(props.initial ?? "");

    const onChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
        let text = event.target.value;
        switch (props.type) {
            case InputType.Number: text = stripNonDigits(text); break;
            case InputType.Decimal: text = stripNonDigits(text, true); break;
            default: break;
        }
        setRawValue(text);
        if (props.onChange == null) { return; }
        props.onChange(text);
    }, [props.type, props.onChange]);

    const titleNode = useMemo(() => {
        if (props.title == null) { return null; }
        const style = css`
            font-size: 16px;
            font-weight: bold;
            padding: 8px 0;
        `;
        return <div css={style}>{props.title}</div>;
    }, [props.title]);

    const accessoryNode = useMemo(() => {
        if (props.accessory == null) { return null; }
        const style = css`
            padding-right: 8px;
        `;
        return <span css={style}>{props.accessory}</span>;
    }, [props.accessory]);

    const blockStyle = useMemo(() => {
        return css`
            display: flex;
            flex-direction: row;
            align-items: center;
            border: 1px solid #22252b;
            border-radius: 16px;
            height: 56px;
            padding: 0 16px;
            background-color: #22252b;
            cursor: pointer;
            &:hover {
                background-color: #2f323a;
            }
            &:focus-within {
                border-color: #36456e;
                border-width: 2px;
            }
        `;
    }, []);

    const inputStyle = useMemo(() => {
        return css`
            flex: 1;
            height: 100%;
            &::placeholder {
                color: #8e8e8e;
            }
        `;
    }, []);

    return (
        <>
            {titleNode}
            <div css={blockStyle}>
                {accessoryNode}
                <input type="text" css={inputStyle} value={rawValue} placeholder={props.placeholder} aria-label={props.label} onChange={onChange} />
            </div>
        </>
    );
};
