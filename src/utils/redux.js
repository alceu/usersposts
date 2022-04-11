import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

// eslint-disable-next-line import/prefer-default-export
export function createEntitySlice(sliceName) {
  const entityAdapter = createEntityAdapter();

  const reducers = {
    addOne: entityAdapter.addOne,
    addMany: entityAdapter.addMany,
    setOne: entityAdapter.setOne,
    setMany: entityAdapter.setMany,
    setAll: entityAdapter.setAll,
    updateOne: entityAdapter.updateOne,
    updateMany: entityAdapter.updateMany,
    upsertOne: entityAdapter.upsertOne,
    upsertMany: entityAdapter.upsertMany,
    removeOne: entityAdapter.removeOne,
    removeMany: entityAdapter.removeMany,
    removeAll: entityAdapter.removeAll,

    addFetchingIds: (state, { payload: ids }) => {
      state.fetchingIds = [...new Set([...state.fetchingIds, ...ids])];
    },
    removeFetchingIds: (state, { payload: ids }) => {
      state.fetchingIds = state.fetchingIds.filter((id) => !ids.includes(id));
    },
  };

  const slice = createSlice({
    name: sliceName,
    initialState: entityAdapter.getInitialState({
      fetchingIds: [],
    }),
    reducers,
  });

  const { addFetchingIds, removeFetchingIds, upsertOne, upsertMany } = slice.actions;

  slice.actions.fetch =
    ({ ids = [], config = {} } = {}) =>
    (dispatch, _getState, api) => {
      if (ids.length > 0) {
        dispatch(addFetchingIds(ids));
      }

      let url = `/${sliceName}`;
      const fetchConfig = { ...config };
      if (ids.length > 1) {
        fetchConfig.params = { ...fetchConfig.params, id: ids };
      } else if (ids.length > 0) {
        url = `${url}/${[ids]}`;
      }

      return api.get(url, fetchConfig).then(({ data }) => {
        if (ids.length > 0) {
          dispatch(removeFetchingIds(ids));
        }
        dispatch(Array.isArray(data) ? upsertMany(data) : upsertOne(data));

        return Promise.resolve(Array.isArray(data) ? data.map((entity) => entity.id) : [data.id]);
      });
    };

  slice.actions.checkIds = (checkingIds) => (dispatch, getState) => {
    const {
      entities: {
        [sliceName]: { ids, fetchingIds },
      },
    } = getState();

    const toFetch = checkingIds.filter((id) => !ids.includes(id)).filter((id) => !fetchingIds.includes(id));

    let response;
    if (toFetch.length > 0) {
      response = dispatch(slice.actions.fetch({ ids: toFetch }));
    } else {
      response = Promise.resolve([]);
    }

    return response;
  };

  return slice;
}
