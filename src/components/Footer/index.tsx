import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import '@umijs/max';
import React from 'react';
const Footer: React.FC = () => {
  const defaultMessage = '进击的艾伦出品';
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: '语雀',
          title: '艾伦语雀知识库',
          href: 'https://www.yuque.com/yuhangyuan-vp13i',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/7Ailun?tab=repositories',
          blankTarget: true,
        },
        {
          key: 'Blog',
          title: '艾伦的编程小屋',
          href: 'https://ailuncc.top/',
          blankTarget: true,
        },
      ]}
    />
  );
};
export default Footer;
