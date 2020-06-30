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
    const app = wrapper.getByTestId('container');
    expect(app).toBeInTheDocument();
    expect(app.tagName).toEqual('DIV');
    expect(app.textContent).toMatch(/world/i);
  });

  // 点击后文本内容为 "Hello Jack!"
  test('Should render "Hello Jack!" correctly after click', () => {
    const app = wrapper.getByTestId('container');
    fireEvent.click(app);
    expect(app.textContent).toMatch(/jack/i);
  });
});
