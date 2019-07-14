import request from '../utils/request';

export async function wxuserDetail(params) {
  return request(`/manage/wxuser?user_id=${params.user_id}`);
}

export async function wxuserTotel() {
  return request('/manage/wxuser/totel');
}

export async function wxuserList(params) {
  return request('/manage/wxuser/list', {
    method: 'POST',
    body: params,
  });
}