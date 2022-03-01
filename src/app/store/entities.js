import { createEntitySlice } from 'utils/redux';

const usersSlice = createEntitySlice('users');
export const { addData: addUsers } = usersSlice.actions;

const reducers = {
  users: usersSlice.reducer,
};

export default reducers;
