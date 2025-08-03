// 注册请求参数类型
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

// 注册响应类型
export interface RegisterResponse {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

// 错误响应类型
export interface ErrorResponse {
  detail: string;
}

/**
 * 注册服务
 * @param userData 注册用户数据
 * @returns Promise<RegisterResponse>
 */
export const register = async (userData: RegisterRequest): Promise<RegisterResponse> => {
  try {
    const response = await fetch('http://localhost:8000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.detail || '注册失败');
    }

    const data: RegisterResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('网络错误，请检查网络连接');
  }
};

/**
 * 验证用户名是否可用
 * @param username 用户名
 * @returns Promise<boolean>
 */
export const validateUsername = async (username: string): Promise<boolean> => {
  try {
    const response = await fetch(`http://localhost:8000/api/auth/validate-username?username=${encodeURIComponent(username)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.available || false;
  } catch (error) {
    console.error('验证用户名时出错:', error);
    return false;
  }
};

/**
 * 验证邮箱是否可用
 * @param email 邮箱地址
 * @returns Promise<boolean>
 */
export const validateEmail = async (email: string): Promise<boolean> => {
  try {
    const response = await fetch(`http://localhost:8000/api/auth/validate-email?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.available || false;
  } catch (error) {
    console.error('验证邮箱时出错:', error);
    return false;
  }
};

/**
 * 验证密码强度
 * @param password 密码
 * @returns boolean
 */
export const validatePassword = (password: string): boolean => {
  // 密码至少8位，包含字母和数字
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * 验证邮箱格式
 * @param email 邮箱地址
 * @returns boolean
 */
export const validateEmailFormat = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 验证用户名格式
 * @param username 用户名
 * @returns boolean
 */
export const validateUsernameFormat = (username: string): boolean => {
  // 用户名3-20位，只能包含字母、数字、下划线
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};
