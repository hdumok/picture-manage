import request from '../utils/request';

export async function pictureDetail(params) {
  return request(`/manage/picture?picture_id=${params.picture_id}`);
}

export async function pictureList(params) {
  return request('/manage/picture/list', {
    method: 'POST',
    body: params,
  });
}

export async function pictureCheck(params) {
  return request('/manage/picture/check', {
    method: 'POST',
    body: params,
  });
}

export async function pictureRecommend(params) {
  return request('/manage/picture/recommend', {
    method: 'POST',
    body: params,
  });
}

export async function pictureDelete(params) {
  return request('/manage/picture/delete', {
    method: 'POST',
    body: params,
  });
}