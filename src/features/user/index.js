// import api from 'app/api';
import usersActions from 'app/store/entities/users';

// eslint-disable-next-line import/prefer-default-export
export const fetchList = () => (dispatch) => dispatch(usersActions.fetch());
