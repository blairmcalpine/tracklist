import { PlayerContextProvider } from "@/hooks/usePlayer";
import "@/styles/globals.css";
import { api } from "@/utils/api";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import localFont from "next/font/local";
import Head from "next/head";

const circular = localFont({
  src: [
    { path: "Circular.otf", weight: "400", style: "normal" },
    { path: "CircularThin.otf", weight: "100", style: "normal" },
  ],
  variable: "--font-circular",
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <Head>
        <title>TrackList</title>
        <meta
          name="description"
          content="List an artist's songs in a simple, easy to view order"
        />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <SessionProvider session={session}>
        <main className={circular.className}>
          <PlayerContextProvider>
            <Component {...pageProps} />
          </PlayerContextProvider>
        </main>
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
