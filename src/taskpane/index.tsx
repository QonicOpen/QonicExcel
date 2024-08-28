import * as React from "react";
import {createRoot} from "react-dom/client";
import App from "./components/App";
import {FluentProvider, webLightTheme} from "@fluentui/react-components";
import './index.css'
import {ReactNode} from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

/* global document, Office, module, require, HTMLElement */

const rootElement: HTMLElement | null = document.getElementById("container");
const root = rootElement ? createRoot(rootElement) : undefined;
const queryClient = new QueryClient();
let isOfficeInitialized = false;

const render = (Component) => {
    root?.render(
        <QueryClientProvider client={queryClient}>
            <FluentProvider theme={webLightTheme}>
                <Component/>
            </FluentProvider>
        </QueryClientProvider>)
}

/* Render application after Office initializes */
Office.onReady(() => {
    isOfficeInitialized = true;
    render(App)
});

if ((module as any).hot) {
    (module as any).hot.accept("./components/App", () => {
        const NextApp = require("./components/App").default as ReactNode;
        root?.render(NextApp);
    });
}
