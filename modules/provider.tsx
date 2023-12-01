import type { ComponentType, LazyExoticComponent, PropsWithChildren, ReactElement } from "react";
import React from "react";

interface IProps extends PropsWithChildren {
    readonly providers: Array<LazyExoticComponent<ComponentType<PropsWithChildren>>>;
}

const Provider = (props: IProps): ReactElement => {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    if (props.providers.length === 0) { return <>{props.children}</>; }
    const [Tag] = props.providers;
    let { children } = props;
    if (props.providers.length > 1) {
        const next = props.providers.slice(1);
        children = <Provider providers={next}>{props.children}</Provider>;
    }
    return <Tag>{children}</Tag>;
};

export default Provider;
