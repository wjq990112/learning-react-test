import React from 'react';

type TListItem = {
  status: 'div' | 'input';
  value: string;
};

export interface IList {
  list: TListItem[];
  deleteItem: (index: number) => void;
  changeStatus: (index: number) => void;
  handleBlur: (index: number) => void;
  valueChange: (index: number, value: string) => void;
}

const List: React.FC<IList> = (props) => {
  const { list, changeStatus, handleBlur, valueChange, deleteItem } = props;

  return (
    <div className="undo-list">
      <div className="undo-list-title">
        正在进行
        <div data-testid="count" className="undo-list-count">
          {list.length}
        </div>
      </div>
      <ul className="undo-list-content">
        {list.map((item, index) => {
          return (
            <li
              className="undo-list-item"
              data-testid="list-item"
              key={index}
              onClick={() => changeStatus(index)}
            >
              {item.status === 'div' ? (
                item.value
              ) : (
                <input
                  className="undo-list-input"
                  data-testid="input"
                  value={item.value}
                  onBlur={() => handleBlur(index)}
                  onChange={(e) => valueChange(index, e.target.value)}
                />
              )}
              <div
                className="undo-list-delete"
                data-testid="delete-item"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteItem(index);
                }}
              >
                -
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default List;
