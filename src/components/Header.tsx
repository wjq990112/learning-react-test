import React, { useState } from 'react';

interface IHeader {
  addUndoItem: (value: string) => void;
}

const Header: React.FC<IHeader> = (props) => {
  const [value, setValue] = useState('');
  const { addUndoItem } = props;

  const handleInputKeyUp = (e: React.KeyboardEvent) => {
    if (e.keyCode === 13 && value) {
      addUndoItem(value);
      setValue('');
    }
  };
  return (
    <div>
      <div className="header">
        <div className="header-content">
          TodoList
          <input
            placeholder="Add Todo"
            className="header-input"
            data-testid="header-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyUp={handleInputKeyUp}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
