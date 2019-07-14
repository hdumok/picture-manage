import { isUrl } from '../utils/utils';

const menuData = [
  // {
  //   name: 'dashboard',
  //   icon: 'dashboard',
  //   path: 'dashboard',
  //   children: [
  //     {
  //       name: '分析页',
  //       path: 'statistics',
  //     },
  //   ],
  // },
  {
    name: '作品管理',
    icon: 'table',
    path: 'picture',
    children: [
      {
        name: '作品列表',
        path: 'list',
      },
    ],
  },
  {
    name: '故事管理',
    icon: 'table',
    path: 'story',
    children: [
      {
        name: '故事列表',
        path: 'list',
      },
    ],
  },
  {
    name: '活动管理',
    icon: 'table',
    path: 'activity',
    children: [
      {
        name: '活动列表',
        path: 'list',
      },
    ],
  },
  {
    name: '用户管理',
    icon: 'table',
    path: 'wxuser',
    children: [
      {
        name: '用户列表',
        path: 'list',
      },
    ],
  },
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
