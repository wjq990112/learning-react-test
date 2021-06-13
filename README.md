## 前言

> 对不起，鸽了很久的实战终于出来了！
>
> 这篇文章是前端自动化测试系列的 `React` 实战部分，自动化测试系列会从理论走向实践，真正带领大家学会使用前端自动化测试框架，并能在业务中落地。
>
> 看完整个系列，还不会使用自动化测试工具为生产提效，请来找我！
>
> 老规矩，点赞过两百，持续更新 `Vue` 与自动化测试的结合教程。
>
> 关注 **「Hello FE」** 获取更多简单易懂的实战教程。

**本文为实战教程，若文中理论知识存在错误，欢迎大佬在评论区指出！**

经过了上一篇文章的科普，大家应该都对前端的自动化测试有了一定的了解。

没有看过上一篇文章对自动化测试相关概念和 Jest 基础语法的同学可以点击传送门：[《不想痛失薪资普调和年终奖？试试自动化测试！（基础篇）》](https://juejin.im/post/5eeae4f7e51d4574195ed982)

**希望大家都能先打好基础再开始实战的部分！**

实战部分的代码我放在了我的 Git 仓库：[wjq990112 / Learing-React-Test](https://github.com/wjq990112/Learing-React-Test)，欢迎大家点个小星星 ⭐️，持续关注后续更新~

## 前置知识

**我希望你有一点点的英文文档阅读能力**

由于国内对于前端自动化的实践不多，相关介绍的文章也很少，中文资料匮乏，很多库类只能通过去阅读英文官方文档来学习使用。当然，在这篇文章中我会尽量给大家将英文文档中**比较基础比较重要**的部分讲解一下。

**我希望你有一点点的 `React` 基础**

既然是与 `React` 结合的自动化测试实战，那么 `React` 的基本用法是必知必会的欧，如果 `React` 还不会的同学，可以去购买 [@神三元](https://juejin.im/user/5c45ddf06fb9a04a006f5491)（三元记得打钱 🐶） 的小册：[《React Hooks 与 Immutable 数据流实战》](https://juejin.im/book/5da96626e51d4524ba0fd237)，看完你也能成为 `React` 高手。

**我希望你有一点点的 TypeScript 基础**

虽然我在实战中会尽量减少使用 TypeScript 的语法，但部分代码用到的时候不要一头雾水不知所云欧！

**我希望你有一定的工程化能力**

自动化测试是一个工程问题，对这方面一定要有一定的了解才行。文章中会涉及到一些 `babel.config.js`、`jest.config.js` 等配置文件的配置和讲解，没有配置基础的同学可以先跟着文章的内容学习，后续一定要自己阅读一下官方文档进行学习！

## 准备工作

### 方法一

**强烈建议大家跟着方法一一步一步搭建好我们的实战环境！**

大家可以使用 `create-react-app` 自己创建一个项目，两种方式创建：

```bash
npx create-react-app jest-react --template-typescript
```

或者：

```bash
npm install create-react-app -g
create-react-app jest-react --template-typescript
```

创建好项目后，就可以开始尝试一下自动化测试和 `React` 的结合的神奇效果了！

### 方法二

方法一如果大家觉得麻烦，也可以直接从 GitHub 拉我的代码下来，选择对应教程的分支：

```bash
# 基础教程
git checkout base
# 进阶教程: testing-library
git checkout advance/testing-library
# 进阶教程: enzyme
git checkout advance/enzyme
```

然后执行：

```bash
npm install
npm run start
```

服务跑在 [http://localhost:3000](http://localhost:3000)，会自动打开浏览器，服务启动完成之后就能看到实战项目的界面啦！

当然，我们这个项目主要是为了讲解自动化测试的，界面就没做那么漂亮了。旨在让大家通过真正的代码实战来学习前端自动化测试，如果想把界面做得更漂亮可以把代码拉下来之后加上一些样式欧！

**不过我还是建议大家能够使用方法一一步一步来，这样印象会更加深刻一点，能帮助你更快地学习和理解本文的内容！**

## 基础教程

### 组件开发

我们完成准备工作后，就可以开始写代码了。

按照惯例，第一次要慢慢来，先适应一下，避免用力过猛：

我们先写个 HelloWorld，希望能给我们后面的学习带来好运！

```ts
// App.tsx
import React, { useState } from 'react';
import './App.css';

function App() {
  const [content, setContent] = useState('Hello World!');

  return (
    <div
      className="app"
      // 方便测试用例中获取 DOM 节点
      data-testid="container"
      onClick={() => {
        setContent('Hello Jack!');
      }}
    >
      {content}
    </div>
  );
}

export default App;
```

非常简单的组件，点击一下会变成 **Hello Jack!**：

![HelloWorld](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/995ae86408084721af81837f7536bfb1~tplv-k3u1fbpfcp-zoom-1.image)

### 测试用例编写

首先，我们要思考一下，我们这个 HelloWorld 的组件，有哪些地方需要测试？

我们不妨站在用户的角度思考一下：

1. 看到 **Hello World!**
2. 点击 **Hello World!**
3. 看到 **Hello Jack!**

那么，我们需要让这个流程走通，就需要通过这几个步骤：

1. HelloWorld 组件渲染正常，`div` 标签的内容为 **Hello World!**
2. `children` 为 **Hello World!** 的 `div` 标签被点击
3. `div` 标签的 `children` 变成 **Hello Jack!**

画一个流程图：

![HelloWorld](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c6c93c89bff4995a24ed5163d36e50f~tplv-k3u1fbpfcp-zoom-1.image)

发现没有，这里我们使用的思想方式是 **BDD**，不了解 **BDD** 的同学，可以回去翻我上一篇文章：[传送门](https://juejin.im/post/5eeae4f7e51d4574195ed982)。

那么，既然我们已经明确了进行测试所需要的行动点，那么我们就可以开始写测试代码了，这里我们使用的是 `React` 官方默认的 [**React Testing Library**](https://github.com/testing-library/react-testing-library)。

**在创建项目的时候，React 已经默认为我们配置好了，基础教程中，我们不需要进行手动测试。**

我们创建项目的时候会发现，在 `src` 目录下有一个 `App.test.tsx` 的文件，打开它我们会发现一个非常简单的测试用例：

```ts
// App.test.tsx
import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  // render 方法返回一个包裹对象 对象中包括一些对 DOM 的查询/获取方法
  // getByText: 通过标签的 text 获取 DOM
  const { getByText } = render(<App />);
  // 获取 text 匹配正则 /learn react/i 的 DOM
  const linkElement = getByText(/learn react/i);
  // 判断 DOM 是否在 Document 中
  expect(linkElement).toBeInTheDocument();
});
```

这是一个最简单的 Demo，可能不懂的地方，我都在代码注释了，更多详细的内容还是要到 [**React Testing Library**](https://github.com/testing-library/react-testing-library) 文档中去获取。

### 运行测试用例

我们先在控制台执行一下

```bash
npm run test
```

你会发现结果是这样的：

![报错](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/36fcac851d4d42f7aeeb1a87662a3673~tplv-k3u1fbpfcp-zoom-1.image)

这是因为 `getByTextId` 这个 API，在没有找到对应的 DOM 节点的时候，会直接抛出异常。

现在我们把这部分的内容删掉，换成我们需要编写的测试用例：

```ts
// App.test.tsx
import React from 'react';
import { render, fireEvent, RenderResult } from '@testing-library/react';
import App from './App';

let wrapper: RenderResult;

// 运行每一个测试用例前先渲染组件
beforeEach(() => {
  wrapper = render(<App />);
});

describe('Should render App component correctly', () => {
  // 初始化文本内容为 "Hello World!"
  test('Should render "Hello World!" correctly', () => {
    // getByTestId: 通过属性 data-testid 来获取对应的  DOM
    // 这里我们获取到的是上面 HelloWorld 组件中的 div 标签
    const app = wrapper.getByTestId('container');
    expect(app).toBeInTheDocument();
    // 判断获取到的标签是否是 div
    expect(app.tagName).toEqual('DIV');
    // 判断 div 标签的 text 是否匹配正则 /world/i
    expect(app.textContent).toMatch(/world/i);
  });

  // 点击后文本内容为 "Hello Jack!"
  test('Should render "Hello Jack!" correctly after click', () => {
    const app = wrapper.getByTestId('container');
    // fireEvent: 模拟点击事件
    fireEvent.click(app);
    expect(app.textContent).toMatch(/jack/i);
  });
});
```

这里可能有些同学开始不知所云了，没关系，一行一行来看我们的测试代码。

```ts
let wrapper: RenderResult;

// 运行每一个测试用例前先渲染组件
beforeEach(() => {
  wrapper = render(<App />);
});
```

`beforeEach` 生命周期钩子会在每个测试用例运行之前运行，在这里，我们将 HelloWorld 组件渲染到了在 `node` 上模拟的 jsdom 环境中，其实就是在 node 上模拟了一个浏览器。

我们用 `wrapper` 变量来保存我们渲染出来的结果，然后再通过 React Testing Library 为我们封装的一些方法来获取对应的 DOM 元素。

```ts
describe('Should render App component correctly', () => {});
```

看到这里可能有些同学又懵了，其实这个很容易理解，就是字面意思 —— 为测试一个大的测试的单元添加一个描述。

当然，你也可以不写，直接写两个测试用例。如果不写的话，`Jest` 会默认用文件名作为测试单元描述。

我们的测试用例都写在

```ts
test('测试用例的描述', () => {});
```

的回调函数中，每一个 `test` 函数就是一个测试用例。

`test` 函数还有一个别名 `it`，大家在后面如果看到

```ts
it('测试用例的描述', () => {});
```

也不要惊讶，知道它就是 `test` 就可以了。

上面的这部分教程，算是对上一篇文章中没有讲到的部分的补充，避免看文章的朋友们不知道这样写的原因。

现在我们运行

```bash
npm run test
```

结果就变成了这样：

![通过](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/103c56c9e2e54152a902bf3827a482d8~tplv-k3u1fbpfcp-zoom-1.image)

**看到一串片绿油油的结果，是不是很爽？**

### 再来一遍

现在我们升级一下，也带大家看看 React Testing Library 官方的基础示例：

```js
// hidden-message.js
import React from 'react';

// NOTE: React Testing Library works with React Hooks _and_ classes just as well
// and your tests will be the same however you write your components.
function HiddenMessage({ children }) {
  const [showMessage, setShowMessage] = React.useState(false);
  return (
    <div>
      <label htmlFor="toggle">Show Message</label>
      <input
        id="toggle"
        type="checkbox"
        onChange={(e) => setShowMessage(e.target.checked)}
        checked={showMessage}
      />
      {showMessage ? children : null}
    </div>
  );
}

export default HiddenMessage;
```

```js
// __tests__/hidden-message.js
// these imports are something you'd normally configure Jest to import for you
// automatically. Learn more in the setup docs: https://testing-library.com/docs/react-testing-library/setup#cleanup
import '@testing-library/jest-dom';
// NOTE: jest-dom adds handy assertions to Jest and is recommended, but not required

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import HiddenMessage from '../hidden-message';

test('shows the children when the checkbox is checked', () => {
  const testMessage = 'Test Message';
  render(<HiddenMessage>{testMessage}</HiddenMessage>);

  // query* functions will return the element or null if it cannot be found
  // get* functions will return the element or throw an error if it cannot be found
  expect(screen.queryByText(testMessage)).toBeNull();

  // the queries can accept a regex to make your selectors more resilient to content tweaks and changes.
  fireEvent.click(screen.getByLabelText(/show/i));

  // .toBeInTheDocument() is an assertion that comes from jest-dom
  // otherwise you could use .toBeDefined()
  expect(screen.getByText(testMessage)).toBeInTheDocument();
});
```

上面一堆英文注释，肯定有英语不好的朋友会说：**“啊你这照搬照套全是英文的我怎么看得懂啊~”**

别急，我给你翻译一下！

```ts
// query* functions will return the element or null if it cannot be found
// get* functions will return the element or throw an error if it cannot be found
expect(screen.queryByText(testMessage)).toBeNull();
```

这一段代码，使用了一个 API：`queryByText`，这个 API 的作用是，通过 `text` 来查找对应的 DOM。可是，`queryByText` 和 `getByText` 又有什么区别呢？

区别就在于 `query*` 类型的 API 在被调用的时候，如果没有找到对应的 DOM，会返回 `null`，但是 `get*` 在没有找到对应的 DOM 时会直接报错。

```ts
// the queries can accept a regex to make your selectors more resilient to content tweaks and changes.
fireEvent.click(screen.getByLabelText(/show/i));
```

这一段代码，经过上面我的讲解应该不陌生了，模拟一次点击事件。模拟点击事件之前我们得先找到对应的 DOM，`getByLabelText` API 就是通过 `label` 的内容找到对应的 DOM，传递的参数支持正则表达式。

```ts
// .toBeInTheDocument() is an assertion that comes from jest-dom
// otherwise you could use .toBeDefined()
expect(screen.getByText(testMessage)).toBeInTheDocument();
```

这一段代码用于判断 DOM 是否在 `Document` 中，其中 `toBeInTheDocument` API 是 `jest-dom` 提供的方法，这个方法不是必须的，你也可以使用 `jest` 自带的 API `toBeDefined` 来判断。

**实战的基础部分就这么多，想看进阶部分的同学可以往下继续学习观看~**

## 进阶教程

### 弹出工程配置

准备工作中**方法一**的两种方式都可以创建一个基于 TypeScript 的 `React` 项目。使用 `create-react-app` 脚手架创建的项目中已经默认引入了自动化测试的工具，但是脚手架默认将工具的一些配置隐藏起来了，我们如果希望将配置弹出并进行手动配置，就需要运行：

```bash
npm run eject
```

将默认的一些工程化配置弹出，弹出后项目的目录会变成这样：

```bash
README.md         node_modules      package.json      scripts
config            package-lock.json public            src
```

会比项目刚创建的时候多了 `config` 和 `scripts` 两个文件夹，里面是一些脚手架默认的工程配置文件，如果对工程化不是非常了解，**千万别乱改**！

除了多了两个文件目录之外，在 `package.json` 中也添加了很多依赖，同时还添加了 `babel` 和 `jest` 的配置：

```json
  "jest": {
    "roots": [
      "<rootDir>/src"
    ],
    "collectCoverageFrom": [
      "src/**/*.{js,jsx,ts,tsx}",
      "!src/**/*.d.ts"
    ],
    "setupFiles": [
      "react-app-polyfill/jsdom"
    ],
    "setupFilesAfterEnv": [
      "<rootDir>/src/setupTests.js"
    ],
    "testMatch": [
      "<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}",
      "<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}"
    ],
    "testEnvironment": "jest-environment-jsdom-fourteen",
    "transform": {
      "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest",
      "^.+\\.css$": "<rootDir>/config/jest/cssTransform.js",
      "^(?!.*\\.(js|jsx|ts|tsx|css|json)$)": "<rootDir>/config/jest/fileTransform.js"
    },
    "transformIgnorePatterns": [
      "[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$",
      "^.+\\.module\\.(css|sass|scss)$"
    ],
    "modulePaths": [],
    "moduleNameMapper": {
      "^react-native$": "react-native-web",
      "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy"
    },
    "moduleFileExtensions": [
      "web.js",
      "js",
      "web.ts",
      "ts",
      "web.tsx",
      "tsx",
      "json",
      "web.jsx",
      "jsx",
      "node"
    ],
    "watchPlugins": [
      "jest-watch-typeahead/filename",
      "jest-watch-typeahead/testname"
    ]
  },
  "babel": {
    "presets": [
      "react-app"
    ]
  }
```

这些都是 `React` 官方提供的 `babel` 和 `jest` 的默认配置，如果还没搞懂 `babel` 和 `jest`，**不要随意修改欧**！

### 迁移 Jest/Babel 配置

配置都放在 `package.json` 中不是很方便操作，如果要修改每次都要到 `package.json` 中去找，我们把他们单独抽出来：

首先在根目录下创建两个文件 `babel.config.js` `jest.config.js`，然后分别将 `package.json` 中的 Babel 配置和 Jest 配置复制到对应的 config 文件中：

```js
// jest.config.js

module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts'],
  setupFiles: ['react-app-polyfill/jsdom'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}'
  ],
  testEnvironment: 'jest-environment-jsdom-fourteen',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.css$': '<rootDir>/config/jest/cssTransform.js',
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)':
      '<rootDir>/config/jest/fileTransform.js'
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$',
    '^.+\\.module\\.(css|sass|scss)$'
  ],
  modulePaths: [],
  moduleNameMapper: {
    '^react-native$': 'react-native-web',
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy'
  },
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
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ]
};
```

```js
// babel.config.js
module.exports = {
  presets: ['react-app']
};
```

### Jest 配置详解

我猜，这里肯定又有同学说：**“啊你这个乱七八糟一大堆配置我怎么看得懂啊~”**

别急，让我们逐条来看！

`babel.config.js` 的内容太简单，就不详细讲解了，我们主要来讲一讲 `jest.config.js`：

```js
roots: ['<rootDir>/src'],
```

`roots` 是用于指定 Jest 的根目录的，Jest 只会检测在根目录下的测试用例并运行。

```js
collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts'],
```

`src` 目录下文件很多，但是我们要生成测试覆盖率报告，一些无关的文件就不能被统计到覆盖率当中。

`collectCoverageFrom` 是用于指定测试覆盖率统计范围的：`src` 下的所有 `js,jsx,ts,tsx` 文件，同时排除 `.d.ts` 类型声明文件。

```js
setupFiles: ['react-app-polyfill/jsdom'],
```

`setupFiles` 是用于指定创建测试环境前的准备文件的，这里引入 `react-app-polyfill/jsdom` 解决 `jsdom` 的兼容性问题。

```js
setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
```

`setupFilesAfterEnv` 是用于指定测试环境创建完成后为每个测试文件编写的配置文件。

我们可以看到默认的 `setupTests.ts` 中内容是这样的：

```ts
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';
```

在测试环境创建完成后为每一个测试文件都引入 `@testing-library/jest-dom/extend-expect`，为 Jest 提供了更多适配 `React` 的匹配器，如 `toHaveTextContent`。

```js
testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}'
  ],
```

`testMatch` 是用于配置 Jest 匹配测试文件的规则的，这里我们看到配置项中填写的是在 `__tests__` 文件夹下的所有 `js,jsx,ts,tsx` 以及以 `.spec/.test` 结尾的 `js,jsx,ts,tsx` 文件。

```js
testEnvironment: 'jest-environment-jsdom-fourteen',
```

`testEnvironment` 应该能见名知义了，就是用于指定测试用例运动的环境的。

我们知道 Jest 是运行在 node 环境的，但是我们的前端代码却是运行在浏览器环境中，因此我们必须使用一些方法在 node 环境下模拟浏览器环境。

这里 `React` 官方推荐的是使用 `jest-environment-jsdom-fourteen`，感兴趣的同学可以去搜索一下这个库，现在已经有了 `sixteen` 版本了。

```js
transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.css$': '<rootDir>/config/jest/cssTransform.js',
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)':
      '<rootDir>/config/jest/fileTransform.js'
  },
```

`transform` 是用于配置文件处理模块的。

我们在测试的过程中，其实是需要去掉 CSS 和其他与组件逻辑相关性不大的静态资源的，但是在我们的组件代码中有时候又需要引入这些代码。

那么在我们测试的时候，就需要指定一些模块来处理/代替这些文件，不然就可能以为找不到模块的问题报错。

这部分的代码就是指定了所有的 `js,jsx,ts,tsx` 使用 `babel-jest` 的插件做处理，所有的 `css` 文件使用 `<rootDir>/config/jest/cssTransform.js` 模块做处理，所有的非 `js,jsx,ts,tsx,css,json` 文件，都使用 `<rootDir>/config/jest/fileTransform.js` 模块做处理。

那既然用到了这两个模块，我们就到模块看看 `React` 官方的配置是什么样的：

```js
// cssTransform.js
'use strict';

module.exports = {
  process() {
    return 'module.exports = {};';
  },
  getCacheKey() {
    // The output is always the same.
    return 'cssTransform';
  }
};
```

`cssTransform.js` 模块中我们可以看到默认使用了一个空的模块代替 `css` 文件。

```js
// fileTransform.js
'use strict';

const path = require('path');
const camelcase = require('camelcase');

// This is a custom Jest transformer turning file imports into filenames.
// http://facebook.github.io/jest/docs/en/webpack.html

module.exports = {
  process(src, filename) {
    const assetFilename = JSON.stringify(path.basename(filename));

    if (filename.match(/\.svg$/)) {
      // Based on how SVGR generates a component name:
      // https://github.com/smooth-code/svgr/blob/01b194cf967347d43d4cbe6b434404731b87cf27/packages/core/src/state.js#L6
      const pascalCaseFilename = camelcase(path.parse(filename).name, {
        pascalCase: true
      });
      const componentName = `Svg${pascalCaseFilename}`;
      return `const React = require('react');
      module.exports = {
        __esModule: true,
        default: ${assetFilename},
        ReactComponent: React.forwardRef(function ${componentName}(props, ref) {
          return {
            $$typeof: Symbol.for('react.element'),
            type: 'svg',
            ref: ref,
            key: null,
            props: Object.assign({}, props, {
              children: ${assetFilename}
            })
          };
        }),
      };`;
    }

    return `module.exports = ${assetFilename};`;
  }
};
```

`fileTransform.js` 模块中可以看到默认的配置是当文件名是以 `.svg` 结尾时，则创建一个 `React` 的 SVG 组件并返回，否则直接返回文件名。

```js
transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$',
    '^.+\\.module\\.(css|sass|scss)$'
  ],
```

`transformIgnorePatterns` 用于配置文件处理模块应该忽略的文件，React 官方的配置是忽略 `node_modules` 文件夹下的所有 `js,jsx,ts,tsx`，忽略所有的 CSS Module 文件。

```js
modulePaths: [],
```

`modulePaths` 用于指定模块的查找路径，默认会在 `node_modules` 下查找，如果需要在其他的文件路径下查找模块，可以手动指定文件路径。

```js
moduleNameMapper: {
    '^react-native$': 'react-native-web',
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy'
  },
```

`moduleNameMapper` 用于对模块映射处理。`'^react-native$': 'react-native-web'` 是对 React Native 做配置的，Web 应用可以删除，`'^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy'` 是对 CSS Module 做映射，将 CSS Module 转换成键值对的形式。

```js
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
```

`moduleFileExtensions` 用于配置需要查找的文件后缀名，如果是 `React` 的单页 Web 应用，可以删掉其中非 `js,jsx,ts,tsx` 的后缀名。

```js
watchPlugins: [
  'jest-watch-typeahead/filename',
  'jest-watch-typeahead/testname'
  ],
```

`watchPlugins` 用于指定 Jest 在 `watch` 模式下的插件，这部分的配置我们就用 `React` 官方推荐的就行，基本不需要我们改动。

### 更多配置

其实 Jest 有很多非常实用的配置项，如果你在测试的过程中遇到问题，不妨尝试一下阅读官方的文档：[Jest 官方文档](https://jestjs.io/docs/zh-Hans/getting-started)。

### 开始动手

在写这个 Demo 之前想了一下，要是做得太丑了估计没人爱看，于是决定做好看点，可是我审美又不是很到位，想了想最终决定把 Dell 老师的 `TODO List` 中的样式搬过来，**逻辑和测试代码自己写**，站在巨人的肩膀上就好多了。

先来看下效果：

![TODO List](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5cbaf078740644c1a09b09c66a692c47~tplv-k3u1fbpfcp-zoom-1.image)

组件代码我就不详细讲解了，如果想看组件代码的话可以到 GitHub 仓库 `clone` 下来，然后切换到 `advance/testing-library` 分支。

**我们重点就讲解一下如何写测试的部分！**

#### 单元测试（Testing-Library）

首先，我们要分析各个组件需要测试什么功能，**这一点非常重要**。

**如果一开始没有明确各个组件需要测试的功能，很有可能过度测试或者遗漏测试分支！**

- Header 组件

  1. `input` 存在且 `value` 为空
  2. `input` 能输入
  3. `input` 能回车提交
  4. `input` 能在提交后将 `value` 置空

- List 组件
  1. 列表为空，无列表项，右上角计数器存在且值为 0
  2. 列表不为空，存在列表项，右上角计数器存在且为列表长度，列表项删除按钮存在，列表项可删除
  3. 列表不为空，存在列表项，右上角计数器存在且为列表长度，列表项内容点击后变成 `input`，回车后可修改对应列表项内容

明确了我们需要测试的功能，就可以开始写单元测试的代码了，测试一下各个组件是否能够正常工作：

```ts
// Header.test.tsx
import React from 'react';
import { render, fireEvent, RenderResult } from '@testing-library/react';
import Header from '../../components/Header';

let wrapper: RenderResult;
let input: HTMLInputElement;
const addUndoItem = jest.fn();

beforeEach(() => {
  wrapper = render(<Header addUndoItem={addUndoItem} />);
  input = wrapper.getByTestId('header-input') as HTMLInputElement;
});

afterEach(() => {
  wrapper = null;
  input = null;
});

describe('Header 组件', () => {
  it('组件初始化正常', () => {
    // input 存在
    expect(input).not.toBeNull();

    // 组件初始化 input value 为空
    expect(input.value).toEqual('');
  });

  it('输入框应该能输入', () => {
    const inputEvent = {
      target: {
        value: 'Learn Jest'
      }
    };
    // 模拟输入
    // 输入后 input value 为输入值
    fireEvent.change(input, inputEvent);
    expect(input.value).toEqual(inputEvent.target.value);
  });

  it('输入框回车后应该能提交并清空', () => {
    const inputEvent = {
      target: {
        value: 'Learn Jest'
      }
    };
    const keyboardEvent = {
      keyCode: 13
    };
    // 模拟回车
    // 调用 addUndoItem props 调用时参数为 input value
    // input value 置空
    fireEvent.change(input, inputEvent);
    fireEvent.keyUp(input, keyboardEvent);
    expect(addUndoItem).toHaveBeenCalled();
    expect(addUndoItem).toHaveBeenCalledWith(inputEvent.target.value);
    expect(input.value).toEqual('');
  });
});
```

```ts
// List.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import List, { IList } from '../../components/List';

describe('List 组件', () => {
  it('组件初始化正常', () => {
    const props: IList = {
      list: [],
      deleteItem: jest.fn(),
      changeStatus: jest.fn(),
      handleBlur: jest.fn(),
      valueChange: jest.fn()
    };

    const wrapper = render(<List {...props} />);
    const count = wrapper.queryByTestId('count');
    // 计数器存在且数值为 0
    expect(count).not.toBeNull();
    expect(count.textContent).toEqual('0');

    const list = wrapper.queryAllByTestId('list-item');
    // 列表项为空
    expect(list).toHaveLength(0);
  });

  it('列表项应该能删除', () => {
    const props: IList = {
      list: [{ status: 'div', value: 'Learn Jest' }],
      deleteItem: jest.fn(),
      changeStatus: jest.fn(),
      handleBlur: jest.fn(),
      valueChange: jest.fn()
    };

    const wrapper = render(<List {...props} />);
    const count = wrapper.queryByTestId('count');
    // 计数器存在且数值为 1
    expect(count).not.toBeNull();
    expect(count.textContent).toEqual('1');

    const list = wrapper.queryAllByTestId('list-item');
    // 列表项不为空
    expect(list).toHaveLength(1);

    const deleteBtn = wrapper.queryAllByTestId('delete-item');
    // 删除按钮不为空
    expect(deleteBtn).toHaveLength(1);
    const e: Partial<React.MouseEvent> = {};
    fireEvent.click(deleteBtn[0], e);
    // 阻止事件冒泡
    expect(props.changeStatus).not.toHaveBeenCalled();
    // deleteItem 被调用 参数为 0
    expect(props.deleteItem).toHaveBeenCalled();
    expect(props.deleteItem).toHaveBeenCalledWith(0);
  });

  it('列表项应该能编辑', () => {
    const props: IList = {
      list: [
        { status: 'div', value: 'Learn Jest' },
        { status: 'input', value: 'Learn Enzyme' }
      ],
      deleteItem: jest.fn(),
      changeStatus: jest.fn(),
      handleBlur: jest.fn(),
      valueChange: jest.fn()
    };

    const wrapper = render(<List {...props} />);
    const list = wrapper.queryAllByTestId('list-item');
    // 第一项未处于编辑状态 第二项处于编辑状态
    expect(list[0].querySelector('[data-testid="input"]')).toBeNull();
    expect(list[1].querySelector('[data-testid="input"]')).not.toBeNull();

    // 点击第一项
    fireEvent.click(list[0]);
    // changeStatus 被调用 参数为 0
    expect(props.changeStatus).toHaveBeenCalled();
    expect(props.changeStatus).toHaveBeenCalledWith(0);

    // 第二项 input 输入
    fireEvent.change(list[1].querySelector('[data-testid="input"]'), {
      target: { value: 'Learn Testing Library' }
    });
    // valueChange 被调用 参数为 1 Learn Enzyme
    expect(props.valueChange).toHaveBeenCalled();
    expect(props.valueChange).toHaveBeenCalledWith(1, 'Learn Testing Library');

    // 第二项 input 框失焦
    fireEvent.blur(list[1].querySelector('[data-testid="input"]'));
    // handleBlur 被调用 参数为 1
    expect(props.handleBlur).toHaveBeenCalled();
    expect(props.handleBlur).toHaveBeenCalledWith(1);
  });
});
```

单元测试部分的代码基本上都是上一篇文章中有介绍到的一些匹配器，没有看过上一篇或者看了还是一头雾水的同学可以回去复习一下：[《试试前端自动化测试！（基础篇）》](https://juejin.im/post/5eeae4f7e51d4574195ed982)，这部分就不详细讲解了。

#### 集成测试（Testing-Library）

可能有同学会说：**“你上面这个内容测试了单独的组件能不能正常工作，万一他组合起来工作不正常呢？”**

如果你看到这里，也有这种感觉的话，就说明你已经比较理解自动化测试了。

单元测试有一个默认的前提：**如果一份代码的所有组成部分能够正常工作，那么这份代码就能正常工作。**

就好像一个齿轮组，如果齿轮组中的所有齿轮都能正常工作，那么整个齿轮组就能正常工作。

**正常来讲，在企业开发中，如果我们能够实现较高的单元测试覆盖率，那么我们就没有必要再去写集成测试的代码，来检测组合后的代码是否能正常工作。**

但是呢，这里又有点不一样，为什么这么说呢？

有没有发现上面的测试代码中，并没有测试**Header 组件输入后 List 组件是否有增加**这功能？

所以这里就需要借助集成测试来测试一下两个组件组合后，整个应用的功能正不正常：

```ts
// App.resolved.test.tsx
import React from 'react';
import { render, fireEvent, act, RenderResult } from '@testing-library/react';
import App from '../../App';
import axios from 'axios';

jest.mock('axios');
axios.get.mockResolvedValue({
  data: {
    code: 200,
    data: [
      {
        status: 'div',
        value: '学习 Jest'
      },
      {
        status: 'div',
        value: '学习 Enzyme'
      },
      {
        status: 'div',
        value: '学习 Testing-Library'
      }
    ],
    message: 'success'
  }
});

let wrapper: RenderResult;
let headerInput: HTMLInputElement;
let count: HTMLDivElement;
let list: HTMLLIElement[];
let input: HTMLInputElement[];
let deleteBtn: HTMLDivElement[];

// 运行每一个测试用例前先渲染组件
beforeEach(async () => {
  await act(async () => {
    wrapper = render(<App />);
  });
  headerInput = wrapper.getByTestId('header-input') as HTMLInputElement;
  count = wrapper.queryByTestId('count') as HTMLDivElement;
  list = wrapper.queryAllByTestId('list-item') as HTMLLIElement[];
  input = wrapper.queryAllByTestId('input') as HTMLInputElement[];
  deleteBtn = wrapper.queryAllByTestId('delete-item') as HTMLDivElement[];
});

// 运行后重置
afterEach(() => {
  wrapper = null;
  headerInput = null;
  count = null;
  list = [];
  input = [];
  deleteBtn = [];
});

describe('App 组件（请求成功时）', () => {
  it('组件初始化正常', () => {
    // headerInput 存在
    expect(headerInput).not.toBeNull();

    // 组件初始化 headerInput value 为空
    expect(headerInput.value).toEqual('');

    // 计数器存在且数值为 3
    expect(count).not.toBeNull();
    expect(count.textContent).toEqual('3');

    // 列表项不为空且长度为 3
    expect(list).toHaveLength(3);

    // 没有列表项处于编辑状态
    expect(input).toHaveLength(0);
  });

  it('输入框提交后列表项应该增加', () => {
    fireEvent.change(headerInput, {
      target: { value: '分享自动化测试学习成果' }
    });
    fireEvent.keyUp(headerInput, { keyCode: 13 });

    expect(count.textContent).toEqual('4');
    // 会触发 DOM 变化 需重新查询一次
    list = wrapper.queryAllByTestId('list-item') as HTMLLIElement[];
    expect(list).toHaveLength(4);

    // 最后一项的内容为添加的内容
    expect(list[3]).toHaveTextContent('分享自动化测试学习成果');
  });

  it('列表项删除后应该能减少', () => {
    fireEvent.click(deleteBtn[2]);

    expect(count.textContent).toEqual('2');
    // 会触发 DOM 变化 需重新查询一次
    list = wrapper.queryAllByTestId('list-item') as HTMLLIElement[];
    expect(list).toHaveLength(2);
  });

  it('列表项应该能编辑并提交', () => {
    fireEvent.click(list[2]);
    const editingItemInput = list[2].querySelector(
      '[data-testid="input"]'
    ) as HTMLInputElement;

    // 第一 二项未处于编辑状态 第三项处于编辑状态
    expect(list[0].querySelector('[data-testid="input"]')).toBeNull();
    expect(list[1].querySelector('[data-testid="input"]')).toBeNull();
    expect(editingItemInput).not.toBeNull();

    // 第三项输入
    fireEvent.change(editingItemInput, {
      target: { value: 'Learn Testing Library' }
    });
    expect(editingItemInput.value).toEqual('Learn Testing Library');

    // 失焦后内容被改变
    fireEvent.blur(editingItemInput);
    expect(list[2]).toHaveTextContent('Learn Testing Library');
  });
});
```

认真看了代码的同学可能会对这些代码感到疑惑：

```ts
// mock api
jest.mock('axios');
axios.get.mockResolvedValue({
  data: {
    code: 200,
    data: [
      {
        status: 'div',
        value: '学习 Jest'
      },
      {
        status: 'div',
        value: '学习 Enzyme'
      },
      {
        status: 'div',
        value: '学习 Testing-Library'
      }
    ],
    message: 'success'
  }
});
```

```ts
// async render
await act(async () => {
  wrapper = render(<App />);
});
```

因为我们的应用中用到了 `axios` 来请求本地数据，最终呈现在页面上。

在实际的开发当中肯定是调用后端给的接口来获取数据或对数据进行操作，这就引出了很重要的一点：**测试代码不能对业务代码产生侵入性！**

事实上这个**侵入性**不只是**对业务代码的侵入**，还有**对后端接口的侵入**。

上面 `mock api` 的代码，其实就是在测试环境下模拟一个接口的返回值，因为 `axios` 的 `get` 方法返回的是一个 `Promise`，因此我们也应该调用 `mockResolvedValue` 来模拟接口 `resolve` 状态的结果。

后面的 `async render` 其实也是为这个 `axios` 服务的，因为 `axios` 请求接口是一个异步的过程，如果我们使用同步的方式来渲染，异步事件会被放入事件队列中，等到同步的代码执行完成。

这样的话就会出现异步事件还没执行，测试用例就已经跑完了的情况，最终导致测试可能不通过。

当然，这里只是模拟了接口 `resolve` 的状态，我们还可以创建一个 `App.rejected.test.tsx` 文件，来测试接口 `reject` 的状态（实际开发中，接口 `reject` 可能也需要一个友好的提示）。

#### 单元测试 & 集成测试（Enzyme）

除了 `React` 官方推荐的 `Testing-Library`，`Airbnb` 公司也推出了一款测试框架 `Enzyme`，同样也是非常好用的一款测试框架，设计思想略有不同，感兴趣的同学可以到这个项目的 GitHub 仓库查看，记得切换到 `advance/enzyme` 分支。

`Enzyme` 的代码就是完全由 Dell 老师编写的了，这里仅供大家参考学习~

#### 单元测试（Hooks 相关）

在使用 `React Hooks` 开发的过程中我们可能会将一些重复逻辑抽离成公共的 `Hooks`，这公共 `Hooks` 的可靠性也很重要，`Testing-Library` 还为我们提供了专门用于测试 `React Hooks` 的工具：[`react-hooks-testing-library`](https://github.com/testing-library/react-hooks-testing-library)

## 参考资料

- [Dell Lee：前端要学的测试课 从 Jest 入门到 TDD/BDD 双实战](https://coding.imooc.com/learn/list/372.html)
- [jest-dom 官方文档](https://github.com/testing-library/jest-dom)
- [react-testing-library 官方文档](https://github.com/testing-library/react-testing-library)
- [Enzyme 官方文档](https://enzymejs.github.io/enzyme/)
