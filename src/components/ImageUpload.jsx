import { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ImageUpload({ vacaId, currentImage, onUploadSuccess }) {
  const { isDark } = useTheme();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validações
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem válida');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Imagem muito grande. Tamanho máximo: 5MB');
      return;
    }

    // Preview local
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    // Simular upload (substituir por API real quando backend estiver pronto)
    setUploading(true);
    try {
      // TODO: Substituir por chamada real à API
      // const formData = new FormData();
      // formData.append('foto', file);
      // const response = await api.post(`/vacas/${vacaId}/upload-foto`, formData);
      
      // Por enquanto, usar preview local
      setTimeout(() => {
        onUploadSuccess(reader.result);
        setUploading(false);
      }, 1000);
    } catch (error) {
      console.error('Erro ao enviar foto:', error);
      alert('Erro ao enviar foto. Tente novamente.');
      setPreview(currentImage);
      setUploading(false);
    }
  };

  const handleDelete = () => {
    if (!confirm('Deseja remover a foto?')) return;
    
    setPreview(null);
    onUploadSuccess(null);
  };

  return (
    <div className="space-y-4">
      {/* Preview */}
      {preview ? (
        <div className="relative w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden group">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <button
            onClick={handleDelete}
            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100"
            title="Remover foto"
          >
            <X size={20} />
          </button>
        </div>
      ) : (
        <div className={`w-full h-64 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border-2 border-dashed rounded-lg flex items-center justify-center`}>
          <div className="text-center text-gray-400">
            <ImageIcon size={48} className="mx-auto mb-2" />
            <p>Nenhuma foto</p>
          </div>
        </div>
      )}

      {/* Upload Button */}
      <label className="block">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />
        <div className={`cursor-pointer px-4 py-3 rounded-lg text-center font-medium transition-all ${
          uploading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-green-600 hover:bg-green-700 text-white'
        }`}>
          <Upload size={20} className="inline mr-2" />
          {uploading ? 'Enviando...' : preview ? 'Trocar Foto' : 'Adicionar Foto'}
        </div>
      </label>

      {/* Info */}
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
        Formatos aceitos: JPG, PNG, WebP • Tamanho máximo: 5MB
      </p>
    </div>
  );
}
