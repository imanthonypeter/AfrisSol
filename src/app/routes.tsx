import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { SplashScreen } from "./pages/SplashScreen";
import { AuthScreen } from "./pages/AuthScreen";
import { HomeScreen } from "./pages/HomeScreen";
import { CarteiraScreen } from "./pages/CarteiraScreen";
import { TransferenciasScreen } from "./pages/TransferenciasScreen";
import { PagamentosScreen } from "./pages/PagamentosScreen";
import { RecargasScreen } from "./pages/RecargasScreen";
import { HistoricoScreen } from "./pages/HistoricoScreen";
import { PerfilScreen } from "./pages/PerfilScreen";
import { TermsScreen } from "./pages/TermsScreen";
import { PrivacyScreen } from "./pages/PrivacyScreen";
import { NotFoundScreen } from "./pages/NotFoundScreen";
import { NotificationsSettingsScreen } from "./pages/NotificationsSettingsScreen";
import { ChangePinScreen } from "./pages/ChangePinScreen";
import { SupportScreen } from "./pages/SupportScreen";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: SplashScreen },
      { path: "auth", Component: AuthScreen },
      { path: "home", Component: () => <ProtectedRoute><HomeScreen /></ProtectedRoute> },
      { path: "carteira", Component: () => <ProtectedRoute><CarteiraScreen /></ProtectedRoute> },
      { path: "transferencias", Component: () => <ProtectedRoute><TransferenciasScreen /></ProtectedRoute> },
      { path: "pagamentos", Component: () => <ProtectedRoute><PagamentosScreen /></ProtectedRoute> },
      { path: "recargas", Component: () => <ProtectedRoute><RecargasScreen /></ProtectedRoute> },
      { path: "historico", Component: () => <ProtectedRoute><HistoricoScreen /></ProtectedRoute> },
      { path: "perfil", Component: () => <ProtectedRoute><PerfilScreen /></ProtectedRoute> },
      { path: "notificacoes", Component: () => <ProtectedRoute><NotificationsSettingsScreen /></ProtectedRoute> },
      { path: "alterar-pin", Component: () => <ProtectedRoute><ChangePinScreen /></ProtectedRoute> },
      { path: "suporte", Component: () => <ProtectedRoute><SupportScreen /></ProtectedRoute> },
      { path: "termos", Component: TermsScreen },
      { path: "privacidade", Component: PrivacyScreen },
      { path: "*", Component: NotFoundScreen },
    ],
  },
]);
