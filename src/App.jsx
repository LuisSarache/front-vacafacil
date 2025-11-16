import { Toaster } from 'react-hot-toast';
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ProducaoProvider } from "./context/ProducaoContext";
import { FinanceiroProvider } from "./context/FinanceiroContext";
import { VacasProvider } from "./context/VacasContext";
import { ReproducaoProvider } from "./context/ReproducaoContext";
import { SubscriptionProvider } from "./context/SubscriptionContext";
<<<<<<< Updated upstream
=======
import { KeyboardShortcuts } from "./components/KeyboardShortcuts";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ApiStatus } from "./components/ApiStatus";
>>>>>>> Stashed changes
import { AppRoutes } from "./routes/AppRoutes";
import { registerServiceWorker } from "./utils/pwa";
import { useEffect } from 'react';

function App(){
    useEffect(() => {
        // Temporariamente desabilitado para debug do backend
        // registerServiceWorker();
        
        // Desregistrar Service Worker existente
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(registrations => {
                registrations.forEach(registration => {
                    registration.unregister();
                    console.log('Service Worker desregistrado');
                });
            });
        }
    }, []);

    return(
        <ThemeProvider>
            <AuthProvider>
                <SubscriptionProvider>
                    <VacasProvider>
                        <ReproducaoProvider>
                            <NotificationProvider>
                                <ProducaoProvider>
                                    <FinanceiroProvider>
<<<<<<< Updated upstream
=======
                                        <ErrorBoundary>
                                            <KeyboardShortcuts />
                                        </ErrorBoundary>
                                        <ApiStatus />
>>>>>>> Stashed changes
                                        <AppRoutes/>
                                        <Toaster />
                                    </FinanceiroProvider>
                                </ProducaoProvider>
                            </NotificationProvider>
                        </ReproducaoProvider>
                    </VacasProvider>
                </SubscriptionProvider>
            </AuthProvider>
        </ThemeProvider>
    )
}
export default App;