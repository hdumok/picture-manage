import { routerRedux } from 'dva/router';

import { userLogin } from '../services/user';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: undefined,
    authority: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(userLogin, payload);
      if (response) {  
        yield put({
          type: 'changeLoginStatus',
          payload: {
            authority: 'admin',
            status: true,
          },
        });
        // Login successfully
        reloadAuthorized();
        yield put(routerRedux.replace('/'));
      }
    },
    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          authority: 'guest',
          status: false,
        },
      });
      reloadAuthorized();
      yield put(routerRedux.push('/user/login'));
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.authority);
      return {
        ...state,
        status: payload.status,
        authority: payload.authority,
        response: payload.response,
      };
    },
  },
};
