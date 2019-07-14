import { statistics } from '../services/statistics';

export default {
  namespace: 'statistics',

  state: {
    visitData: [],
    visitData2: [],
    salesData: [],
    searchData: [],
    offlineData: [],
    offlineChartData: [],
    radarData: [],
    loading: false,
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(statistics);
      yield put({
        type: 'save',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
