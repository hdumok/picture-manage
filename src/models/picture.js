import { routerRedux } from 'dva/router';

import { pictureCheck, pictureDelete, pictureDetail, pictureList, pictureRecommend } from '../services/picture';

export default {
  namespace: 'picture',

  state: {
    detail: {},
    list: [],
    pagination: {
      total: 0,
      pageSize: 10,
      current: 1,
    },
    condition: {},
  },

  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(pictureList, payload);
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
      const response = yield call(pictureDetail, payload);
      if (response) {  
        yield put({
          type: 'queryDetail',
          payload: response,
        });
      }
    },
    *detailPage({ payload }, { put }) {
      yield put(routerRedux.push({
        pathname: `/picture/detail/${payload.picture_id}`,
      }))
    },
    *check({ payload }, { call, put }) {
      const response = yield call(pictureCheck, payload);
      if (response) {  
        yield put({
          type: 'changeInfo',
          payload: response,
        });
      }
    },
    *recommend({ payload }, { call, put }) {
      const response = yield call(pictureRecommend, payload);
      if (response) {  
        yield put({
          type: 'changeInfo',
          payload: response,
        });
      }
    },
    *delete({ payload }, { call, put, select }) {
      yield call(pictureDelete, payload);
      const { picture } = yield select();
      const response = yield call(pictureList, picture.condition);
      if (response) {  
        yield put({
          type: 'queryList',
          payload: response,
        });
      }
    },
  },

  reducers: {
    queryDetail(state, { payload }) {
      return {
        ...state,
        detail: payload,
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

    changeInfo(state, { payload }) {
      return {
        ...state,
        list: state.list.map(item => {
          if (item.id !== payload.id) {
            return item;
          }
        
          return {
            ...item,
            ...payload,
          }
        }),
        detail: state.detail.id !== payload.id ? state.detail : {
          ...state.detail,
          ...payload,
        },
      };
    },
  },
};
