import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { HelmetProvider } from "react-helmet-async";
import { AppProviders, AppRoutes } from "./App";

export function render(url: string) {
  const helmetContext: any = {};
  const html = ReactDOMServer.renderToString(
    <HelmetProvider context={helmetContext}>
      <AppProviders>
        <StaticRouter location={url}>
          <AppRoutes />
        </StaticRouter>
      </AppProviders>
    </HelmetProvider>
  );

  const { helmet } = helmetContext;

  return {
    html,
    helmet,
  };
}
