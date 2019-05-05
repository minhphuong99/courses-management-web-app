import React from 'react';
import { Link } from "react-router-dom";
import { Menu, Button, Dropdown } from 'antd';




const UserMenu = (onClickLogout) => {
  return (
    <Menu className="menu__user" >
      <Menu.Item className="menu__user__item" key="0">
        <Link to={`/change-info`}>
          <span className="menu__user__item__title">
            <i className="fas fa-user" />
            <span>Sửa thông tin</span>
          </span>
        </Link>
      </Menu.Item>
      <Menu.Item className="menu__user__item" key="3" onClick={onClickLogout}>
        <Link to="#" >
          <span className="menu__user__item__title">
            <i className="fas fa-beer" />
            <span>Đăng xuất</span>
          </span>
        </Link>
      </Menu.Item>
    </Menu>
  )
}

class DropdownMenuUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDropdown: true
    };
  }

  handleClick = () => {
    this.setState({
      isDropdown: !this.state.isDropdown
    })
  };

  handleBlur = () => {
    this.setState({
      isDropdown: true
    })
  };

  userLogout = () => {
    this.props.handleLogout();
  };

  render() {
    return (
      <Dropdown
        overlay={UserMenu(this.userLogout)}
        trigger={['click']}
      >
        <Button shape="circle" icon="user" size="large" onClick={this.handleClick} onBlur={this.handleBlur} />
      </Dropdown>
    )
  }
}

export default DropdownMenuUser;