import React, { useState, useEffect } from 'react';
import { initWasm, encryptCredentials, hashPassword } from '../utils/wasmCrypto';

const WasmDemo: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    initializeWasm();
  }, []);

  const initializeWasm = async () => {
    try {
      await initWasm();
      setIsInitialized(true);
    } catch (err) {
      setError('WebAssembly 初始化失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEncrypt = async () => {
    try {
      const testUsername = 'testuser';
      const testPassword = 'testpass123';
      
      const encrypted = await encryptCredentials(testUsername, testPassword);
      const hash = await hashPassword(testPassword);
      
      setResult({
        encrypted,
        hash,
        original: { username: testUsername, password: testPassword }
      });
    } catch (err) {
      setError('加密失败: ' + (err instanceof Error ? err.message : '未知错误'));
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="text-lg">正在初始化 WebAssembly 模块...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-600 text-lg mb-4">错误: {error}</div>
        <button 
          onClick={initializeWasm}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          重试初始化
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">WebAssembly 加密演示</h1>
      
      <div className="mb-6">
        <div className="text-green-600 text-lg mb-2">
          ✅ WebAssembly 模块已成功初始化
        </div>
        <p className="text-gray-600">
          点击下面的按钮来测试加密功能
        </p>
      </div>

      <button
        onClick={handleEncrypt}
        className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 mb-6"
      >
        测试加密功能
      </button>

      {result && (
        <div className="space-y-6">
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="text-lg font-semibold mb-2">原始数据:</h3>
            <pre className="text-sm">
              {JSON.stringify(result.original, null, 2)}
            </pre>
          </div>

          <div className="bg-blue-100 p-4 rounded">
            <h3 className="text-lg font-semibold mb-2">密码哈希 (SHA-256):</h3>
            <pre className="text-sm break-all">
              {result.hash}
            </pre>
          </div>

          <div className="bg-green-100 p-4 rounded">
            <h3 className="text-lg font-semibold mb-2">加密数据 (AES-256-GCM):</h3>
            <pre className="text-sm break-all">
              {JSON.stringify(result.encrypted, null, 2)}
            </pre>
          </div>

          <div className="bg-yellow-100 p-4 rounded">
            <h3 className="text-lg font-semibold mb-2">安全特性:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>使用 AES-256-GCM 对称加密算法</li>
              <li>每次加密都使用随机生成的盐值 (32 字节)</li>
              <li>每次加密都使用随机生成的 IV (12 字节)</li>
              <li>密钥从密码和盐值派生</li>
              <li>密码使用 SHA-256 哈希用于服务器验证</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default WasmDemo; 