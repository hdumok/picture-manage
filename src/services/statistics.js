import request from '../utils/request';

export async function statistics() {
  return request('/manage/statistics');
}