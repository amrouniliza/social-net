import { createFeatureSelector, createSelector } from '@ngrx/store';
import { adapter, POST_FEATURE_KEY, State } from '../reducers/posts.reducers';

// Lookup the 'Post' feature state managed by NgRx
const selectPostState = createFeatureSelector<State>(POST_FEATURE_KEY);

// get the selectors
const { selectIds, selectAll, selectTotal } = adapter.getSelectors();

// select the array of Post ids
export const selectPostIds = () =>
  createSelector(selectPostState, (state) => selectIds(state));

// select the array of Posts
export const selectAllPosts = createSelector(selectPostState, (state) => {
  return selectAll(state);
});

// select the total Post count
export const selectPostCount = createSelector(selectPostState, (state) =>
  selectTotal(state),
);

// // select the Post by Id
// export const selectPostById = (id: string) =>
//   createSelector(selectAllPosts, (posts) => posts[id]);

// select post loaded flag
export const selectPostLoaded = createSelector(
  selectPostState,
  (state) => state.loaded,
);

export const selectPostLoading = createSelector(
  selectPostState,
  (state) => state.isLoading,
);

// select post error
// export const selectError = createSelector(
//   selectPostState,
//   (state) => state.error,
// );
