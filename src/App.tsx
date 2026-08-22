import { BrowserRouter } from "react-router";
import ScrollToTop from "@/components/common/ScrollToTop";
import AppProviders from "@/providers/AppProviders";
import AppRoutes from "@/routes/AppRoutes";
import SessionGate from "@/routes/guards/SessionGate";

/** Providers, then the session, then the routes. Nothing else lives here. */
export default function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <SessionGate>
          <ScrollToTop />
          <AppRoutes />
        </SessionGate>
      </BrowserRouter>
    </AppProviders>
  );
}
