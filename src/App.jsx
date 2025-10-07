import { Toaster } from 'react-hot-toast';
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AppRoutes } from "./routes/AppRoutes";

function App(){
    return(
        <ThemeProvider>
            <AuthProvider>
                <AppRoutes/>
                <Toaster />
            </AuthProvider>
        </ThemeProvider>
    )
}
export default App;