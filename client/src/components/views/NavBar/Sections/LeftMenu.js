import React from 'react';
import { Menu } from 'antd';
import MenuItem from 'antd/lib/menu/MenuItem';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

function LeftMenu(props) {
  return (
    <Menu mode={props.mode}>
    <Menu.Item key="mail">
      <a href="/">Home</a>
    </Menu.Item>
    <Menu.Item key="favourite">
      <a href="/favourite">Favourite</a>
    </Menu.Item>
    <SubMenu title = {<span>Movies</span>}>
      <Menu.Item key="top_rated"><a href="/by/top_rated">Top Rated</a></Menu.Item>
      <Menu.Item key="upcoming"><a href="/by/upcoming">Upcoming</a></Menu.Item>
      <Menu.Item key="popular"><a href="/by/popular">Popular</a></Menu.Item>
    </SubMenu>
    {/* <SubMenu title={<span>Blogs</span>}>
      <MenuItemGroup title="Item 1">
        <Menu.Item key="setting:1">Option 1</Menu.Item>
        <Menu.Item key="setting:2">Option 2</Menu.Item>
      </MenuItemGroup>
      <MenuItemGroup title="Item 2">
        <Menu.Item key="setting:3">Option 3</Menu.Item>
        <Menu.Item key="setting:4">Option 4</Menu.Item>
      </MenuItemGroup>
    </SubMenu> */}
  </Menu>
  )
}

export default LeftMenu