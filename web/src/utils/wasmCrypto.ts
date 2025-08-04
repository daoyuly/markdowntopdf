import init, { 
  encrypt_credentials, 
  hash_password, 
  verify_password, 
  generate_random_string 
} from '../wasm/wasm_crypto.js';

// 加密数据接口
export interface EncryptedData {
  encrypted_username: string;
  encrypted_password: string;
  salt: string;
  iv: string;
}

// WebAssembly 模块初始化状态
let wasmInitialized = false;

/**
 * 初始化 WebAssembly 模块
 */
export const initWasm = async (): Promise<void> => {
  if (!wasmInitialized) {
    try {
      await init();
      wasmInitialized = true;
      console.log('WebAssembly 加密模块初始化成功');
    } catch (error) {
      console.error('WebAssembly 初始化失败:', error);
      throw new Error('加密模块初始化失败');
    }
  }
};

/**
 * 加密登录凭据
 * @param username 用户名
 * @param password 密码
 * @returns 加密后的数据
 */
export const encryptCredentials = async (
  username: string, 
  password: string
): Promise<EncryptedData> => {
  await initWasm();
  
  try {
    const result = await encrypt_credentials(username, password);
    return result as EncryptedData;
  } catch (error) {
    console.error('加密凭据失败:', error);
    throw new Error('加密失败，请重试');
  }
};

/**
 * 生成密码哈希
 * @param password 密码
 * @returns 密码哈希
 */
export const hashPassword = async (password: string): Promise<string> => {
  await initWasm();
  
  try {
    return await hash_password(password);
  } catch (error) {
    console.error('生成密码哈希失败:', error);
    throw new Error('密码处理失败');
  }
};

/**
 * 验证密码哈希
 * @param password 密码
 * @param hash 哈希值
 * @returns 是否匹配
 */
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  await initWasm();
  
  try {
    return await verify_password(password, hash);
  } catch (error) {
    console.error('验证密码失败:', error);
    return false;
  }
};

/**
 * 生成随机字符串
 * @param length 字符串长度
 * @returns 随机字符串
 */
export const generateRandomString = async (length: number): Promise<string> => {
  await initWasm();
  
  try {
    return await generate_random_string(length);
  } catch (error) {
    console.error('生成随机字符串失败:', error);
    throw new Error('随机字符串生成失败');
  }
};

/**
 * 检查 WebAssembly 是否已初始化
 * @returns 是否已初始化
 */
export const isWasmInitialized = (): boolean => {
  return wasmInitialized;
}; 