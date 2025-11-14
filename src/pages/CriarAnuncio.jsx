import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ToastManager } from '../components/ToastManager';
import { useTranslation } from '../utils/i18n';
import { ArrowLeft, Save } from 'lucide-react';

export const CriarAnuncio = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    tipo: 'venda',
    titulo: '',
    raca: '',
    idade: '',
    producaoMedia: '',
    preco: '',
    localizacao: '',
    telefone: '',
    descricao: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      ToastManager.success('Anúncio criado com sucesso!');
      navigate('/marketplace');
    } catch {
      ToastManager.error('Erro ao criar anúncio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="secondary" onClick={() => navigate('/marketplace')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold text-dark">Criar Anúncio</h1>
      </div>

      <Card className="glassmorphism p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, tipo: 'venda' })}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                formData.tipo === 'venda' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Vender
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, tipo: 'compra' })}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                formData.tipo === 'compra' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Procurar
            </button>
          </div>

          <Input
            label="Título do Anúncio"
            value={formData.titulo}
            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
            placeholder="Ex: Vaca Holandesa - Alta Produção"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('Raça')} *</label>
              <select
                value={formData.raca}
                onChange={(e) => setFormData({ ...formData, raca: e.target.value })}
                className="w-full px-4 py-2 border border-medium/30 rounded-lg focus:ring-2 focus:ring-accent bg-white text-dark"
                required
              >
                <option value="">Selecione</option>
                <option value="Holandesa">Holandesa</option>
                <option value="Jersey">Jersey</option>
                <option value="Girolando">Girolando</option>
                <option value="Gir">Gir</option>
              </select>
            </div>
            <Input
              label="Idade (anos)"
              type="number"
              value={formData.idade}
              onChange={(e) => setFormData({ ...formData, idade: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Produção Média (L/dia)"
              type="number"
              value={formData.producaoMedia}
              onChange={(e) => setFormData({ ...formData, producaoMedia: e.target.value })}
            />
            <Input
              label="Preço (R$)"
              type="number"
              value={formData.preco}
              onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
              required
            />
          </div>

          <Input
            label="Localização"
            value={formData.localizacao}
            onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })}
            placeholder="Cidade/Estado"
            required
          />

          <Input
            label="Telefone"
            value={formData.telefone}
            onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
            placeholder="(00) 00000-0000"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('Descrição')} *</label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-medium/30 rounded-lg focus:ring-2 focus:ring-accent bg-white text-dark"
              placeholder="Descreva as características do animal..."
              required
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="secondary" onClick={() => navigate('/marketplace')}>
              Cancelar
            </Button>
            <Button type="submit" loading={loading}>
              <Save className="w-4 h-4 mr-2" />
              Publicar Anúncio
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
