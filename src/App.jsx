import { Toaster } from 'react-hot-toast';
import { AuthProvider } from "./context/AuthContext";
import { AppRoutes } from "./routes/AppRoutes";

function App(){
    return(
        <AuthProvider>
            <AppRoutes/>
            <Toaster />
        </AuthProvider>
    )
}
export default App;