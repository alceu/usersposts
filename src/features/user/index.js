import { createSlice } from '@reduxjs/toolkit';
import api from 'app/api';
import { addUsers } from 'app/store/entities';

const initialState = {
  selected: null,
};

export const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setSelected: (state, { payload: selected = null }) => {
      state.selected = selected;
    },
  },
});

export const { setSelected } = slice.actions;

const endpoint = '/users';

export const fetchList = () => (dispatch) =>
  api.get(endpoint).then((response) => {
    const { data: users } = response;

    return dispatch(addUsers(users));
  });

export default slice.reducer;
