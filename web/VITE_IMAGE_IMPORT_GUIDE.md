# Vite 项目中图片导入最佳实践指南

## 问题描述

在 Vite 项目中，直接使用相对路径引用图片资源（如 `src="../assets/logo.webp"`）会导致以下问题：

1. **构建后路径失效**：Vite 在构建时会重新组织文件结构
2. **TypeScript 类型错误**：无法识别图片文件的导入
3. **开发和生产环境不一致**：相对路径在不同环境下可能解析不同

## 解决方案

### 方案 1：ES 模块导入（推荐）

```tsx
// ✅ 正确方式
import logoWebp from '../assets/logo.webp'

function Component() {
  return <img src={logoWebp} alt="logo" />
}
```

**优点：**
- Vite 会自动处理构建后的路径
- TypeScript 类型安全
- 支持 HMR（热模块替换）
- 构建时会自动优化和压缩

**缺点：**
- 需要为每种图片格式创建类型声明

### 方案 2：使用 public 目录

将图片放在 `public` 目录下，然后使用绝对路径：

```tsx
// ✅ 正确方式
function Component() {
  return <img src="/logo.webp" alt="logo" />
}
```

**优点：**
- 简单直接
- 不需要类型声明
- 适合静态资源

**缺点：**
- 不会经过 Vite 的构建优化
- 不支持 HMR
- 需要手动管理文件路径

### 方案 3：动态导入

```tsx
// ✅ 动态导入方式
function Component() {
  const [logoUrl, setLogoUrl] = useState('')
  
  useEffect(() => {
    import('../assets/logo.webp').then(module => {
      setLogoUrl(module.default)
    })
  }, [])
  
  return <img src={logoUrl} alt="logo" />
}
```

## 类型声明

为了支持 TypeScript，创建 `src/types/images.d.ts` 文件：

```typescript
declare module '*.png' {
  const src: string
  export default src
}

declare module '*.jpg' {
  const src: string
  export default src
}

declare module '*.jpeg' {
  const src: string
  export default src
}

declare module '*.gif' {
  const src: string
  export default src
}

declare module '*.svg' {
  const src: string
  export default src
}

declare module '*.webp' {
  const src: string
  export default src
}

declare module '*.ico' {
  const src: string
  export default src
}
```

## 已修复的文件

1. `src/pages/RegisterPage.tsx` - 修复 logo 图片导入
2. `src/components/RegisterModal.tsx` - 修复 logo 图片导入

## 最佳实践建议

1. **优先使用 ES 模块导入**：对于组件中使用的图片
2. **使用 public 目录**：对于静态的、不需要优化的图片
3. **统一图片格式**：建议使用 WebP 格式以获得更好的压缩效果
4. **创建类型声明**：确保 TypeScript 支持
5. **使用有意义的文件名**：便于维护和理解

## 注意事项

- 确保 `tsconfig.json` 中包含了 `src/types` 目录
- 图片文件路径相对于导入的组件文件
- 构建后，Vite 会自动处理图片的哈希和路径优化
