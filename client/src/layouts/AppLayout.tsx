import usePath from "@/hooks/usePath";
import { useUser } from "@clerk/clerk-react";
import { Navigate, Outlet, useLocation } from "react-router";

export default function AppLayout() {
  const { isSignedIn, isLoaded } = useUser();
  const path = usePath();
  const location = useLocation();

  // Wait for Clerk to load
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  // If signed in and trying to access auth pages, redirect to dashboard
  if (isSignedIn && path.startsWith("/auth")) {
    // Check if there's a redirect path in state
    const from = location.state?.from?.pathname || "/dashboard";
    return <Navigate to={from} replace />;
  }

  // Protect dashboard and projects routes
  const protectedPaths = ["/dashboard", "/projects"];
  const isProtectedRoute = protectedPaths.some((prefix) =>
    path.startsWith(prefix)
  );

  if (!isSignedIn && isProtectedRoute) {
    // Store the current location they were trying to access
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
