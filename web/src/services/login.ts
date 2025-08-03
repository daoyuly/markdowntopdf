// 登录请求参数类型
export interface LoginRequest {
  username: string;
  password: string;
}

// 登录响应类型
export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

// 错误响应类型
export interface ErrorResponse {
  detail: string;
}

/**
 * 登录服务
 * @param credentials 登录凭据
 * @returns Promise<LoginResponse>
 */
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await fetch('http://localhost:8000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        username: credentials.username,
        password: credentials.password,
      }).toString(),
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.detail || '登录失败');
    }

    const data: LoginResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('网络错误，请检查网络连接');
  }
};

/**
 * 检查用户是否已登录
 * @returns boolean
 */
export const isLoggedIn = (): boolean => {
  const token = localStorage.getItem('access_token');
  return !!token;
};

/**
 * 获取存储的访问令牌
 * @returns string | null
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem('access_token');
};

/**
 * 保存登录信息到本地存储
 * @param loginResponse 登录响应数据
 */
export const saveLoginData = (loginResponse: LoginResponse): void => {
  localStorage.setItem('access_token', loginResponse.access_token);
  localStorage.setItem('user', JSON.stringify(loginResponse.user));
};

/**
 * 清除登录信息
 */
export const clearLoginData = (): void => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
};

/**
 * 获取用户信息
 * @returns 用户信息或 null
 */
export const getUser = (): LoginResponse['user'] | null => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
};
