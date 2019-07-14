import { areaDetail } from '../services/area';

export default {
  namespace: 'area',

  state: {
    name: '',
    children: [],
  },

  effects: {
    *shenzhen(_, { call, put }) {     
      const response = yield call(areaDetail, { code: "4403" });
      if (response){
        yield put({
          type: 'saveArea',
          payload: response,
        });
      }
    },
  },

  reducers: {
    saveArea(_, { payload }) {
      return {
        ...payload,
      };
    },
  },
};
