import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { SplashScreen } from "./pages/SplashScreen";
import { LoginScreen } from "./pages/LoginScreen";
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

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: SplashScreen },
      { path: "login", Component: LoginScreen },
      { path: "home", Component: HomeScreen },
      { path: "carteira", Component: CarteiraScreen },
      { path: "transferencias", Component: TransferenciasScreen },
      { path: "pagamentos", Component: PagamentosScreen },
      { path: "recargas", Component: RecargasScreen },
      { path: "historico", Component: HistoricoScreen },
      { path: "perfil", Component: PerfilScreen },
      { path: "termos", Component: TermsScreen },
      { path: "privacidade", Component: PrivacyScreen },
      { path: "*", Component: NotFoundScreen },
    ],
  },
]);
