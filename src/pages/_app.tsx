import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import DashboardLayout from "@/layouts/DashboardLayout";
import { initializeSocket, disconnectSocket } from "@/utils/socket";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const isAdminPage = router.pathname.startsWith('/admin');

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

  useEffect(() => {
    initializeSocket();
    return () => disconnectSocket();
  }, []);

  // On every route change, check auth status + 15-day session expiry
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const expiry = localStorage.getItem('loginExpiry');

    // Check if session has expired (older logins without expiry are treated as valid indefinitely)
    const isExpired = expiry ? Date.now() > Number(expiry) : false;

    if (isExpired) {
      // Session expired — clear everything and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('loginExpiry');
      localStorage.removeItem('userId');
      setIsAuthenticated(false);
      setAuthChecked(true);
      if (isAdminPage) router.replace('/login');
      return;
    }

    const authed = !!(token && user);
    setIsAuthenticated(authed);
    setAuthChecked(true);

    // If on an admin page without credentials, redirect immediately to login
    if (isAdminPage && !authed) {
      router.replace('/login');
    }
  }, [router.pathname]);

  return (
    <>
      {loading && (
        <div className="fixed top-0 left-0 right-0 z-[9999] h-0.5 bg-bg-dark overflow-hidden">
          <div className="h-full bg-brand-primary animate-[pageload_0.8s_ease-in-out_infinite]" style={{ width: '40%' }} />
        </div>
      )}
      {isAdminPage ? (
        // Wait until auth check is complete — show nothing to prevent dashboard flash
        !authChecked ? null : isAuthenticated ? (
          <DashboardLayout>
            <Component {...pageProps} />
          </DashboardLayout>
        ) : null // Unauthenticated — redirect in progress, render nothing
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
