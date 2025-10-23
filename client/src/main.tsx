import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import App from "./App";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-react";
import AppLayout from "@/layouts/AppLayout";
import LandingPage from "@/pages/LandingPage";
import PrivateLayout from "@/layouts/PrivateLayout";
import Dashboard from "@/pages/Dashboard";
import Projects from "./pages/AllProjects";
import ProjectDetailPage from "./pages/ProjectDetails";
import { SignInWrapper } from "./components/auth/SignInWrapper";
import { SignUpWrapper } from "./components/auth/SignUpWrapper";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        element: <App />,
        children: [
          {
            index: true,
            element: <LandingPage />,
          },
          {
            path: "auth",
            element: (
              <SignedOut>
                <div className="flex flex-1 items-center justify-center">
                  <Outlet />
                </div>
              </SignedOut>
            ),
            children: [
              {
                index: true,
                element: <SignInWrapper />,
              },
              {
                path: "register",
                element: <SignUpWrapper />,
              },
            ],
          },
        ],
      },
      {
        path: "dashboard",
        element: (
          <SignedIn>
            <PrivateLayout />
          </SignedIn>
        ),
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "projects",
            element: <Projects />,
          },
          {
            path: "projects/:projectId",
            element: <ProjectDetailPage />,
          },
        ],
      },
      {
        path: "projects",
        children: [
          {
            path: ":projectId",
            element: (
              <SignedIn>
                <PrivateLayout />
              </SignedIn>
            ),
            children: [
              {
                index: true,
                element: <ProjectDetailPage />,
              },
            ],
          },
          {
            path: ":projectId/file/:fileId",
            element: <div>Builder page</div>,
          },
        ],
      },
      {
        path: "*",
        element: <div>404</div>,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <RouterProvider router={router} />
    </ClerkProvider>
  </StrictMode>
);
