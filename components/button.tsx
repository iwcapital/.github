import type { ReactElement } from "react";
import React, { useMemo, useCallback } from "react";
import { css } from "@emotion/react";

interface IProps {
    readonly title?: string;
    readonly buttons?: Array<[string, string]>;
    readonly columns?: number;
    readonly selected?: number;
    readonly onClick?: (index: number) => void;
}

export const MultiButton = (props: IProps): ReactElement => {
    const onClickWrapped = useCallback((index: number) => {
        return () => {
            if (props.onClick == null) { return; }
            props.onClick(index);
        };
    }, [props.onClick]);

    const buttonStyle = useMemo(() => {
        const cols = props.columns ?? 1;
        return css`
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            width: calc(${100 / cols}% - 8px);
            border-radius: 16px;
            padding: 4px 8px;
            margin: 4px;
            background-color: "#36456e";
            transition: transform 300ms ease-out 100ms;
            &:hover {
                transform: translateY(-2px);
            }
        `;
    }, [props.columns]);

    const textStyle = useMemo(() => {
        return css`
            padding: 4px 8px;
            text-align: center;
            display: inline-block;
            width: 100%;
            font-weight: bold;
        `;
    }, []);

    const buttonNodes = useMemo(() => {
        if (props.buttons == null) { return null; }
        const nodes: Array<ReactElement> = [];
        for (let i = 0; i < props.buttons.length; i++) {
            const [text, icon] = props.buttons[i];
            const style = css`
                ${buttonStyle}
                background-color: ${props.selected === i ? "#36456e" : "#2f323a"};
            `;
            const image = icon === "" ? null : <img src={icon} alt={`${text} logo`} width={32} height={32} />;
            nodes.push(
                <button type="button" css={style} key={text} onClick={onClickWrapped(i)}>
                    {image}
                    <span css={textStyle}>{text}</span>
                </button>
            );
        }
        return nodes;
    }, [props.buttons, props.selected, onClickWrapped]);

    const blockStyle = useMemo(() => {
        return css`
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            width: 100%;
            padding: 8px 0px;
        `;
    }, []);

    const titleNode = useMemo(() => {
        if (props.title == null) { return null; }
        const style = css`
            font-size: 16px;
            font-weight: bold;
            padding: 8px 0;
        `;
        return <div css={style}>{props.title}</div>;
    }, [props.title]);

    return (
        <>
            {titleNode}
            <div css={blockStyle}>{buttonNodes}</div>
        </>
    );
};
