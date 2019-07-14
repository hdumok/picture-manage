import request from '../utils/request';

export async function storyDetail(params) {
  return request(`/manage/story?story_id=${params.story_id}`);
}

export async function storyList(params) {
  return request('/manage/story/list', {
    method: 'POST',
    body: params,
  });
}

export async function storyCheck(params) {
  return request('/manage/story/check', {
    method: 'POST',
    body: params,
  });
}

export async function storyDelete(params) {
  return request('/manage/story/delete', {
    method: 'POST',
    body: params,
  });
}
