import React from 'react';
import { render, fireEvent, act, RenderResult } from '@testing-library/react';
import App from '../../App';
import axios from 'axios';

jest.mock('axios');

let wrapper: RenderResult;

// 运行每一个测试用例前先渲染组件
beforeEach(async () => {
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
  await act(async () => {
    wrapper = render(<App />);
  });
});

// 运行后重置
afterAll(() => {
  wrapper = null;
});

describe('App 组件', () => {
  test('测试组件初始化后的状态', () => {
    const count = wrapper.queryByTestId('count');
    // 计数器存在且数值为 3
    expect(count).not.toBeNull();
    expect(count.textContent).toEqual('3');

    const list = wrapper.queryAllByTestId('list-item');
    // 列表项不为空且长度为 3
    expect(list).toHaveLength(3);
  });
});
