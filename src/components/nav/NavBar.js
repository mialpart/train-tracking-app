import React, { Component } from 'react';
import { Input, Menu } from 'semantic-ui-react';
import { NavLink, withRouter } from 'react-router-dom';
import trainImage from './../../assets/images/train-tunnel.svg';

import './NavBar.css';

export default class MenuExampleSecondary extends Component {
  state = { activeItem: 'home' }

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name })
  }

  render() {
    const { activeItem } = this.state

    return (
      <div >
        <Menu pointing secondary inverted color='red' key='red' className='nav-bar'>
          <img alt="train" src={trainImage}></img>
          <Menu.Item className='menu-item'
            as={NavLink} to="/home"
            name='home'
            active={activeItem === 'home'}
            onClick={this.handleItemClick}
          />
          <Menu.Item className='menu-item'
            as={NavLink} to="/about"
            name='about'
            active={activeItem === 'about'}
            onClick={this.handleItemClick}
          />
          <Menu.Item className='menu-item'
            as={NavLink} to="/profile"
            name='my profile'
            active={activeItem === 'profile'}
            onClick={this.handleItemClick}
          />
        </Menu>
      </div>
    )
  }
}