import { SignIn } from "@clerk/clerk-react";
import { useLocation } from "react-router";

export function SignInWrapper() {
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  return <SignIn forceRedirectUrl={from} signUpUrl="/auth/register" />;
}
