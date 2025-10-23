import { useLocation } from "react-router";

export default function usePath() {
  const location = useLocation();
  return location.pathname;
}
