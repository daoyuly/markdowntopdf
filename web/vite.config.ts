import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  optimizeDeps: {
    exclude: ['../wasm/wasm_crypto.js']
  },
  assetsInclude: ['**/*.wasm'],
  build: {
    // 生产环境构建配置
    target: 'es2015', // 目标浏览器兼容性
    outDir: 'dist', // 输出目录
    assetsDir: '/static/assets', // 静态资源目录
    sourcemap: false, // 生产环境不生成sourcemap
    minify: 'terser', // 使用terser进行代码压缩
    terserOptions: {
      compress: {
        drop_console: true, // 移除console.log
        drop_debugger: true, // 移除debugger
      },
    },
    rollupOptions: {
      external: ['assets/wasm/wasm_crypto.js'],
      output: {
        // 代码分割配置
        manualChunks: {
          vendor: ['react', 'react-dom'], // 第三方库单独打包
        },
        // 文件名配置
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    // 构建优化
    chunkSizeWarningLimit: 1000, // 块大小警告限制
    emptyOutDir: true, // 构建前清空输出目录
  },
  // 生产环境特定配置
  define: {
    __DEV__: false, // 生产环境标识
  },
}) 