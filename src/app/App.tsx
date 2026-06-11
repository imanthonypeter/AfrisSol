import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AuthProvider } from "./components/AuthProvider";
import { Toaster } from "sonner";

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster 
        position="top-center" 
        richColors 
        closeButton
        toastOptions={{
          style: {
            fontFamily: "'Inter', sans-serif",
            fontSize: "14px",
          },
        }}
      />
    </AuthProvider>
  );
}
