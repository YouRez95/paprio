import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { FileText } from "lucide-react";
import { Link, Outlet } from "react-router";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Link className="flex items-center justify-center" to="/">
          <FileText className="h-6 w-6" />
          <span className="ml-2 text-lg font-bold">Paprio</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            to="#features"
          >
            Features
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            to="#how-it-works"
          >
            How It Works
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            to="#pricing"
          >
            Pricing
          </Link>
          <SignedOut>
            <Link
              className="text-sm font-medium hover:underline underline-offset-4"
              to="/auth"
            >
              Sign In
            </Link>
          </SignedOut>
          <SignedIn>
            <Link
              className="text-sm font-medium hover:underline underline-offset-4"
              to="/dashboard"
            >
              Dashboard
            </Link>
            <UserButton />
          </SignedIn>
        </nav>
      </header>
      <Outlet />
    </div>
  );
}

export default App;
