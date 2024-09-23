import { Links, Meta, Outlet, Scripts } from '@remix-run/react';
import { ThemeProvider } from '../lib/context/theme_context';
import ProviderWrapper from '../utils/provider_wrapper';
import '../index.css';
import SearchBar from '../components/base/search_bar/search_bar';
import DefaultErrorBoundary from '../components/base/error_boundry/error_boundary';

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Poke Search</title>
        <Meta />
        <Links />
      </head>
      <body>
        <ProviderWrapper>
          <ThemeProvider>
            <div id="root">
              <SearchBar />
              <Outlet />
            </div>
          </ThemeProvider>
        </ProviderWrapper>
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Error!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <DefaultErrorBoundary />
        <Scripts />
      </body>
    </html>
  );
}