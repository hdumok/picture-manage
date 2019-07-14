import { routerRedux } from 'dva/router';

import { wxuserDetail, wxuserList, wxuserTotel } from '../services/wxuser';

export default {
  namespace: 'wxuser',

  state: {
    detail: {},
    list: [],
    pagination: {
      total: 0,
      pageSize: 10,
      current: 1,
    },
    condition: {},
    totel: {
      all_user: 0,
      mounth_user: 0,
      day_user: 0,
    },
  },

  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(wxuserList, payload);
      if (response) {
        yield put({
          type: 'saveCondition',
          payload,
        });
        yield put({
          type: 'queryList',
          payload: response,
        });
      }
    },
    *detail({ payload }, { call, put }) {     
      const response = yield call(wxuserDetail, payload);
      if (response){
        yield put({
          type: 'queryDetail',
          payload: response,
        });
      }
    },
    *totel({ payload }, { call, put }) {     
      const response = yield call(wxuserTotel, payload);
      if (response){
        yield put({
          type: 'queryTotel',
          payload: response,
        });
      }
    },
    *detailPage({ payload }, { put }) {
      yield put(routerRedux.push({
        pathname: `/wxuser/detail/${payload.author_id}`,
      }))
    },
  },

  reducers: {
    queryDetail(state, { payload }) {
      return {
        ...state,
        detail: payload,
      };
    },
    queryTotel(state, { payload }) {
      return {
        ...state,
        totel: payload,
      };
    },
    queryList(state, { payload }) {
      return {
        ...state,
        list: payload.rows,
        pagination: {
          total: payload.count,
          pageSize: payload.pageSize,
          current: payload.page,
        },
      };
    },
    saveCondition(state, { payload }) {
      return {
        ...state,
        condition: payload,
      };
    },
  },
};
