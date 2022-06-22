// import api from 'app/api';
import usersActions from 'app/store/entities/users';

// eslint-disable-next-line import/prefer-default-export
export const fetchData = (index, limit) => (dispatch) =>
  dispatch(usersActions.fetch({ config: { params: { _start: index, _limit: limit } } }));
