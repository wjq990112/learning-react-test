import { createStore, combineReducers } from 'redux';
import { reducer as todoReducer } from '../containers/TodoListPage/store/';

const reducer = combineReducers({
  todo: todoReducer,
});

const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;