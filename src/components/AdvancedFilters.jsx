import { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Input } from './Input';
import { FormField } from './FormField';
import { Filter, X, Save, RotateCcw } from 'lucide-react';

export const AdvancedFilters = ({ isOpen, onClose, onApply, filters = {} }) => {
  const [activeFilters, setActiveFilters] = useState(filters);
  const [savedFilters, setSavedFilters] = useState([]);

  const handleFilterChange = (key, value) => {
    setActiveFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onApply(activeFilters);
    onClose();
  };

  const handleReset = () => {
    setActiveFilters({});
  };

  const handleSave = () => {
    const name = prompt('Nome do filtro:');
    if (name) {
      setSavedFilters(prev => [...prev, { name, filters: activeFilters }]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filtros Avançados
            </h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* Filtros de Data */}
            <div>
              <h4 className="font-medium mb-3">Período</h4>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Data Inicial"
                  type="date"
                  value={activeFilters.dataInicial || ''}
                  onChange={(e) => handleFilterChange('dataInicial', e.target.value)}
                />
                <Input
                  label="Data Final"
                  type="date"
                  value={activeFilters.dataFinal || ''}
                  onChange={(e) => handleFilterChange('dataFinal', e.target.value)}
                />
              </div>
            </div>

            {/* Filtros de Vaca */}
            <div>
              <h4 className="font-medium mb-3">Rebanho</h4>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Raça"
                  as="select"
                  value={activeFilters.raca || ''}
                  onChange={(e) => handleFilterChange('raca', e.target.value)}
                  options={['Todas', 'Holandesa', 'Jersey', 'Gir', 'Girolando']}
                />
                <FormField
                  label="Status"
                  as="select"
                  value={activeFilters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  options={['Todos', 'Lactação', 'Seca', 'Prenha', 'Novilha']}
                />
              </div>
            </div>

            {/* Filtros de Produção */}
            <div>
              <h4 className="font-medium mb-3">Produção</h4>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Produção Mínima (L)"
                  type="number"
                  value={activeFilters.producaoMin || ''}
                  onChange={(e) => handleFilterChange('producaoMin', e.target.value)}
                />
                <Input
                  label="Produção Máxima (L)"
                  type="number"
                  value={activeFilters.producaoMax || ''}
                  onChange={(e) => handleFilterChange('producaoMax', e.target.value)}
                />
              </div>
            </div>

            {/* Filtros Financeiros */}
            <div>
              <h4 className="font-medium mb-3">Financeiro</h4>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Valor Mínimo (R$)"
                  type="number"
                  value={activeFilters.valorMin || ''}
                  onChange={(e) => handleFilterChange('valorMin', e.target.value)}
                />
                <Input
                  label="Valor Máximo (R$)"
                  type="number"
                  value={activeFilters.valorMax || ''}
                  onChange={(e) => handleFilterChange('valorMax', e.target.value)}
                />
              </div>
            </div>

            {/* Filtros Salvos */}
            {savedFilters.length > 0 && (
              <div>
                <h4 className="font-medium mb-3">Filtros Salvos</h4>
                <div className="space-y-2">
                  {savedFilters.map((saved, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{saved.name}</span>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setActiveFilters(saved.filters)}
                      >
                        Aplicar
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <div className="flex space-x-2">
              <Button variant="secondary" onClick={handleReset}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Limpar
              </Button>
              <Button variant="secondary" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button variant="secondary" onClick={onClose}>
                Cancelar
              </Button>
              <Button onClick={handleApply}>
                Aplicar Filtros
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};