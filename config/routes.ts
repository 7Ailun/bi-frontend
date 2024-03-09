export default [
  { path: '/welcome', name: '欢迎', icon: 'smile', component: './Welcome' },
  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      { path: '/admin/sub-page', name: '二级管理页', component: './Admin' },
      { path: '/admin/user_list', name: '用户管理', component: './Admin/UserList' },
      { path: '/admin/add_user', name: '添加用户', component: './Admin/AddUser' },
    ],
  },
  {
    path: '/user',
    layout: false,
    routes: [
      { name: '登录', path: '/user/login', component: './User/Login' },
      { name: '注册', path: '/user/register', component: './User/Register' },
    ],
  },
  { path: '/', redirect: '/add_chart' },
  { path: '/add_chart', icon: 'BarChart', name: '智能分析（同步）', component: './AddChart' },
  {
    path: '/add_chart_async', icon: 'BarChart', name: '智能分析（异步）', component: './AddChartAsync',
  },
  { path: '/myChart', icon: 'pieChart', name: '我的图表', component: './MyChart' },

  { path: '/chat/add_chat', icon: 'Question', name: '问题分析', component: './ChatPage/AddChat' },
  { path: '/myChat', icon: 'Message', name: '我的提问', component: './MyChat' },

  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
