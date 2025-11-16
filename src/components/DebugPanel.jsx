import { useState } from 'react';
import { apiService } from '../services/api';
import { Button } from './Button';
import { Card } from './Card';

export const DebugPanel = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    const results = {};

    // 1. Verificar porta do frontend
    results.frontendPort = window.location.port || '5173';
    
    // 2. Verificar URL da API
    results.apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    // 3. Testar conexão com backend
    try {
      const response = await fetch(`${results.apiUrl}/health`, {
        method: 'GET',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Origin': window.location.origin
        },
        credentials: 'same-origin'
      });
      results.backendConnection = {
        status: response.status,
        ok: response.ok,
        message: response.ok ? 'Conectado' : 'Erro de conexão'
      };
    } catch (error) {
      results.backendConnection = {
        status: 'ERROR',
        ok: false,
        message: error.message
      };
    }

    // 4. Testar login (formato de dados)
    try {
      // Security: Generate CSRF token
      const csrfToken = btoa(Math.random().toString(36) + Date.now().toString(36));
      
      const formData = new FormData();
      formData.append('username', 'test@test.com');
      formData.append('password', 'test123');
      
      const response = await fetch(`${results.apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'X-CSRF-Token': csrfToken,
          'X-Requested-With': 'XMLHttpRequest',
          'Origin': window.location.origin
        },
        credentials: 'same-origin',
        body: formData
      });
      
      results.loginTest = {
        status: response.status,
        ok: response.ok,
        message: response.ok ? 'Login OK' : `Erro ${response.status}`
      };
    } catch (error) {
      results.loginTest = {
        status: 'ERROR',
        ok: false,
        message: error.message
      };
    }

    // 5. Verificar token no localStorage
    results.token = localStorage.getItem('token') ? 'Presente' : 'Ausente';

    setTestResults(results);
    setLoading(false);
  };

  return (
    <Card className="p-6 m-4 max-w-2xl">
      <h2 className="text-xl font-bold mb-4">🔍 Debug Panel - Checklist Frontend</h2>
      
      <Button onClick={runTests} loading={loading} className="mb-4">
        {loading ? 'Testando...' : 'Executar Testes'}
      </Button>

      {Object.keys(testResults).length > 0 && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            
            {/* 1. Porta do Frontend */}
            <div className="p-3 bg-gray-50 rounded">
              <h3 className="font-semibold">📡 Porta Frontend</h3>
              <p className={testResults.frontendPort === '5173' ? 'text-green-600' : 'text-orange-600'}>
                {testResults.frontendPort}
                {testResults.frontendPort === '5173' ? ' ✅' : ' ⚠️ (Esperado: 5173)'}
              </p>
            </div>

            {/* 2. URL da API */}
            <div className="p-3 bg-gray-50 rounded">
              <h3 className="font-semibold">🔗 URL da API</h3>
              <p className={testResults.apiUrl === 'http://localhost:5000' ? 'text-green-600' : 'text-red-600'}>
                {testResults.apiUrl}
                {testResults.apiUrl === 'http://localhost:5000' ? ' ✅' : ' ❌'}
              </p>
            </div>

            {/* 3. Conexão Backend */}
            <div className="p-3 bg-gray-50 rounded">
              <h3 className="font-semibold">🖥️ Backend Status</h3>
              <p className={testResults.backendConnection?.ok ? 'text-green-600' : 'text-red-600'}>
                {testResults.backendConnection?.message}
                {testResults.backendConnection?.ok ? ' ✅' : ' ❌'}
              </p>
              <small>Status: {testResults.backendConnection?.status}</small>
            </div>

            {/* 4. Teste de Login */}
            <div className="p-3 bg-gray-50 rounded">
              <h3 className="font-semibold">🔐 Login Test</h3>
              <p className={testResults.loginTest?.ok ? 'text-green-600' : 'text-red-600'}>
                {testResults.loginTest?.message}
                {testResults.loginTest?.ok ? ' ✅' : ' ❌'}
              </p>
              <small>Status: {testResults.loginTest?.status}</small>
            </div>

            {/* 5. Token */}
            <div className="p-3 bg-gray-50 rounded">
              <h3 className="font-semibold">🎫 Token JWT</h3>
              <p className={testResults.token === 'Presente' ? 'text-green-600' : 'text-gray-600'}>
                {testResults.token}
                {testResults.token === 'Presente' ? ' ✅' : ' ℹ️'}
              </p>
            </div>

            {/* 6. Console Errors */}
            <div className="p-3 bg-gray-50 rounded">
              <h3 className="font-semibold">🐛 Console</h3>
              <p className="text-blue-600">
                Abra F12 para verificar ℹ️
              </p>
              <small>Network tab também</small>
            </div>

          </div>

          {/* Instruções */}
          <div className="mt-4 p-4 bg-blue-50 rounded">
            <h3 className="font-semibold text-blue-800">📋 Checklist Manual:</h3>
            <ul className="text-sm text-blue-700 mt-2 space-y-1">
              <li>• Abra F12 → Console para ver erros JavaScript</li>
              <li>• Vá na aba Network para ver requisições HTTP</li>
              <li>• Verifique se o backend está rodando em localhost:5000</li>
              <li>• Teste fazer login para ver se os dados são enviados corretamente</li>
            </ul>
          </div>

          {/* Comandos úteis */}
          <div className="mt-4 p-4 bg-gray-50 rounded">
            <h3 className="font-semibold">🛠️ Comandos Úteis:</h3>
            <div className="text-sm font-mono mt-2 space-y-1">
              <div>Frontend: <code className="bg-gray-200 px-2 py-1 rounded">npm run dev</code></div>
              <div>Backend: <code className="bg-gray-200 px-2 py-1 rounded">uvicorn app.main:app --reload --port 5000</code></div>
              <div>Teste API: <code className="bg-gray-200 px-2 py-1 rounded">curl http://localhost:5000/health</code></div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};