const path = require('path');

export default {
  entry: 'src/index.js',
  // 来进行按需加载，加入这个插件后。你可以仍然这么写：import { Button } from 'antd';
  extraBabelPlugins: [['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }]],
  env: {
    // 开发环境下 使用 dva 热加载
    development: {
      extraBabelPlugins: ['dva-hmr'],
    },
  },
  externals: {
    // 蚂蚁金服数据可视化解决方案
    '@antv/data-set': 'DataSet',
  },
  alias: {
    components: path.resolve(__dirname, 'src/components/'),
  },
  ignoreMomentLocale: true,
  theme: './src/theme.js',
  html: {
    template: './src/index.ejs',
  },
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableDynamicImport: true,
  publicPath: '/',
  hash: true,
};
