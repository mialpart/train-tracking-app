import React, { Component } from "react";
import { Dropdown, Menu } from "semantic-ui-react";
import { NavLink, withRouter } from "react-router-dom";
import trainImage from "./../../assets/images/train-tunnel.svg";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { useTranslation, withTranslation } from "react-i18next";
import { updateLanguage } from "../../store/features/trainSlicer";
import { Localization } from "../../utils/i18n-helper";

import "./NavBar.css";

const langOptions = [
  {
    value: "FI",
    text: "FI",
    key: "FI",
  },
  {
    value: "EN",
    text: "EN",
    key: "EN",
  },
];

function LangDropDown(props) {
  const { t, i18n } = useTranslation();
  const changeLanguageHandler = (event, { value }) => {
    i18n.changeLanguage(value);
  };
  return (
    <Dropdown
      className="dropdown-lang"
      onChange={changeLanguageHandler}
      placeholder="Valitse kieli"
      options={langOptions}
    />
  );
}

class NavBar extends Component {
  state = { activeItem: "map" };
  
  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name });
  };

  render() {
    const { activeItem } = this.state;
    const { t } = this.props;
    console.log(t)
    console.log(t('map'))
    return (
      <div>
        <Menu
          pointing
          secondary
          inverted
          color="red"
          key="red"
          className="nav-bar"
        >
          <img alt="train" src={trainImage}></img>
          <Menu.Item
            className="menu-item"
            as={NavLink}
            to="/map"
            name={t('map')}
            active={activeItem === "map"}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            className="menu-item"
            as={NavLink}
            to="/timetable"
            name={t('timetable')}
            active={activeItem === "timetable"}
            onClick={this.handleItemClick}
          />
          <Menu.Item className="menu-item">
            <LangDropDown
            ></LangDropDown>
          </Menu.Item>
          {/* Toistaiseksi piiloon           
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
          */}
        </Menu>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      updateLanguage: updateLanguage,
    },
    dispatch
  );
}

function mapStateToProps(state) {
  return {
    language: state.language,
  };
}
export default (connect(mapStateToProps, mapDispatchToProps),withTranslation())(NavBar);
