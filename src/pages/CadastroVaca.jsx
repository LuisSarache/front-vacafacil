import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVacas } from '../context/VacasContext';
import { useSubscription } from '../context/SubscriptionContext';
import { Card } from '../components/Card';
import { LimitWarning } from '../components/LimitWarning';
import { Button } from '../components/Button';
import { FormField } from '../components/FormField';
import { ToastManager } from '../components/ToastManager';
import ImageUpload from '../components/ImageUpload';
import { ArrowLeft, Save } from 'lucide-react';

export const CadastroVaca = () => {
  const navigate = useNavigate();
  const { addVaca, vacas } = useVacas();
  const { checkLimit } = useSubscription();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    numero: '',
    nome: '',
    raca: '',
    nascimento: '',
    peso: '',
    pai: '',
    mae: '',
    status: 'lactacao',
    observacoes: '',
    foto: null
  });

  const [errors, setErrors] = useState({});

  const racas = [
    'Holandesa',
    'Jersey',
    'Gir',
    'Girolando',
    'Pardo Suíço',
    'Guzerá',
    'Nelore',
    'Brahman'
  ];

  const statusOptions = [
    { value: 'lactacao', label: 'Lactação' },
    { value: 'seca', label: 'Seca' },
    { value: 'prenha', label: 'Prenha' },
    { value: 'novilha', label: 'Novilha' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.numero.trim()) {
      newErrors.numero = 'Número é obrigatório';
    }
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }
    if (!formData.raca) {
      newErrors.raca = 'Raça é obrigatória';
    }
    if (!formData.nascimento) {
      newErrors.nascimento = 'Data de nascimento é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      ToastManager.error('Por favor, corrija os erros no formulário');
      return;
    }
    
    // Verificar limite de vacas
    if (!checkLimit('vacas', vacas.length)) {
      ToastManager.error('Limite de vacas atingido para seu plano atual');
      return;
    }

    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      addVaca({ ...formData, producaoMedia: 0 });
      ToastManager.success('Vaca cadastrada com sucesso!');
      navigate('/rebanho');
    } catch (error) {
      console.error('Erro ao cadastrar vaca:', error);
      ToastManager.error(`Erro ao cadastrar vaca: ${error.message || 'Tente novamente.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <LimitWarning 
        feature="vacas" 
        currentUsage={vacas.length} 
        action="cadastrar mais vacas"
      />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => navigate('/rebanho')}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-dark">Cadastrar Nova Vaca</h1>
            <p className="text-medium/70 mt-1">Preencha as informações da nova vaca do rebanho</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informações Básicas */}
          <div className="lg:col-span-2">
            <Card className="glassmorphism p-6">
              <h3 className="text-lg font-semibold text-dark mb-6">Informações Básicas</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Número de Identificação"
                  value={formData.numero}
                  onChange={(e) => handleInputChange('numero', e.target.value)}
                  placeholder="Ex: 001, 123, A001"
                  required
                  error={errors.numero}
                />

                <FormField
                  label="Nome da Vaca"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  placeholder="Ex: Mimosa, Estrela, Bonita"
                  required
                  error={errors.nome}
                />

                <FormField
                  label="Raça"
                  as="select"
                  value={formData.raca}
                  onChange={(e) => handleInputChange('raca', e.target.value)}
                  placeholder="Selecione a raça"
                  options={racas}
                  required
                  error={errors.raca}
                />

                <FormField
                  label="Data de Nascimento"
                  type="date"
                  value={formData.nascimento}
                  onChange={(e) => handleInputChange('nascimento', e.target.value)}
                  required
                  error={errors.nascimento}
                />

                <FormField
                  label="Peso Atual (kg)"
                  type="number"
                  value={formData.peso}
                  onChange={(e) => handleInputChange('peso', e.target.value)}
                  placeholder="Ex: 450"
                  min="0"
                  step="0.1"
                />

                <FormField
                  label="Status Atual"
                  as="select"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  options={statusOptions}
                  required
                />
              </div>
            </Card>

            {/* Genealogia */}
            <Card className="glassmorphism p-6 mt-6">
              <h3 className="text-lg font-semibold text-dark mb-6">Genealogia</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Pai (Touro)"
                  value={formData.pai}
                  onChange={(e) => handleInputChange('pai', e.target.value)}
                  placeholder="Nome ou número do pai"
                />

                <FormField
                  label="Mãe"
                  value={formData.mae}
                  onChange={(e) => handleInputChange('mae', e.target.value)}
                  placeholder="Nome ou número da mãe"
                />
              </div>
            </Card>

            {/* Observações */}
            <Card className="glassmorphism p-6 mt-6">
              <h3 className="text-lg font-semibold text-dark mb-6">Observações Adicionais</h3>
              
              <FormField
                label="Observações"
                as="textarea"
                value={formData.observacoes}
                onChange={(e) => handleInputChange('observacoes', e.target.value)}
                placeholder="Informações adicionais sobre a vaca..."
                rows={4}
              />
            </Card>
          </div>

          {/* Foto e Ações */}
          <div className="space-y-6">
            <Card className="glassmorphism p-6">
              <h3 className="text-lg font-semibold text-dark mb-4">Foto da Vaca</h3>
              
              <ImageUpload
                currentImage={formData.foto}
                onUploadSuccess={(url) => handleInputChange('foto', url)}
              />
            </Card>

            <Card className="glassmorphism p-6">
              <h3 className="text-lg font-semibold text-dark mb-4">Resumo</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-medium/70">Número:</span>
                  <span className="font-medium text-dark">{formData.numero || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-medium/70">Nome:</span>
                  <span className="font-medium text-dark">{formData.nome || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-medium/70">Raça:</span>
                  <span className="font-medium text-dark">{formData.raca || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-medium/70">Status:</span>
                  <span className="font-medium text-dark">
                    {statusOptions.find(s => s.value === formData.status)?.label || '-'}
                  </span>
                </div>
              </div>
            </Card>

            {/* Botões de Ação */}
            <div className="space-y-3">
              <Button 
                type="submit" 
                className="w-full" 
                loading={loading}
                disabled={loading}
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Salvando...' : 'Salvar Vaca'}
              </Button>
              
              <Button 
                type="button" 
                variant="secondary" 
                className="w-full"
                onClick={() => navigate('/rebanho')}
                disabled={loading}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};