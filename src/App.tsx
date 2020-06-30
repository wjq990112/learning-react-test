import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import UndoList from './components/List';

import './App.css';

function App() {
  const [undoList, setUndoList] = useState([]);

  useEffect(() => {
    axios
      .get('/undoList.json')
      .then((res) => {
        setUndoList(res.data.data);
      })
      .catch((e) => {});
  }, []);

  const valueChange = (index: number, value: string) => {
    const newList = undoList.map((item, listIndex) => {
      if (index === listIndex) {
        return {
          ...item,
          value
        };
      }
      return item;
    });
    setUndoList(newList);
  };

  const handleBlur = (index: number) => {
    const newList = undoList.map((item, listIndex) => {
      if (index === listIndex) {
        return {
          ...item,
          status: 'div'
        };
      }
      return item;
    });
    setUndoList(newList);
  };

  const changeStatus = (index: number) => {
    const newList = undoList.map((item, listIndex) => {
      if (index === listIndex) {
        return {
          ...item,
          status: 'input'
        };
      }
      return {
        ...item,
        status: 'div'
      };
    });
    setUndoList(newList);
  };

  const addUndoItem = (value: string) => {
    const newList = [
      ...undoList,
      {
        status: 'div',
        value
      }
    ];
    setUndoList(newList);
  };

  const deleteItem = (index: number) => {
    const newList = [...undoList];
    newList.splice(index, 1);
    setUndoList(newList);
  };

  return (
    <div>
      <Header addUndoItem={addUndoItem} />
      <UndoList
        list={undoList}
        deleteItem={deleteItem}
        changeStatus={changeStatus}
        handleBlur={handleBlur}
        valueChange={valueChange}
      />
    </div>
  );
}

export default App;
