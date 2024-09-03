import { createAction, props } from '@ngrx/store';
import {
  Comment,
  CreateCommentDto,
  CreatePostDto,
  HttpError,
  Like,
  Post,
} from '../../../models';

// prettier-ignore
export enum PostActionTypes {
  LOAD_POSTS                   = '[Posts] Load Posts',
  LOAD_POSTS_SUCCESS           = '[Posts] Load Posts Success',
  LOAD_POSTS_FAILURE           = '[Posts] Load Posts Failure',
  LOAD_POSTS_BY_AUTHOR         = '[Posts] Load Posts By Author',
  LOAD_POSTS_BY_AUTHOR_SUCCESS = '[Posts] Load Posts By Author Success',
  LOAD_POSTS_BY_AUTHOR_FAILURE = '[Posts] Load Posts By Author Failure',
  LOAD_POST                    = '[Posts] Load Post',
  LOAD_POST_SUCCESS            = '[Posts] Load Post Success',
  LOAD_POST_FAILURE            = '[Posts] Load Post Failure',
  CREATE_POST                  = '[Posts] Create Post',
  CREATE_POST_SUCCESS          = '[Posts] Create Post Success',
  CREATE_POST_FAILURE          = '[Posts] Create Post Failure',
  LIKE_POST                    = '[Posts] Like Post',
  LIKE_POST_SUCCESS            = '[Posts] Like Post Success',
  LIKE_POST_FAILURE            = '[Posts] Like Post Failure',
  UNLIKE_POST                  = '[Posts] Unlike Post',
  UNLIKE_POST_SUCCESS          = '[Posts] Unlike Post Success',
  UNLIKE_POST_FAILURE          = '[Posts] Unlike Post Failure',
  COMMENT_POST                 = '[Posts] Comment Post',
  COMMENT_POST_SUCCESS         = '[Posts] Comment Post Success',
  COMMENT_POST_FAILURE         = '[Posts] Comment Post Failure',
  UPDATE_POST                  = '[Posts] Update Post',
  UPDATE_POST_SUCCESS          = '[Posts] Update Post Success',
  UPDATE_POST_FAILURE          = '[Posts] Update Post Failure',
  DELETE_POST                  = '[Posts] Delete Post',
  DELETE_POST_SUCCESS          = '[Posts] Delete Post Success',
  DELETE_POST_FAILURE          = '[Posts] Delete Post Failure',
}

export const loadPosts = createAction(PostActionTypes.LOAD_POSTS);

export const loadPostsSuccess = createAction(
  PostActionTypes.LOAD_POSTS_SUCCESS,
  props<{ posts: Post[] }>(),
);

export const loadPostsFailure = createAction(
  PostActionTypes.LOAD_POSTS_FAILURE,
  props<{ error: HttpError }>(),
);

export const loadPostsByAuthor = createAction(
  PostActionTypes.LOAD_POSTS_BY_AUTHOR,
  props<{ authorId: string }>(),
);

export const loadPostsByAuthorSuccess = createAction(
  PostActionTypes.LOAD_POSTS_BY_AUTHOR_SUCCESS,
  props<{ posts: Post[] }>(),
);

export const loadPostsByAuthorFailure = createAction(
  PostActionTypes.LOAD_POSTS_BY_AUTHOR_FAILURE,
  props<{ error: HttpError }>(),
);

export const loadPost = createAction(
  PostActionTypes.LOAD_POST,
  props<{ id: string }>(),
);

export const loadPostSuccess = createAction(
  PostActionTypes.LOAD_POST_SUCCESS,
  props<{ post: Post }>(),
);

export const loadPostFailure = createAction(
  PostActionTypes.LOAD_POST_FAILURE,
  props<{ error: HttpError }>(),
);

export const createPost = createAction(
  PostActionTypes.CREATE_POST,
  props<{ post: CreatePostDto }>(),
);

export const createPostSuccess = createAction(
  PostActionTypes.CREATE_POST_SUCCESS,
  props<{ post: Post }>(),
);

export const createPostFailure = createAction(
  PostActionTypes.CREATE_POST_FAILURE,
  props<{ error: HttpError }>(),
);

export const updatePost = createAction(
  PostActionTypes.UPDATE_POST,
  props<{ post: Post }>(),
);

export const updatePostSuccess = createAction(
  PostActionTypes.UPDATE_POST_SUCCESS,
  props<{ post: Post }>(),
);

export const updatePostFailure = createAction(
  PostActionTypes.UPDATE_POST_FAILURE,
  props<{ error: HttpError }>(),
);

export const likePost = createAction(
  PostActionTypes.LIKE_POST,
  props<{ post: Post }>(),
);

export const likePostSuccess = createAction(
  PostActionTypes.LIKE_POST_SUCCESS,
  props<{ post: Post; like: Like }>(),
);

export const likePostFailure = createAction(
  PostActionTypes.LIKE_POST_FAILURE,
  props<{ error: HttpError }>(),
);

export const unlikePost = createAction(
  PostActionTypes.UNLIKE_POST,
  props<{ post: Post; like: Like }>(),
);

export const unlikePostSuccess = createAction(
  PostActionTypes.UNLIKE_POST_SUCCESS,
  props<{ post: Post; like: Like }>(),
);

export const unlikePostFailure = createAction(
  PostActionTypes.UNLIKE_POST_FAILURE,
  props<{ error: HttpError }>(),
);

export const commentPost = createAction(
  PostActionTypes.COMMENT_POST,
  props<{ post: Post; comment: CreateCommentDto }>(),
);

export const commentPostSuccess = createAction(
  PostActionTypes.COMMENT_POST_SUCCESS,
  props<{ post: Post; comment: Comment }>(),
);

export const commentPostFailure = createAction(
  PostActionTypes.COMMENT_POST_FAILURE,
  props<{ error: HttpError }>(),
);

export const deletePost = createAction(
  PostActionTypes.DELETE_POST,
  props<{ id: string }>(),
);

export const deletePostSuccess = createAction(
  PostActionTypes.DELETE_POST_SUCCESS,
  props<{ id: string }>(),
);

export const deletePostFailure = createAction(
  PostActionTypes.DELETE_POST_FAILURE,
  props<{ error: HttpError }>(),
);

export const postsActions = {
  loadPosts,
  loadPostsSuccess,
  loadPostsFailure,
  loadPostsByAuthor,
  loadPostsByAuthorSuccess,
  loadPostsByAuthorFailure,
  loadPost,
  loadPostSuccess,
  loadPostFailure,
  createPost,
  createPostSuccess,
  createPostFailure,
  updatePost,
  updatePostSuccess,
  updatePostFailure,
  likePost,
  likePostSuccess,
  likePostFailure,
  unlikePost,
  unlikePostSuccess,
  unlikePostFailure,
  commentPost,
  commentPostSuccess,
  commentPostFailure,
  deletePost,
  deletePostSuccess,
  deletePostFailure,
};
