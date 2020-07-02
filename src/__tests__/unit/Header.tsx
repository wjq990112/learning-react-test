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
