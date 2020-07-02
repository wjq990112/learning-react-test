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
