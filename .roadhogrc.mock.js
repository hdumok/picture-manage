import { delay } from 'roadhog-api-doc';

// 是否禁用代理
const local = process.env.LOCAL === 'true';

const host = local ? 'http://127.0.0.1:7001' : 'http://xxxxx.com'
// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
  'GET /manage/(.*)': `${host}/manage/`,
  'POST /manage/(.*)': `${host}/manage/`,
};

export default delay(proxy);
