import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';
import getConfig from 'next/config';
// const ASSEMBLY_URL = process.env.ASSEMBLY_URL;
// const GTM_ID = process.env.GTM_ID;

export default function Document() {
  const { serverRuntimeConfig } = getConfig();
  const { ASSEMBLY_URL, GTM_ID } = serverRuntimeConfig;

  return (
    <Html lang="en">
      <Head>
        {/* {loadScripts && <script src={`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`} />}
        {loadScripts && <script src={`${ASSEMBLY_URL}`} />} */}
        <link rel="preconnect" href="https://macleans.wpengine.com" />
        <link rel="dns-prefetch" href="https://macleans.wpengine.com" />
        {/* <link rel="preconnect" href="https://use.typekit.net" />
        <link rel="dns-prefetch" href="https://use.typekit.net" /> */}
        {/* <link rel="preload" href="https://use.typekit.net/dpc3rky.css" as="style" />
        <link rel="stylesheet" href="https://use.typekit.net/dpc3rky.css" /> */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
