import { Navigate } from "react-router-dom";

export type ProtectedRouteProps = {
    isAuthenticated: boolean;
    outlet: JSX.Element;
  };
  
  export default function ProtectedRoute({
    isAuthenticated,
    outlet,
  }: ProtectedRouteProps) {
    if (isAuthenticated) {
      return outlet;
    } else {
      return <Navigate to={"/login"} />;
    }
  }