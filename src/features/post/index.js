import api from 'app/api';
import { addPosts } from 'app/store/entities';

const endpoint = '/posts';

export const fetchList = (userId) => (dispatch) =>
  api.get(`${endpoint}?userId=${userId}`).then((response) => {
    const { data: posts } = response;

    return dispatch(addPosts(posts));
  });
