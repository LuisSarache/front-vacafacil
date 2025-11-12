import { Toaster } from 'react-hot-toast';
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ProducaoProvider } from "./context/ProducaoContext";
import { FinanceiroProvider } from "./context/FinanceiroContext";
import { VacasProvider } from "./context/VacasContext";
import { ReproducaoProvider } from "./context/ReproducaoContext";
import { SubscriptionProvider } from "./context/SubscriptionContext";
import { KeyboardShortcuts } from "./components/KeyboardShortcuts";
import { AppRoutes } from "./routes/AppRoutes";
import { registerServiceWorker } from "./utils/pwa";
import { useEffect } from 'react';

function App(){
    useEffect(() => {
        registerServiceWorker();
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
                                        <KeyboardShortcuts />
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