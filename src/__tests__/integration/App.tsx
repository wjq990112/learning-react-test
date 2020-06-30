import React from 'react';
import { render, fireEvent, RenderResult } from '@testing-library/react';
import App from '../../App';

let wrapper: RenderResult;

// 运行每一个测试用例前先渲染组件
beforeEach(() => {
  wrapper = render(<App />);
});

// 运行后重置
afterAll(() => {
  wrapper = null;
});

describe('App 组件', () => {
  test('测试组件初始化后的状态', () => {});
});
