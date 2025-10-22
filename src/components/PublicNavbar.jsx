import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Heart } from "lucide-react";

export const PublicNavbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const navLink = [
        {to: '/', label: 'Home'},
        {to: '/about', label: 'Sobre'},
        {to: '/contact', label: 'Contato'},
        {to: '/login', label: 'Login'}

      


    ];

    const isActive = (path) => location.pathname === path;

return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 ">
        <div className="max-w-7xl mx-auto px-4 py-3 md:px-6 md:py-4">
            <div className="flex items-center justify-between">
                {/* logotipo */}
                <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="relative">
                        <img
                            src="/logo.png"
                            alt="logotipo site vacafacil"
                            className="w-10 h-10 md:w-12 md:h-12 rounded-lg shadow-md"/>
                        
                    </div>
                    <div>
                        <span className="text-xl font-bold text-dark md:text-2xl">
                            VacaFácil
                        </span>
                        <p className="text-xs text-medium font-medium hidden sm:block">
                        Modernize sua fazenda
                        </p>
                    </div>
                </div>
                {/*Links desktop*/}
                <div className="flex items-center space-x-6 md:space-x-8">
                    {navLink.slice(0, -1).map(link => (
                        <Link
                          key={link.to}
                          to={link.to}
                          className={`hidden sm:block font-medium transition-colors text-sm md:text-base ${
                            isActive(link.to)
                              ? 'text-dark border-b-2 border-dark pb-1'
                              : 'text-medium hover:text-dark'
                          }`}>
                            {link.label}
                        </Link>
                    ))}
                    <Link to="/login">
                        <button className="bg-dark text-white px-4 py-2 md:px-6 md:py-2.5 rounded-lg font-medium hover:bg-medium transition-all duration-300 text-sm md:text-base shadow-md hover:shadow-lg">
                            <span className="hidden sm:inline">
                                Entrar
                            </span>
                            <span className="sm:hidden">
                                Login
                            </span>   
                        </button>
                    </Link>
                </div>
                {/*Menu mobile*/}
                <div className="md:hidden flex items-center ml-2">
                    <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-white/70 hover:text-white"
                    aria-label="Menu"
                    >
                        {isOpen ? <X size={24}/> : <Menu size={24}/> }
                    </button>
                </div>
            </div>
        {/*Menu mobile aberto isopen = true */}
        {isOpen && (
            <div className="md:hidden mt-4">
                <div className="px-2 pt-2 pb-2 space-y-1 bg-white/95 backdrop-blur-md rounded-lg border border-gray-200 shadow-lg">
                    {navLink.map(link =>(
                        <Link
                        key={link.to}
                        to={link.to}
                        className= {`block px-3 py-2 rounded-lg transition-colors ${
                            isActive(link.to)
                            ? 'text-dark bg-dark/10 font-medium'
                            : 'text-medium hover:text-dark hover:bg-gray-50'
                        }`}
                        onClick={() => setIsOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
        )}
        </div>
    </nav>
)}
