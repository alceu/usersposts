import postsActions from 'app/store/entities/posts';
import usersActions from 'app/store/entities/users';

// eslint-disable-next-line import/prefer-default-export
export const fetchData = (userId, index, limit) => (dispatch) =>
  Promise.all([
    dispatch(usersActions.checkIds([userId])),
    dispatch(postsActions.fetch({ config: { params: { userId, _start: index, _limit: limit } } })),
  ]);
