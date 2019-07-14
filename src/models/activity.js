import { routerRedux } from 'dva/router';

import { activityCreate, activityDetail, activityList, activityOffline, activityOnline } from '../services/activity';

export default {
  namespace: 'activity',

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
      const response = yield call(activityList, payload);
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
      const response = yield call(activityDetail, payload);
      if (response){
        yield put({
          type: 'queryDetail',
          payload: response,
        });
      }
    },
    *detailPage({ payload }, { put }) {
      yield put(routerRedux.push({
        pathname: `/activity/detail/${payload.activity_id}`,
      }))
    },
    *create({ payload }, { call, put }) {
      const response = yield call(activityCreate, payload);
      if (response) {
        yield put(routerRedux.push({
          pathname: `/activity/list`,
        }))
      }
    },

    *createPage(_, { put }) {
      yield put(routerRedux.push({
        pathname: `/activity/create`,
      }))
    },
    *online({ payload }, { call, put }) {
      const response = yield call(activityOnline, payload);
      if (response) {
        yield put({
          type: 'changeOnline',
          payload: response,
        });
      }
    },
    *offline({ payload }, { call, put }) {
      const response = yield call(activityOffline, payload);
      if(response){
        yield put({
          type: 'changeOnline',
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
    
    changeOnline(state, { payload }) {  
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
