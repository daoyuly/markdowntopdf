# WebAssembly 加密功能

本项目集成了 WebAssembly 加密模块，用于在客户端安全地加密用户名和密码。

## 功能特性

- **客户端加密**: 使用 Rust 编写的 WebAssembly 模块在浏览器中进行加密
- **AES-GCM 加密**: 使用 AES-256-GCM 算法进行高安全性加密
- **随机盐值和 IV**: 每次加密都使用随机生成的盐值和初始化向量
- **密码哈希**: 使用 SHA-256 生成密码哈希用于服务器验证

## 文件结构

```
web/
├── wasm-crypto/           # Rust WebAssembly 项目
│   ├── src/lib.rs        # Rust 加密实现
│   └── Cargo.toml        # Rust 项目配置
├── src/
│   ├── wasm/             # 构建的 WebAssembly 文件
│   │   ├── wasm_crypto.js
│   │   ├── wasm_crypto_bg.wasm
│   │   └── wasm_crypto.d.ts
│   ├── utils/
│   │   └── wasmCrypto.ts # TypeScript 包装器
│   └── services/
│       └── login.ts      # 修改后的登录服务
```

## 使用方法

### 1. 初始化 WebAssembly 模块

```typescript
import { initWasm } from '../utils/wasmCrypto';

// 在应用启动时初始化
await initWasm();
```

### 2. 加密登录凭据

```typescript
import { encryptCredentials } from '../utils/wasmCrypto';

const encryptedData = await encryptCredentials(username, password);
```

### 3. 生成密码哈希

```typescript
import { hashPassword } from '../utils/wasmCrypto';

const passwordHash = await hashPassword(password);
```

## 加密流程

1. **用户输入**: 用户在登录表单中输入用户名和密码
2. **客户端加密**: 使用 WebAssembly 模块加密用户名和密码
3. **生成哈希**: 为密码生成 SHA-256 哈希用于服务器验证
4. **发送请求**: 将加密数据和哈希发送到服务器
5. **服务器验证**: 服务器验证哈希并处理加密数据

## 安全特性

- **AES-256-GCM**: 使用高级加密标准进行对称加密
- **随机盐值**: 每次加密使用 32 字节随机盐值
- **随机 IV**: 每次加密使用 12 字节随机初始化向量
- **密钥派生**: 从密码和盐值派生加密密钥
- **客户端加密**: 敏感数据在发送前就在客户端加密

## 构建 WebAssembly 模块

```bash
cd web/wasm-crypto
wasm-pack build --target web
cp -r pkg/* ../src/wasm/
```

## 测试

访问 `/wasm-test` 路由可以测试 WebAssembly 加密功能。

## 注意事项

- WebAssembly 模块需要现代浏览器支持
- 首次加载可能需要一些时间来下载和初始化 WebAssembly 模块
- 确保服务器端能够处理新的请求格式（JSON 而不是 form-urlencoded）

## 错误处理

- 如果 WebAssembly 初始化失败，会抛出错误
- 加密失败时会提供详细的错误信息
- 网络错误和服务器错误会分别处理 