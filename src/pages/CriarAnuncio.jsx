import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ToastManager } from '../components/ToastManager';
import ImageUpload from '../components/ImageUpload';
import { useTranslation } from '../utils/i18n';
import { ArrowLeft, Save, Camera, MapPin, Phone, DollarSign, Milk, Calendar } from 'lucide-react';

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
    descricao: '',
    foto: null
  });

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      ToastManager.success('✅ Anúncio publicado com sucesso! Redirecionando para o marketplace...');
      setTimeout(() => navigate('/marketplace'), 1000);
    } catch {
      ToastManager.error('❌ Não foi possível publicar o anúncio. Verifique os dados e tente novamente.');
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
        <div>
          <h1 className="text-3xl font-bold text-dark dark:text-light">Criar Anúncio</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Preencha os dados abaixo para anunciar sua vaca no marketplace</p>
        </div>
      </div>

      <Card className="glassmorphism p-8 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* FOTO - DESTAQUE NO TOPO */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-8 border-2 border-dashed border-green-300 dark:border-green-700">
            <div className="flex items-center gap-3 mb-4">
              <Camera className="w-6 h-6 text-green-600 dark:text-green-400" />
              <h3 className="text-xl font-semibold text-dark dark:text-light">Foto do Animal</h3>
            </div>
            <ImageUpload
              currentImage={formData.foto}
              onUploadSuccess={(url) => handleInputChange('foto', url)}
            />
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />

          {/* TIPO DE ANÚNCIO */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleInputChange('tipo', 'venda')}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg ${
                formData.tipo === 'venda' ? 'bg-green-600 text-white scale-105' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Vender
            </button>
            <button
              type="button"
              onClick={() => handleInputChange('tipo', 'compra')}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg ${
                formData.tipo === 'compra' ? 'bg-blue-600 text-white scale-105' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Procurar
            </button>
          </div>

          {/* GRUPO 1: INFORMAÇÕES BÁSICAS */}
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-dark dark:text-light flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 font-bold">1</div>
              Informações Básicas
            </h3>
            <div className="pl-10 space-y-4">
              <Input
                label="Título do Anúncio"
                value={formData.titulo}
                onChange={(e) => handleInputChange('titulo', e.target.value)}
                placeholder="Ex: Vaca Holandesa - Alta Produção"
                className="h-12"
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">🐄 Raça *</label>
                  <select
                    value={formData.raca}
                    onChange={(e) => handleInputChange('raca', e.target.value)}
                    className="w-full h-12 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-800 text-dark dark:text-light shadow-sm"
                    required
                  >
                    <option value="">Selecione a raça</option>
                    <option value="Holandesa">Holandesa</option>
                    <option value="Jersey">Jersey</option>
                    <option value="Girolando">Girolando</option>
                    <option value="Gir">Gir</option>
                  </select>
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" /> Preço *
                  </label>
                  <Input
                    type="number"
                    value={formData.preco}
                    onChange={(e) => handleInputChange('preco', e.target.value)}
                    placeholder="0.00"
                    className="h-12"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* GRUPO 2: CARACTERÍSTICAS DO ANIMAL */}
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-dark dark:text-light flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 font-bold">2</div>
              Características do Animal
            </h3>
            <div className="pl-10 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Idade (anos)
                </label>
                <Input
                  type="number"
                  value={formData.idade}
                  onChange={(e) => handleInputChange('idade', e.target.value)}
                  placeholder="Ex: 3"
                  className="h-12"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <Milk className="w-4 h-4" /> Produção Média (L/dia)
                </label>
                <Input
                  type="number"
                  value={formData.producaoMedia}
                  onChange={(e) => handleInputChange('producaoMedia', e.target.value)}
                  placeholder="Ex: 25"
                  className="h-12"
                />
              </div>
            </div>
          </div>

          {/* GRUPO 3: CONTATO */}
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-dark dark:text-light flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 font-bold">3</div>
              Informações de Contato
            </h3>
            <div className="pl-10 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Localização *
                </label>
                <Input
                  value={formData.localizacao}
                  onChange={(e) => handleInputChange('localizacao', e.target.value)}
                  placeholder="Cidade/Estado"
                  className="h-12"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Telefone *
                </label>
                <Input
                  value={formData.telefone}
                  onChange={(e) => handleInputChange('telefone', e.target.value)}
                  placeholder="(00) 00000-0000"
                  className="h-12"
                  required
                />
              </div>
            </div>
          </div>

          {/* GRUPO 4: DESCRIÇÃO */}
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-dark dark:text-light flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 font-bold">4</div>
              Descrição Detalhada
            </h3>
            <div className="pl-10">
              <textarea
                value={formData.descricao}
                onChange={(e) => handleInputChange('descricao', e.target.value)}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-800 text-dark dark:text-light shadow-sm resize-none"
                placeholder="Descreva o estado do animal, histórico, alimentação, motivos da venda, vacinação, etc..."
                required
              />
            </div>
          </div>

          {/* BOTÕES */}
          <div className="flex gap-4 justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button type="button" variant="secondary" onClick={() => navigate('/marketplace')} className="px-8">
              Cancelar
            </Button>
            <Button type="submit" loading={loading} className="px-8 py-3 text-lg shadow-lg hover:shadow-xl">
              <Save className="w-5 h-5 mr-2" />
              Publicar Anúncio
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
