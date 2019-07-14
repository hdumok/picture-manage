import request from '../utils/request';

export async function activityDetail(params) {
  return request(`/manage/activity?activity_id=${params.activity_id}`);
}

export async function activityList(params) {
  return request('/manage/activity/list', {
    method: 'POST',
    body: params,
  });
}

export async function activityCreate(params) {
  return request('/manage/activity/create', {
    method: 'POST',
    body: params,
  });
}

export async function activityOnline(params) {
  return request('/manage/activity/online', {
    method: 'POST',
    body: params,
  });
}

export async function activityOffline(params) {
  return request('/manage/activity/offline', {
    method: 'POST',
    body: params,
  });
}