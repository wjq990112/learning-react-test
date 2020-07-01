/**
 * @file Jest 配置
 * @author 炽翎
 */
module.exports = {
  // 测试根目录
  roots: ['<rootDir>/src'],
  // 测试覆盖率收集范围: src 下所有的 js jsx ts tsx
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/serviceWorker.ts'
  ],
  // 运行测试前准备文件: 引入 polyfill 解决 jsdom 的兼容性问题
  setupFiles: ['react-app-polyfill/jsdom'],
  // 测试运行环境搭建完成后引入的额外处理文件
  setupFilesAfterEnv: [
    '<rootDir>/src/setupTests.ts',
    '<rootDir>/node_modules/jest-enzyme/lib/index.js'
  ],
  // test 匹配项: 在 __tests__ 文件夹下的所有 js jsx ts tsx 和以 spec test 为中间名的 js jsx ts tsx
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}'
  ],
  // 创建测试运行环境: 在 node 环境下模拟浏览器环境
  testEnvironment: 'jest-environment-jsdom-fourteen',
  // 指定转换器: js jsx ts tsx 使用 babel-jest 进行转换 css 使用 cssTransform.js 进行转换 其他文件使用 fileTransform.js
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.css$': '<rootDir>/config/jest/cssTransform.js',
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)':
      '<rootDir>/config/jest/fileTransform.js'
  },
  // 转化器忽略文件: node_modules 目录下的所有 js jsx ts tsx cssModule 中的所有 css sass scss
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$',
    '^.+\\.module\\.(css|sass|scss)$'
  ],
  // 引入模块的路径: 默认 node_modules 可配置额外路径
  modulePaths: [],
  // 指定模块映射处理模块
  moduleNameMapper: {
    '^react-native$': 'react-native-web',
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy'
  },
  // 自动查找后缀名
  moduleFileExtensions: [
    'web.js',
    'js',
    'web.ts',
    'ts',
    'web.tsx',
    'tsx',
    'json',
    'web.jsx',
    'jsx',
    'node'
  ],
  // watch 模式的插件
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ]
};
