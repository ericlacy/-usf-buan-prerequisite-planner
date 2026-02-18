import React from 'react';
import Head from 'next/head';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* Global meta tags */}
        <meta charSet="utf-8" />
        <meta name="robots" content="index, follow" />
        
        {/* PWA tags */}
        <meta name="application-name" content="USF BUAN Planner" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="USF BUAN Planner" />
      </Head>
      
      {/* Main app component */}
      <Component {...pageProps} />
      
      {/* Vercel Web Analytics */}
      <Analytics />
      
      {/* Vercel Speed Insights */}
      <SpeedInsights />
    </>
  );
}

// Optional: Add global error boundary
App.getInitialProps = async (appContext) => {
  // Handle any app-level logic here
  return {
    pageProps: {},
  };
};
