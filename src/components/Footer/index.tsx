import {GithubOutlined, YuqueOutlined} from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import '@umijs/max';
import React from 'react';
const Footer: React.FC = () => {
  const defaultMessage = '奇乐编程实验基地';
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'YuQue',
          title: <YuqueOutlined />,
          href: 'https://www.yuque.com/yuhangyuan-vp13i',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/7Ailun',
          blankTarget: true,
        },
        {
          key: '最好的学习圈子',
          title: '最好的学习圈子',
          href: 'https://www.codefather.cn/',
          blankTarget: true,
        },
      ]}
    />
  );
};
export default Footer;
