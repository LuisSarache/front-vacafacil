import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="w-full flex items-center justify-between p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
      aria-label="Alternar tema"
    >
      <div className="flex items-center space-x-3">
        {isDark ? (
          <Moon className="w-5 h-5 text-blue-300" />
        ) : (
          <Sun className="w-5 h-5 text-yellow-300" />
        )}
        <span className="text-white text-sm font-medium">
          {isDark ? 'Modo Escuro' : 'Modo Claro'}
        </span>
      </div>
      <div className="relative inline-flex items-center">
        <div className={`w-10 h-5 rounded-full transition-colors ${
          isDark ? 'bg-blue-500' : 'bg-gray-400'
        }`}>
          <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
            isDark ? 'translate-x-5' : 'translate-x-0'
          }`}></div>
        </div>
      </div>
    </button>
  );
};
