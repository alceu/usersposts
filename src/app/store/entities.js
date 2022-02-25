import { createSlice } from '@reduxjs/toolkit';

const createEntitySlice = (sliceName) => {
  const initialState = {
    byId: {},
    allIds: null,
  };
  const reducers = {
    addData: (state, { payload: data }) => {
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

  return slice;
};

const usersSlice = createEntitySlice('users');
export const { addData: addUsers } = usersSlice.actions;

export default {
  users: usersSlice.reducer,
};
