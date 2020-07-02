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
