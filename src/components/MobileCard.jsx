import { Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from './Button';

export const MobileCard = ({ vaca, onView, onEdit, onDelete, getStatusColor, getStatusText }) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 touch-feedback">
      {/* Header com foto e nome */}
      <div className="flex items-center gap-3 mb-4">
        {vaca.foto ? (
          <img 
            src={vaca.foto} 
            alt={vaca.nome}
            className="w-16 h-16 rounded-full object-cover border-2 border-green-400"
          />
        ) : (
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
            {vaca.nome.charAt(0)}
          </div>
        )}
        <div className="flex-1">
          <h3 className="font-bold text-lg text-dark">{vaca.nome}</h3>
          <p className="text-sm text-medium/70">#{vaca.numero}</p>
        </div>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(vaca.status)}`}>
          {getStatusText(vaca.status)}
        </span>
      </div>

      {/* Informações */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-medium/70">Raça:</span>
          <span className="font-medium text-dark">{vaca.raca}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-medium/70">Nascimento:</span>
          <span className="font-medium text-dark">
            {vaca.nascimento ? new Date(vaca.nascimento).toLocaleDateString('pt-BR') : 'Não informado'}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-medium/70">Produção Média:</span>
          <span className="font-bold text-dark">{vaca.producaoMedia}L/dia</span>
        </div>
      </div>

      {/* Ações */}
      <div className="flex gap-2 pt-3 border-t border-gray-100">
        <Button 
          size="sm" 
          variant="secondary" 
          className="flex-1 flex items-center justify-center gap-2"
          onClick={() => onView(vaca.id)}
        >
          <Eye className="w-4 h-4" />
          Ver
        </Button>
        <Button 
          size="sm" 
          variant="secondary" 
          className="flex-1 flex items-center justify-center gap-2"
          onClick={() => onEdit(vaca.id)}
        >
          <Edit className="w-4 h-4" />
          Editar
        </Button>
        <Button 
          size="sm" 
          variant="secondary" 
          className="flex-1 flex items-center justify-center gap-2 text-red-600 hover:text-red-800"
          onClick={() => onDelete(vaca.id, vaca.nome)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
