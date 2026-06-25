import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import DashboardLayout from "@/layouts/DashboardLayout";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const start = () => setLoading(true);
    const end = () => setLoading(false);
    router.events.on('routeChangeStart', start);
    router.events.on('routeChangeComplete', end);
    router.events.on('routeChangeError', end);
    return () => {
      router.events.off('routeChangeStart', start);
      router.events.off('routeChangeComplete', end);
      router.events.off('routeChangeError', end);
    };
  }, [router]);

  const isAdminPage = router.pathname.startsWith('/admin');

  return (
    <>
      {loading && (
        <div className="fixed top-0 left-0 right-0 z-[9999] h-0.5 bg-bg-dark overflow-hidden">
          <div className="h-full bg-brand-primary animate-[pageload_0.8s_ease-in-out_infinite]" style={{ width: '40%' }} />
        </div>
      )}
      {isAdminPage ? (
        <DashboardLayout>
          <Component {...pageProps} />
        </DashboardLayout>
      ) : (
        <Component {...pageProps} />
      )}
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1C1C1E', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
        }}
      />
    </>
  );
}
