# 国际化 (i18n) 系统

本项目使用 `react-i18next` 实现国际化功能，支持多语言切换。

## 功能特性

- 🌍 支持多语言（英文、中文）
- 🔄 自动语言检测
- 💾 本地存储语言偏好
- 🎯 类型安全的翻译键
- 🚀 高性能语言切换
- 📱 响应式语言切换器

## 支持的语言

- 🇺🇸 English (en)
- 🇨🇳 中文 (zh)

## 快速开始

### 1. 在组件中使用翻译

```tsx
import { useTranslation } from 'react-i18next'

const MyComponent = () => {
  const { t } = useTranslation()
  
  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <p>{t('auth.login')}</p>
    </div>
  )
}
```

### 2. 使用自定义 Hook

```tsx
import { useI18n } from '../i18n/hooks'

const MyComponent = () => {
  const { t, currentLanguage, switchLanguage } = useI18n()
  
  const handleLanguageChange = () => {
    switchLanguage('zh')
  }
  
  return (
    <div>
      <p>当前语言: {currentLanguage}</p>
      <button onClick={handleLanguageChange}>
        切换到中文
      </button>
    </div>
  )
}
```

### 3. 语言切换器组件

```tsx
import LanguageSwitcher from '../components/LanguageSwitcher'

const Header = () => {
  return (
    <header>
      <h1>我的应用</h1>
      <LanguageSwitcher />
    </header>
  )
}
```

## 翻译键结构

### 通用 (common)
- `loading` - 加载中
- `error` - 错误
- `success` - 成功
- `cancel` - 取消
- `confirm` - 确认

### 认证 (auth)
- `login` - 登录
- `register` - 注册
- `logout` - 退出登录
- `email` - 邮箱
- `password` - 密码

### 编辑器 (editor)
- `markdownEditor` - Markdown 编辑器
- `preview` - 预览
- `export` - 导出
- `save` - 保存

### 导航 (navigation)
- `home` - 首页
- `dashboard` - 仪表板
- `documents` - 文档
- `settings` - 设置

### 验证 (validation)
- `required` - 必填项
- `minLength` - 最小长度
- `maxLength` - 最大长度
- `email` - 邮箱格式

### 消息 (messages)
- `welcome` - 欢迎信息
- `documentSaved` - 文档已保存
- `fileUploaded` - 文件上传成功

## 添加新语言

### 1. 创建语言包文件

在 `src/i18n/locales/` 目录下创建新的语言文件，例如 `ja.json`：

```json
{
  "common": {
    "loading": "読み込み中...",
    "error": "エラー",
    "success": "成功"
  }
}
```

### 2. 更新配置

在 `src/i18n/config.ts` 中添加新语言：

```ts
export const i18nConfig = {
  supportedLanguages: ['en', 'zh', 'ja'],
  // ... 其他配置
}
```

### 3. 更新类型定义

在 `src/i18n/types.ts` 中添加新语言：

```ts
export type LanguageCode = 'en' | 'zh' | 'ja'
```

## 高级用法

### 插值

```tsx
// 翻译文件
{
  "validation.minLength": "至少需要 {{min}} 个字符"
}

// 使用
t('validation.minLength', { min: 6 })
```

### 复数形式

```tsx
// 翻译文件
{
  "items": "{{count}} 个项目",
  "items_0": "没有项目",
  "items_one": "1 个项目",
  "items_other": "{{count}} 个项目"
}

// 使用
t('items', { count: 5 })
```

### 命名空间

```tsx
// 使用不同的命名空间
const { t } = useTranslation('admin')

// 或者
t('admin:users.title')
```

## 工具函数

### 格式化日期

```tsx
import { formatDate } from '../i18n/utils'

const date = new Date()
const formattedDate = formatDate(date) // 根据当前语言格式化
```

### 格式化数字

```tsx
import { formatNumber } from '../i18n/utils'

const number = 1234.56
const formattedNumber = formatNumber(number) // 根据当前语言格式化
```

### 格式化货币

```tsx
import { formatCurrency } from '../i18n/utils'

const amount = 99.99
const formattedCurrency = formatCurrency(amount, 'USD') // 根据当前语言格式化
```

## 最佳实践

1. **使用有意义的键名**：键名应该清晰描述其用途
2. **保持键的层次结构**：使用点号分隔的层次结构组织翻译键
3. **避免硬编码文本**：所有用户可见的文本都应该使用翻译键
4. **提供默认值**：为重要的翻译键提供默认值
5. **测试多语言**：确保在不同语言下界面布局正常

## 故障排除

### 翻译不显示

1. 检查翻译键是否正确
2. 确认语言包文件已正确导入
3. 检查 i18n 是否已初始化

### 语言切换不生效

1. 检查 localStorage 权限
2. 确认语言代码正确
3. 检查语言包是否已加载

### 类型错误

1. 确保已安装 `@types/react-i18next`
2. 检查翻译键类型定义是否正确
3. 确认 TypeScript 配置正确

## 相关链接

- [react-i18next 文档](https://react.i18next.com/)
- [i18next 文档](https://www.i18next.com/)
- [国际化最佳实践](https://www.i18next.com/overview/best-practices)
