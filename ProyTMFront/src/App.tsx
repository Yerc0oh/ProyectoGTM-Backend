import AppRouter from "./router/AppRouter";
import { AuthProvider } from "./context/authcontext";

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;