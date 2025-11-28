import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useVacas } from '../context/VacasContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ToastManager } from '../components/ToastManager';
import ImageUpload from '../components/ImageUpload';
import { validateRequired } from '../utils/validation';
import { ArrowLeft, Save } from 'lucide-react';

export const EditarVaca = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getVacaById, updateVaca } = useVacas();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    numero: '',
    nome: '',
    raca: '',
    nascimento: '',
    peso: '',
    mae: '',
    pai: '',
    observacoes: ''
  });

  useEffect(() => {
    const vaca = getVacaById(id);
    if (vaca) {
      setFormData(vaca);
    } else {
      ToastManager.error('Vaca não encontrada');
      navigate('/rebanho');
    }
  }, [id, getVacaById, navigate]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateRequired(formData.nome)) {
      ToastManager.error('Nome é obrigatório');
      return;
    }

    if (!validateRequired(formData.numero)) {
      ToastManager.error('Número é obrigatório');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      updateVaca(id, formData);
      ToastManager.success('Vaca atualizada com sucesso!');
      navigate(`/rebanho/${id}`);
    } catch {
      ToastManager.error('Erro ao atualizar vaca');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="secondary" onClick={() => navigate(`/rebanho/${id}`)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold text-dark">Editar Vaca</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="glassmorphism p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número *
              </label>
              <Input
                value={formData.numero}
                onChange={(e) => handleChange('numero', e.target.value)}
                placeholder="001"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome *
              </label>
              <Input
                value={formData.nome}
                onChange={(e) => handleChange('nome', e.target.value)}
                placeholder="Nome da vaca"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Raça
              </label>
              <select
                value={formData.raca}
                onChange={(e) => handleChange('raca', e.target.value)}
                className="w-full px-4 py-2 border border-medium/30 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent bg-white text-dark"
              >
                <option value="Holandesa">Holandesa</option>
                <option value="Jersey">Jersey</option>
                <option value="Gir">Gir</option>
                <option value="Girolando">Girolando</option>
                <option value="Pardo-Suíço">Pardo-Suíço</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Nascimento
              </label>
              <Input
                type="date"
                value={formData.nascimento}
                onChange={(e) => handleChange('nascimento', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Peso (kg)
              </label>
              <Input
                type="number"
                value={formData.peso}
                onChange={(e) => handleChange('peso', e.target.value)}
                placeholder="550"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mãe
              </label>
              <Input
                value={formData.mae}
                onChange={(e) => handleChange('mae', e.target.value)}
                placeholder="Nome ou número da mãe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pai
              </label>
              <Input
                value={formData.pai}
                onChange={(e) => handleChange('pai', e.target.value)}
                placeholder="Nome do touro"
              />
            </div>
          </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações
                </label>
                <textarea
                  value={formData.observacoes}
                  onChange={(e) => handleChange('observacoes', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-medium/30 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent bg-white text-dark"
                  placeholder="Informações adicionais sobre a vaca..."
                />
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate(`/rebanho/${id}`)}
                >
                  Cancelar
                </Button>
                <Button type="submit" loading={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </Button>
              </div>
            </form>
          </Card>
        </div>

        <div>
          <Card className="glassmorphism p-6">
            <h3 className="text-lg font-semibold text-dark mb-4">Foto da Vaca</h3>
            <ImageUpload
              vacaId={id}
              currentImage={formData.foto}
              onUploadSuccess={(url) => handleChange('foto', url)}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};
