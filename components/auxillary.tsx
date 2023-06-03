import styled from "@emotion/styled";
import { css } from "@emotion/react";

export const VerticalSpacer = styled.div((props: { length?: string }) => css`
    height: ${props.length ?? "16px"};
`);

export const HorizontalSpacer = styled.span((props: { length?: string }) => css`
    width: ${props.length ?? "16px"};
`);
