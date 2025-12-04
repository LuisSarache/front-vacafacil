import { Toaster } from 'react-hot-toast';
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ProducaoProvider } from "./context/ProducaoContext";
import { FinanceiroProvider } from "./context/FinanceiroContext";
import { VacasProvider } from "./context/VacasContext";
import { ReproducaoProvider } from "./context/ReproducaoContext";
import { SubscriptionProvider } from "./context/SubscriptionContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ApiStatus } from "./components/ApiStatus";
import { AppRoutes } from "./routes/AppRoutes";
import { registerServiceWorker } from "./utils/pwa";
import { useEffect } from 'react';

function App(){
    useEffect(() => {
        registerServiceWorker();
    }, []);

    return(
        <AuthProvider>
            <SubscriptionProvider>
                <VacasProvider>
                    <ReproducaoProvider>
                        <NotificationProvider>
                            <ProducaoProvider>
                                <FinanceiroProvider>
                                    <ErrorBoundary>
                                        <AppRoutes/>
                                    </ErrorBoundary>
                                    <ApiStatus />
                                    <Toaster />
                                </FinanceiroProvider>
                            </ProducaoProvider>
                        </NotificationProvider>
                    </ReproducaoProvider>
                </VacasProvider>
            </SubscriptionProvider>
        </AuthProvider>
    )
}
export default App;