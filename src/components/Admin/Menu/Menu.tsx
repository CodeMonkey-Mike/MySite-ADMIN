// Common part
import React, { useState } from 'react';
import { Menu } from 'antd';
import {
  AppstoreAddOutlined,
  EditOutlined,
  GlobalOutlined,
  HistoryOutlined,
  MailOutlined,
  ReadOutlined,
  SettingOutlined,
  TableOutlined,
  TrophyOutlined,
  UserOutlined,
  YoutubeOutlined,
  ApartmentOutlined,
} from '@ant-design/icons';
import Link from 'next/link';

export const MainMenu = () => {
  const [current, setCurrent] = useState(1);
  const onSetCurrent = (k) => setCurrent(k);
  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[current.toString()]}
      defaultOpenKeys={['s1', 's2']}
    >
      <Menu.Item onClick={({ key }) => onSetCurrent(key)} key="1" icon={<UserOutlined />}>
        <Link href="/">About Me</Link>
      </Menu.Item>
      <Menu.SubMenu title="Automation" key="s2" icon={<EditOutlined />}>
        <Menu.Item onClick={({ key }) => onSetCurrent(key)} key="19" icon={<ApartmentOutlined />}>
          <Link href="/poll">Poll</Link>
        </Menu.Item>
        <Menu.Item onClick={({ key }) => onSetCurrent(key)} key="20" icon={<ApartmentOutlined />}>
          <Link href="/carousel">Carousel</Link>
        </Menu.Item>
        <Menu.Item onClick={({ key }) => onSetCurrent(key)} key="21" icon={<ApartmentOutlined />}>
          <Link href="/carousel-topic">Carousel Topics</Link>
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.Item onClick={({ key }) => onSetCurrent(key)} key="18" icon={<ApartmentOutlined />}>
        <Link href="/sitemap">Sitemap</Link>
      </Menu.Item>
      <Menu.Item key="2" onClick={({ key }) => onSetCurrent(key)} icon={<TableOutlined />}>
        <Link href="/skill">My Skills</Link>
      </Menu.Item>
      <Menu.Item onClick={({ key }) => onSetCurrent(key)} key="3" icon={<ReadOutlined />}>
        <Link href="/education">Education</Link>
      </Menu.Item>
      <Menu.Item onClick={({ key }) => onSetCurrent(key)} key="4" icon={<SettingOutlined />}>
        <Link href="/process">Process</Link>
      </Menu.Item>
      <Menu.Item onClick={({ key }) => onSetCurrent(key)} key="5" icon={<HistoryOutlined />}>
        <Link href="/experience">Work Experience</Link>
      </Menu.Item>
      <Menu.Item onClick={({ key }) => onSetCurrent(key)} key="6" icon={<AppstoreAddOutlined />}>
        <Link href="/service">Service</Link>
      </Menu.Item>
      <Menu.Item onClick={({ key }) => onSetCurrent(key)} key="7" icon={<TableOutlined />}>
        <Link href="/portfolio">Portfolio</Link>
      </Menu.Item>
      <Menu.Item onClick={({ key }) => onSetCurrent(key)} key="8" icon={<UserOutlined />}>
        <Link href="/testimonial">Testimonials</Link>
      </Menu.Item>
      <Menu.Item onClick={({ key }) => onSetCurrent(key)} key="9" icon={<TrophyOutlined />}>
        <Link href="/award">Awards</Link>
      </Menu.Item>
      <Menu.Item onClick={({ key }) => onSetCurrent(key)} key="10" icon={<GlobalOutlined />}>
        <Link href="/channel">Social Channels</Link>
      </Menu.Item>
      <Menu.Item onClick={({ key }) => onSetCurrent(key)} key="12" icon={<YoutubeOutlined />}>
        <Link href="/video">Video</Link>
      </Menu.Item>
      <Menu.Item onClick={({ key }) => onSetCurrent(key)} key="13" icon={<MailOutlined />}>
        <Link href="/newsletter">Newsletter</Link>
      </Menu.Item>
      <Menu.Item onClick={({ key }) => onSetCurrent(key)} key="17" icon={<MailOutlined />}>
        <Link href="/topics">Topics</Link>
      </Menu.Item>
      <Menu.Item onClick={({ key }) => onSetCurrent(key)} key="14" icon={<YoutubeOutlined />}>
        <Link href="/youtubes">Youtubes</Link>
      </Menu.Item>
      <Menu.SubMenu title="Blog" key="s1" icon={<EditOutlined />}>
        <Menu.Item onClick={({ key }) => onSetCurrent(key)} key="15">
          <Link href="/blog">Posts</Link>
        </Menu.Item>
        <Menu.Item onClick={({ key }) => onSetCurrent(key)} key="16">
          <Link href="/tags">Tags</Link>
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.Item onClick={({ key }) => onSetCurrent(key)} key="11" icon={<EditOutlined />}>
        <Link href="/change-password">Change Password</Link>
      </Menu.Item>
      {/* <Box p={2}>
        <Button size="medium" variant="primary">
          Logout
        </Button>
      </Box> */}
    </Menu>
  );
};
