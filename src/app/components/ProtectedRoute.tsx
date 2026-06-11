import { Navigate } from "react-router";
import { useAppStore } from "../../store/useAppStore";

/**
 * Componente que protege rotas autenticadas.
 * Redireciona para /auth se o utilizador não estiver autenticado.
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAppStore();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}
