import api from 'app/api';
import { addUsers } from 'app/store/entities';

const endpoint = '/users';

// eslint-disable-next-line import/prefer-default-export
export const fetchList = () => (dispatch) =>
  api.get(endpoint).then((response) => {
    const { data: users } = response;

    return dispatch(addUsers(users));
  });
