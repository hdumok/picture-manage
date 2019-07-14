import { routerRedux } from 'dva/router';

import { storyCheck, storyDelete, storyDetail, storyList } from '../services/story';

export default {
  namespace: 'story',

  state: {
    detail: {
      images: [],
    },
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
      const response = yield call(storyList, payload);
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
      const response = yield call(storyDetail, payload);
      if (response) {  
        yield put({
          type: 'queryDetail',
          payload: response,
        });
      }
    },
    *detailPage({ payload }, { put }) {
      yield put(routerRedux.push({
        pathname: `/story/detail/${payload.story_id}`,
      }))
    },
    *check({ payload }, { call, put }) {
      const response = yield call(storyCheck, payload);
      if (response) {  
        yield put({
          type: 'changeInfo',
          payload: response,
        });
      }
    },

    *delete({ payload }, { call, put, select }) {
      yield call(storyDelete, payload);
      const { story } = yield select();
      const response = yield call(storyList, story.condition);
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
