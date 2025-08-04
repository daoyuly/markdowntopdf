use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};
use base64::{Engine as _, engine::general_purpose};
use sha2::{Sha256, Digest};
use aes_gcm::{Aes256Gcm, KeyInit};
use aes_gcm::aead::Aead;
use rand::Rng;

#[derive(Serialize, Deserialize)]
pub struct EncryptedData {
    pub encrypted_username: String,
    pub encrypted_password: String,
    pub salt: String,
    pub iv: String,
}

#[derive(Serialize, Deserialize)]
pub struct LoginCredentials {
    pub username: String,
    pub password: String,
}

/// 生成随机盐值
fn generate_salt() -> String {
    let mut rng = rand::thread_rng();
    let salt: [u8; 32] = rng.gen();
    general_purpose::STANDARD.encode(salt)
}

/// 生成随机 IV
fn generate_iv() -> String {
    let mut rng = rand::thread_rng();
    let iv: [u8; 12] = rng.gen();
    general_purpose::STANDARD.encode(iv)
}

/// 从密码和盐值生成密钥
fn derive_key(password: &str, salt: &str) -> Vec<u8> {
    let mut hasher = Sha256::new();
    hasher.update(password.as_bytes());
    hasher.update(salt.as_bytes());
    hasher.finalize().to_vec()
}

/// 加密数据
fn encrypt_data(data: &str, key: &[u8], iv: &str) -> Result<String, JsValue> {
    let cipher = Aes256Gcm::new_from_slice(key)
        .map_err(|e| JsValue::from_str(&format!("密钥错误: {}", e)))?;
    
    let nonce_bytes = general_purpose::STANDARD.decode(iv)
        .map_err(|e| JsValue::from_str(&format!("IV 解码错误: {}", e)))?;
    
    let encrypted = cipher.encrypt(nonce_bytes.as_slice().into(), data.as_bytes())
        .map_err(|e| JsValue::from_str(&format!("加密错误: {}", e)))?;
    
    Ok(general_purpose::STANDARD.encode(encrypted))
}

/// 加密登录凭据
#[wasm_bindgen]
pub fn encrypt_credentials(username: &str, password: &str) -> Result<JsValue, JsValue> {
    let salt = generate_salt();
    let iv = generate_iv();
    
    // 从密码和盐值派生密钥
    let key = derive_key(password, &salt);
    
    // 加密用户名和密码
    let encrypted_username = encrypt_data(username, &key, &iv)?;
    let encrypted_password = encrypt_data(password, &key, &iv)?;
    
    let encrypted_data = EncryptedData {
        encrypted_username,
        encrypted_password,
        salt,
        iv,
    };
    
    serde_wasm_bindgen::to_value(&encrypted_data)
        .map_err(|e| JsValue::from_str(&format!("序列化错误: {}", e)))
}

/// 生成密码哈希（用于服务器端验证）
#[wasm_bindgen]
pub fn hash_password(password: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(password.as_bytes());
    let result = hasher.finalize();
    general_purpose::STANDARD.encode(result)
}

/// 验证密码哈希
#[wasm_bindgen]
pub fn verify_password(password: &str, hash: &str) -> bool {
    let computed_hash = hash_password(password);
    computed_hash == hash
}

/// 生成安全的随机字符串
#[wasm_bindgen]
pub fn generate_random_string(length: usize) -> String {
    let mut rng = rand::thread_rng();
    let chars: Vec<char> = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".chars().collect();
    let random_string: String = (0..length)
        .map(|_| chars[rng.gen_range(0..chars.len())])
        .collect();
    random_string
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_encrypt_credentials() {
        let username = "testuser";
        let password = "testpass";
        
        let result = encrypt_credentials(username, password);
        assert!(result.is_ok());
    }

    #[test]
    fn test_hash_password() {
        let password = "testpass";
        let hash = hash_password(password);
        assert!(verify_password(password, &hash));
    }
}
