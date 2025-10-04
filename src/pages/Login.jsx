import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { mockApi } from "../services/mockApi";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react"; // 👁 ícones

export const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false); // controle do olho
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { user, token } = await mockApi.login(
        formData.email,
        formData.password
      );
      login(user, token);
      toast.success("✅ Login realizado com sucesso!");
      navigate("/dashboard");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        (error.message.includes("401")
          ? "❌ E-mail ou senha incorretos."
          : error.message) ||
        "Ocorreu um erro inesperado. Tente novamente.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md" variant="amber">
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white/70 mb-2">Entrar</h1>
          <p className="text-white/70">Acesse sua gestão no VacaFacil</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="E-mail"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="seu@email.com"
            required
          />

          {/* Campo de senha com olho */}
          <div className="relative">
            <Input
              label="Senha"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Sua senha"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-9 text-white/70 hover:text-white transition"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <Button type="submit" loading={loading} className="w-full">
            Entrar
          </Button>
        </form>

        {/* Link de cadastro */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-white/70">Não possui conta?</p>
          <Link
            to="/register"
            className="text-white/70 font-bold hover:text-accent"
          >
            Criar Conta
          </Link>
        </div>
      </Card>
    </div>
  );
};
