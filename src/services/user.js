import request from '../utils/request';

export async function userLogin(params) {
  return request('/manage/user/login', {
    method: 'POST',
    body: params,
  });
}

export async function userInfo() {
  return request('/manage/user');
}
