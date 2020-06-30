import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from '../containers/TodoListPage/store';

class Header extends Component {
  
  constructor(props) {
    super(props);
    this.handleInputKeyUp = this.handleInputKeyUp.bind(this);
  }

  handleInputKeyUp(e) {
    const { value } = this.props;
    if(e.keyCode === 13 && value) {
      this.props.addUndoItem(value);
      this.props.handleInputChange('');
    }
  }

  render() {
    const { value, handleInputChange } = this.props;
    return (
      <div className="header">
        <div className="header-content">
          TodoList
          <input
            placeholder="Add Todo"
            className='header-input'
            data-test='header-input'
            value={value}
            onChange={e => handleInputChange(e.target.value)}
            onKeyUp={this.handleInputKeyUp}
          />
        </div>
      </div>
    )
  }
}

const mapState = state => {
  return {
    value: state.todo.inputValue
  }
};

const mapDispatch = dispatch => ({
  handleInputChange(value) {
    dispatch(actions.changeInputValue(value));
  }
});

export default connect(mapState, mapDispatch)(Header);
