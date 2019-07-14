import { routerRedux } from 'dva/router';

export default {
  namespace: 'error',

  state: {},

  effects: {
    *query({ payload }, { put }) {
      // redirect on client when network broken
      yield put(routerRedux.push(`/exception/${payload.code}`));
    },
  },

  reducers: {},
};
