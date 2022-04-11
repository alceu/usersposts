import { createEntitySlice } from 'utils/redux';

const slice = createEntitySlice('users');

export const { reducer } = slice;

export default slice.actions;
