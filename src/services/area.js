import request from '../utils/request';

export async function areaDetail(params) {
  return request(`/manage/area?code=${params.code}`);
}