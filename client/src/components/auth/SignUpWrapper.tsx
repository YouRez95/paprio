import { SignUp } from "@clerk/clerk-react";
import { useLocation } from "react-router";

export function SignUpWrapper() {
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  return <SignUp forceRedirectUrl={from} signInUrl="/auth" />;
}
