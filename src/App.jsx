import { Toaster } from 'react-hot-toast';
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ProducaoProvider } from "./context/ProducaoContext";
import { FinanceiroProvider } from "./context/FinanceiroContext";
import { AppRoutes } from "./routes/AppRoutes";

function App(){
    return(
        <ThemeProvider>
            <AuthProvider>
                <NotificationProvider>
                    <ProducaoProvider>
                        <FinanceiroProvider>
                            <AppRoutes/>
                            <Toaster />
                        </FinanceiroProvider>
                    </ProducaoProvider>
                </NotificationProvider>
            </AuthProvider>
        </ThemeProvider>
    )
}
export default App;