import { css, keyframes } from "@emotion/react";
import type { ReactElement } from "react";
import React, { useMemo } from "react";
import { range } from "../utility/range";

const spin = keyframes`
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
`;

interface IProps {
    size?: number;
    width?: number;
}

export const Spinner = (props: IProps): ReactElement => {

    const innerDivs = useMemo(() => {
        const size = props.size ?? 32;
        const width = props.width ?? 4;
        const innerSize = size - 2 * width;
        return range(3).map(i => {
            const delay = 45 - 15 * i;
            const style = css`
                box-sizing: border-box;
                position: absolute;
                width: ${innerSize}px;
                height: ${innerSize}px;
                margin: ${width}px;
                border: ${width}px solid #f1f1ef;
                border-radius: 50%;
                animation: ${spin} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
                border-color: #f1f1ef transparent transparent transparent;
                animation-delay: -0.${delay}s;
            `;
            return <div css={style} key={i} />;
        });
    }, [props.size, props.width]);

    const blockStyle = useMemo(() => {
        const size = props.size ?? 32;
        return css`
            position: relative;
            width: ${size}px;
            height: ${size}px;
        `;
    }, [props.width, props.size]);

    return <div css={blockStyle}>{innerDivs}</div>;
};
