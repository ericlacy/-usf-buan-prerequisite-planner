import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';

// Dynamically import the prerequisite planner to avoid SSR issues with html2canvas
const PrereqPlanner = dynamic(() => import('../components/PrereqPlanner'), {
  ssr: false, // Disable server-side rendering for this component
  loading: () => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          width: 40, 
          height: 40, 
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #00543C',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px'
        }} />
        <p>Loading Business Analytics Course Planner...</p>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  )
});

export default function Home() {
  return (
    <>
      <Head>
        <title>USF Business Analytics Course Planner</title>
        <meta name="description" content="University of San Francisco Business Analytics Major and Minor Course Prerequisite Planner. Plan your academic path with interactive course mapping, progress tracking, and requirement validation." />
        <meta name="keywords" content="USF, University of San Francisco, Business Analytics, Course Planner, Prerequisites, Academic Planning, BUAN, McLaren School" />
        <meta name="author" content="University of San Francisco - McLaren School of Management" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="USF Business Analytics Course Planner" />
        <meta property="og:description" content="Interactive course prerequisite planner for USF Business Analytics students. Plan your major or minor with visual course mapping and progress tracking." />
        <meta property="og:image" content="/og-image.png" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="USF Business Analytics Course Planner" />
        <meta property="twitter:description" content="Plan your Business Analytics degree at USF with interactive prerequisite mapping." />
        <meta property="twitter:image" content="/og-image.png" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        
        {/* Viewport */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#00543C" />
      </Head>

      <main style={{ minHeight: '100vh', backgroundColor: '#fafbfc' }}>
        <PrereqPlanner />
      </main>

      {/* Global styles */}
      <style jsx global>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        html, body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        body {
          background-color: #fafbfc;
          color: #1f2937;
        }
        
        /* Scrollbar styling */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        
        /* Print styles */
        @media print {
          .save-button, .warning-banner {
            display: none !important;
          }
          
          .planner-container {
            background: white !important;
            padding: 10px !important;
          }
          
          @page {
            size: landscape;
            margin: 0.5in;
          }
        }
      `}</style>
    </>
  );
}

// This function gets called at build time for static generation
export async function getStaticProps() {
  return {
    props: {
      buildTime: new Date().toISOString(),
    },
    // Regenerate the page at most once every hour
    revalidate: 3600,
  };
}
