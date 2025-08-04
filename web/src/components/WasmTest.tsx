import React, { useState } from 'react';
import { encryptCredentials, hashPassword, initWasm } from '../utils/wasmCrypto';

const WasmTest: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [encryptedData, setEncryptedData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTest = async () => {
    if (!username || !password) {
      setError('请输入用户名和密码');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 初始化 WebAssembly
      await initWasm();
      
      // 加密凭据
      const encrypted = await encryptCredentials(username, password);
      setEncryptedData(encrypted);
      
      // 生成密码哈希
      const hash = await hashPassword(password);
      console.log('密码哈希:', hash);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : '加密失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">WebAssembly 加密测试</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">用户名:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="输入用户名"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">密码:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="输入密码"
          />
        </div>
        
        <button
          onClick={handleTest}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? '加密中...' : '测试加密'}
        </button>
        
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {encryptedData && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">加密结果:</h3>
            <div className="bg-gray-100 p-4 rounded">
              <pre className="text-sm overflow-auto">
                {JSON.stringify(encryptedData, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WasmTest; 