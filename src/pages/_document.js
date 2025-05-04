import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Preconnect to key domains for faster resource loading */}
          <link
            rel="preconnect"
            href="https://fonts.googleapis.com"
            crossOrigin="anonymous"
          />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            rel="preconnect"
            href="https://images.unsplash.com"
            crossOrigin="anonymous"
          />

          {/* Preload key webfonts */}
          <link
            rel="preload"
            as="font"
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
            crossOrigin="anonymous"
          />

          {/* Preload critical CSS */}
          <link
            rel="preload"
            href="/_next/static/css/app.css"
            as="style"
          />

          {/* DNS prefetch for third-party resources */}
          <link rel="dns-prefetch" href="https://images.unsplash.com" />

          {/* Meta tags for better performance */}
          <meta httpEquiv="x-dns-prefetch-control" content="on" />
          <meta name="theme-color" content="#000000" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument; 