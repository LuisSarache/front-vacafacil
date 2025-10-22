import { Toaster } from 'react-hot-toast';
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ProducaoProvider } from "./context/ProducaoContext";
import { FinanceiroProvider } from "./context/FinanceiroContext";
import { VacasProvider } from "./context/VacasContext";
import { AppRoutes } from "./routes/AppRoutes";

function App(){
    return(
        <ThemeProvider>
            <AuthProvider>
                <VacasProvider>
                    <NotificationProvider>
                        <ProducaoProvider>
                            <FinanceiroProvider>
                                <AppRoutes/>
                                <Toaster />
                            </FinanceiroProvider>
                        </ProducaoProvider>
                    </NotificationProvider>
                </VacasProvider>
            </AuthProvider>
        </ThemeProvider>
    )
}
export default App;