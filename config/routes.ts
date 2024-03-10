export default [
  { path: '/', name: '主页', icon: 'Bank', component: './Index' },
  {
    path: '/interface_info/:id',
    name: '查看接口',
    icon: 'smile',
    component: './InterfaceInfo',
    hideInMenu: true,
  },
  {
    path: '/user',
    layout: false,
    routes: [
      { name: '登录', path: '/user/login', component: './User/Login' },
      { name: '注册', path: '/user/register', component: './User/Register' },
    ],
  },

  {
    path: '/admin',
    name: '接口管理',
    icon: 'ImportOutlined',
    access: 'canAdmin',
    routes: [
      {
        name: '接口列表',
        icon: 'table',
        path: '/admin/interface_info',
        component: './Admin/InterfaceInfo',
      },
      {
        name: '接口分析',
        icon: 'analysis',
        path: '/admin/analysis/interface_info',
        component: './Admin/Analysis',
      },
    ],
  },
  { name: '个人中心', icon: '', path: '/user/center', component: './User/UserInfo' },

  // { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
