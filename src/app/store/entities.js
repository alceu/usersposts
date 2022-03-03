import { createEntitySlice } from 'utils/redux';

const usersSlice = createEntitySlice('users');
export const { addData: addUsers } = usersSlice.actions;

const postsSlice = createEntitySlice('posts');
export const { addData: addPosts } = postsSlice.actions;

const reducers = {
  users: usersSlice.reducer,
  posts: postsSlice.reducer,
};

export default reducers;
