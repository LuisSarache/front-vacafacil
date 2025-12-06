import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMarketplace } from '../context/MarketplaceContext';
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
  const { createAnuncio } = useMarketplace();
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
  const [errors, setErrors] = useState({});

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  }, [errors]);

  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const formatPrice = (value) => {
    const numbers = value.replace(/\D/g, '');
    return (Number(numbers) / 100).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.preco || Number(formData.preco) <= 0) newErrors.preco = 'Preço deve ser maior que zero';
    if (formData.telefone && formData.telefone.replace(/\D/g, '').length < 10) newErrors.telefone = 'Telefone inválido';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    try {
      await createAnuncio({
        ...formData,
        preco: Number(formData.preco),
        idade: formData.idade ? Number(formData.idade) : null,
        producaoMedia: formData.producaoMedia ? Number(formData.producaoMedia) : 0
      });
      setTimeout(() => navigate('/marketplace'), 1000);
    } catch (error) {
      // Erro já tratado no context
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="glassmorphism p-8 shadow-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">* Campos obrigatórios</p>
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Raça *</label>
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preço (R$) *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.preco}
                      onChange={(e) => handleInputChange('preco', e.target.value)}
                      placeholder="0,00"
                      className="h-12 pl-12"
                      required
                    />
                  </div>
                  {errors.preco && <p className="text-xs text-red-500 mt-1">{errors.preco}</p>}
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Idade</label>
                <Input
                  type="number"
                  value={formData.idade}
                  onChange={(e) => handleInputChange('idade', e.target.value)}
                  placeholder="3"
                  className="h-12"
                />
                <p className="text-xs text-gray-500 mt-1">Em anos completos</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Produção Média</label>
                <Input
                  type="number"
                  value={formData.producaoMedia}
                  onChange={(e) => handleInputChange('producaoMedia', e.target.value)}
                  placeholder="25"
                  className="h-12"
                />
                <p className="text-xs text-gray-500 mt-1">Litros por dia (L/dia)</p>
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Localização *</label>
                <Input
                  value={formData.localizacao}
                  onChange={(e) => handleInputChange('localizacao', e.target.value)}
                  placeholder="São Paulo/SP"
                  className="h-12"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Telefone *</label>
                <Input
                  value={formData.telefone}
                  onChange={(e) => handleInputChange('telefone', formatPhone(e.target.value))}
                  placeholder="(11) 99999-9999"
                  className="h-12"
                  maxLength="15"
                  required
                />
                {errors.telefone && <p className="text-xs text-red-500 mt-1">{errors.telefone}</p>}
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
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-800 text-dark dark:text-light shadow-sm resize-none"
                placeholder="Descreva detalhadamente..."
                required
              />
              <div className="mt-2 text-xs text-gray-500 space-y-1">
                <p className="font-medium">Inclua informações sobre:</p>
                <ul className="list-disc list-inside space-y-0.5 ml-2">
                  <li>Estado de saúde e vacinação</li>
                  <li>Histórico de produção</li>
                  <li>Tipo de alimentação e manejo</li>
                  <li>Motivo da venda</li>
                </ul>
              </div>
            </div>
          </div>

          {/* BOTÕES */}
          <div className="flex gap-6 justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button type="button" variant="secondary" onClick={() => navigate('/marketplace')} className="px-10 py-3">
              Cancelar
            </Button>
            <Button type="submit" loading={loading} className="px-10 py-3 text-base bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl">
              <Save className="w-5 h-5 mr-2" />
              Publicar Anúncio
            </Button>
          </div>
        </form>
      </Card>
    </div>

    {/* RESUMO DO ANÚNCIO */}
    <div className="lg:col-span-1">
      <Card className="glassmorphism p-6 sticky top-8">
        <h3 className="text-lg font-semibold text-dark dark:text-light mb-4">Resumo do Anúncio</h3>
        <div className="space-y-4">
          {formData.foto && (
            <img src={formData.foto} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
          )}
          <div className="space-y-2 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs">Título</p>
              <p className="font-medium text-dark dark:text-light">{formData.titulo || 'Não informado'}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs">Preço</p>
              <p className="font-bold text-green-600 dark:text-green-400 text-lg">
                {formData.preco ? `R$ ${Number(formData.preco).toLocaleString('pt-BR', {minimumFractionDigits: 2})}` : 'R$ 0,00'}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs">Localização</p>
              <p className="font-medium text-dark dark:text-light">{formData.localizacao || 'Não informado'}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs">Raça</p>
              <p className="font-medium text-dark dark:text-light">{formData.raca || 'Não selecionada'}</p>
            </div>
            {formData.idade && (
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-xs">Idade</p>
                <p className="font-medium text-dark dark:text-light">{formData.idade} anos</p>
              </div>
            )}
            {formData.producaoMedia && (
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-xs">Produção</p>
                <p className="font-medium text-dark dark:text-light">{formData.producaoMedia} L/dia</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  </div>
    </div>
  );
};
