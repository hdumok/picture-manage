import { Spin } from 'antd';
import pathToRegexp from 'path-to-regexp';
import React, { createElement } from 'react';
import Loadable from 'react-loadable';

import { getMenuData } from './menu';

let routerDataCache;

const getRouterDataCache = app => {
  if (!routerDataCache) {
    routerDataCache = getRouterData(app);
  }
  return routerDataCache;
};

const modelNotExisted = (app, model) =>
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    // 只截取model的名字
    return namespace === model.substring(model.lastIndexOf('/') + 1); 
  });

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // register models
  models.forEach(model => {
    if (modelNotExisted(app, model)) {
      // eslint-disable-next-line
      app.model(require(`../models/${model}`).default);
    }
  });

  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    return props => {
      return createElement(component().default, {
        ...props,
        // 路由信息传导组件里
        routerData: getRouterDataCache(app),
      });
    };
  }
  
  // () => import('module')
  return Loadable({
    loader: () => {
      return component().then(raw => {
        const Component = raw.default || raw;
        return props =>
          createElement(Component, {
            ...props,
            routerData: getRouterDataCache(app),
          });
      });
    },
    loading: () => {
      return <Spin size="large" className="global-spin" />;
    },
  });
};

// 把所有的层级的路由信息打平
function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach(item => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

function findMenuKey(menuData, path) {
  const menuKey = Object.keys(menuData).find(key => pathToRegexp(path).test(key));
  if (menuKey == null) {
    // 匹配到 / 认为没匹配到
    if (path === '/') {
      return null;
    }
    const lastIdx = path.lastIndexOf('/');
    if (lastIdx < 0) {
      return null;
    }
    if (lastIdx === 0) {
      return findMenuKey(menuData, '/');
    }
    // 如果没有，使用上一层的配置, 
    // 比如 /a/b/c 的接口，先找 menu里有没有 /a/b/c 的配置, 没有就找用了 /a/b 的 menu 的配置， 再没有就找 /a 的配置
    // 如果 找到 / 时， munu里没配置 / 的配置， 就返回 null
    // 比如 /story/detail/:id 最后会用 /story 的配置
    return findMenuKey(menuData, path.substr(0, lastIdx));
  }
  return menuKey;
}

export const getRouterData = app => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
    },
    '/dashboard/statistics': {
      component: dynamicWrapper(app, ['statistics'], () => import('../routes/Dashboard/Statistics')),
    }, 
    '/picture/list': {
      component: dynamicWrapper(app, ['picture', 'area'], () => import('../routes/Picture/List')),
    },
    '/picture/detail/:id': {
      component: dynamicWrapper(app, ['picture'], () => import('../routes/Picture/Detail')),
    },
    '/story/list': {
      component: dynamicWrapper(app, ['story'], () => import('../routes/Story/List')),
    },
    '/story/detail/:id': {
      component: dynamicWrapper(app, ['story'], () => import('../routes/Story/Detail')),
    },
    '/activity/list': {
      component: dynamicWrapper(app, ['activity'], () => import('../routes/Activity/List')),
    },
    '/activity/create': {
      component: dynamicWrapper(app, ['activity'], () => import('../routes/Activity/Create')),
    },
    '/activity/detail/:id': {
      component: dynamicWrapper(app, ['activity'], () => import('../routes/Activity/Detail')),
    },
    '/wxuser/list': {
      component: dynamicWrapper(app, ['wxuser'], () => import('../routes/WxUser/List')),
    },
    '/wxuser/detail/:id': {
      component: dynamicWrapper(app, ['wxuser'], () => import('../routes/WxUser/Detail')),
    },
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/user/login': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
    },
    '/error/404': {
      component: dynamicWrapper(app, ['error'], () => import('../routes/Error/404')),
    },
    '/error/500': {
      component: dynamicWrapper(app, ['error'], () => import('../routes/Error/500')),
    },
  };
  
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());

  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData = {};
  // The route matches the menu
  Object.keys(routerConfig).forEach(path => {
    // Regular match item name
    // eg.  router /user/:id === /user/chen
    let menuKey = Object.keys(menuData).find(key => pathToRegexp(path).test(`${key}`));
    const inherited = menuKey == null;
    if (menuKey == null) {
      menuKey = findMenuKey(menuData, path);
    }
    // 获取菜单的配置项
    const menuItem = menuKey ? menuData[menuKey]: {};
    // 获取路由的配置项
    let router = routerConfig[path];

    // 菜单的配置项生效到路由里
    router = {
      ...router,
      name: router.name || menuItem.name,
      // 这就要求，路由要跟着菜单走，否则无法让 router 继承 挂载的 munu 的权限
      authority: router.authority || menuItem.authority,
      // 藏在面包屑里
      hideInBreadcrumb: router.hideInBreadcrumb || menuItem.hideInBreadcrumb,
      // 是否继承 menu
      inherited,
    };
    routerData[path] = router;
  });
  return routerData;
};
