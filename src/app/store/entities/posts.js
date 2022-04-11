import { createEntitySlice } from 'utils/redux';

const slice = createEntitySlice('posts');

export const { reducer } = slice;

export default slice.actions;
