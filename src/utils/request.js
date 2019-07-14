import { notification } from 'antd';
import fetch from 'dva/fetch';
import { routerRedux } from 'dva/router';

import store from '..';

const codeMessage = {
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  notification.error({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: errortext,
  });
  const error = new Error(errortext);
  error.code = response.status;
  error.response = response;
  throw error;
}

function parseJSON(response) {
  return response.json();
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [opts] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, opts) {
  const defaultOptions = {
    credentials: 'include',
  };
  const options = { ...defaultOptions, ...opts };
  if (options.method === 'POST' || options.method === 'PUT' || options.method === 'DELETE') {
    if (!(options.body instanceof FormData)) {
      options.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...options.headers,
      };
      options.body = JSON.stringify(options.body);
    } else {
      options.headers = {
        Accept: 'application/json',
        ...options.headers,
      };
    }
  }

  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON)
    .then(response => {
      const { dispatch } = store;
      switch (response.code) {
        case 200:
          return response.data;
        case 401:
          dispatch(routerRedux.push('/user/login'));
          break;
        case 400:
        case 403:
        case 422:
          notification.error({
            message: response.message,
          });
          break;
        case 404:
          dispatch(routerRedux.push('/exception/404'));
          break;
        default:
          dispatch(routerRedux.push('/exception/500'));
      }
    })
    .catch(error => {
      const { dispatch } = store;
      switch (error.code) {
        case 401:
          dispatch(routerRedux.push('/user/login'));
          break;
        case 404:
          dispatch(routerRedux.push('/exception/404'));
          break;
        default:
          dispatch(routerRedux.push('/exception/500'));
      }
    });
}
