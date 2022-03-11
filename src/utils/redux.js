import { createSlice } from '@reduxjs/toolkit';

// eslint-disable-next-line import/prefer-default-export
export function createEntitySlice(sliceName) {
  const initialState = {
    byId: {},
    allIds: null,
  };
  const reducers = {
    merge: (state, { payload: data }) => {
      if (!state.allIds) {
        state.allIds = [];
      }
      const { byId, allIds } = state;

      const set = (item) => {
        const entity = byId[item.id];
        if (!entity) {
          byId[item.id] = item;
          allIds.push(item.id);
        } else {
          Object.assign(entity, item);
        }
      };

      if (!Array.isArray(data)) {
        set(data);
      } else {
        data.forEach((item) => {
          set(item);
        });
      }
    },
  };

  const slice = createSlice({
    name: sliceName,
    initialState,
    reducers,
  });

  slice.actions.addData = (data) => (dispatch) => {
    dispatch(slice.actions.merge(data));
    return Promise.resolve(data.map((item) => item.id));
  };

  return slice;
}
