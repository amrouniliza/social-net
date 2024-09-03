import { Action, createReducer, on } from '@ngrx/store';
import { HttpError, Post } from '../../../models';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { postsActions } from '../actions/posts.actions';

export const POST_FEATURE_KEY = 'post';

export interface State extends EntityState<Post> {
  isLoading: boolean;
  loaded: boolean;
  error: HttpError | null;
}

export const adapter: EntityAdapter<Post> = createEntityAdapter<Post>({
  // In this case this would be optional since primary key is id
  //   selectId: (post) => post.id,
});

const { selectAll } = adapter.getSelectors();

export interface PostPartialState {
  readonly [POST_FEATURE_KEY]: State;
}

export const initialState: State = adapter.getInitialState({
  // Additional entity state properties
  isLoading: false,
  loaded: false,
  error: null,
});

const _reducer = createReducer(
  initialState,
  on(postsActions.loadPosts, (state): State => {
    return { ...state, isLoading: true };
  }),
  on(postsActions.loadPostsSuccess, (state, { posts }) => {
    return adapter.setAll(posts, { ...state, loaded: true, isLoading: false });
  }),
  on(postsActions.loadPostsFailure, (state, { error }): State => {
    return { ...state, error, loaded: false, isLoading: false };
  }),
  on(postsActions.loadPostsByAuthor, (state): State => {
    return { ...state, isLoading: true };
  }),
  on(postsActions.loadPostsByAuthorSuccess, (state, { posts }) => {
    return adapter.setAll(posts, { ...state, loaded: true, isLoading: false });
  }),
  on(postsActions.loadPostsByAuthorFailure, (state, { error }): State => {
    return { ...state, error, loaded: false, isLoading: false };
  }),
  on(postsActions.loadPost, (state): State => {
    return { ...state, isLoading: true };
  }),
  on(postsActions.loadPostSuccess, (state, { post }) => {
    return adapter.addOne(post, { ...state, loaded: true, isLoading: false });
  }),
  on(postsActions.loadPostFailure, (state, { error }): State => {
    return { ...state, error, loaded: false, isLoading: false };
  }),
  on(postsActions.createPost, (state): State => {
    return { ...state, isLoading: true };
  }),
  on(postsActions.createPostSuccess, (state, { post }) => {
    return adapter.setAll([post, ...selectAll(state)], {
      ...state,
      loaded: true,
      isLoading: false,
    });
  }),
  on(postsActions.createPostFailure, (state, { error }): State => {
    return { ...state, error, loaded: false, isLoading: false };
  }),
  on(postsActions.updatePost, (state): State => {
    return { ...state, isLoading: true };
  }),
  on(postsActions.updatePostSuccess, (state, { post }) => {
    return adapter.updateOne(
      { id: post.id, changes: post },
      { ...state, isLoading: false, loaded: true },
    );
  }),
  on(postsActions.updatePostFailure, (state, { error }): State => {
    return { ...state, error, loaded: false, isLoading: false };
  }),
  on(postsActions.likePost, (state): State => {
    return { ...state, isLoading: true };
  }),
  on(postsActions.likePostSuccess, (state, { post, like }) => {
    return adapter.updateOne(
      {
        id: post.id,
        changes: { hasUserLiked: true, likes: [...post.likes, like] },
      },
      { ...state, isLoading: false, loaded: true },
    );
  }),
  on(postsActions.likePostFailure, (state, { error }): State => {
    return { ...state, error, loaded: false, isLoading: false };
  }),
  on(postsActions.unlikePost, (state): State => {
    return { ...state, isLoading: true };
  }),
  on(postsActions.unlikePostSuccess, (state, { post, like }) => {
    return adapter.updateOne(
      {
        id: post.id,
        changes: {
          hasUserLiked: false,
          likes: post.likes.filter((l) => l.id !== like.id),
        },
      },
      { ...state, isLoading: false, loaded: true },
    );
  }),
  on(postsActions.unlikePostFailure, (state, { error }): State => {
    return { ...state, error, loaded: false, isLoading: false };
  }),
  on(postsActions.commentPost, (state): State => {
    return { ...state, isLoading: true };
  }),
  on(postsActions.commentPostSuccess, (state, { post, comment }) => {
    return adapter.updateOne(
      {
        id: post.id,
        changes: { comments: [...post.comments, comment] },
      },
      { ...state, isLoading: false, loaded: true },
    );
  }),
  on(postsActions.commentPostFailure, (state, { error }): State => {
    return { ...state, error, loaded: false, isLoading: false };
  }),
  on(postsActions.deletePost, (state): State => {
    return { ...state, isLoading: true };
  }),
  on(postsActions.deletePostSuccess, (state, { id }) => {
    return adapter.removeOne(id, { ...state, loaded: true, isLoading: false });
  }),
  on(postsActions.deletePostFailure, (state, { error }): State => {
    return { ...state, error, loaded: false, isLoading: false };
  }),
  on(postsActions.deleteComment, (state): State => {
    return { ...state, isLoading: true };
  }),
  on(postsActions.deleteCommentSuccess, (state, { post, comment }) => {
    return adapter.updateOne(
      {
        id: post.id,
        changes: {
          comments: post.comments.filter((c) => c.id !== comment.id),
        },
      },
      { ...state, isLoading: false, loaded: true },
    );
  }),
  on(postsActions.deleteCommentFailure, (state, { error }): State => {
    return { ...state, error, loaded: false, isLoading: false };
  }),
);

export function reducer(state: State | undefined, action: Action) {
  return _reducer(state, action);
}
