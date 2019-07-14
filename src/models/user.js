import { userInfo } from '../services/user';

export default {
  namespace: 'user',

  state: {},

  effects: {
    *info(_, { call, put }) {
      const response = yield call(userInfo);
      yield put({
        type: 'saveUser',
        payload: response,
      });
    },
  },

  reducers: {
    saveUser(state, { payload }) {
      return {
        ...payload,
      };
    },
  },
};
