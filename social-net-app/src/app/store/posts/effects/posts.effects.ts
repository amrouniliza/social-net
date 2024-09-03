import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PostService } from '../../../services/post.service';
import { catchError, concatMap, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { postsActions } from '../actions/posts.actions';
import { Store } from '@ngrx/store';

@Injectable()
export class PostsEffects {
  private actions$ = inject(Actions);
  private postService = inject(PostService);
  private store = inject(Store);

  loadPosts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(postsActions.loadPosts),
      switchMap(() =>
        this.postService.getPosts().pipe(
          map((res) => {
            return res.items;
          }),
          map((posts) => {
            return postsActions.loadPostsSuccess({ posts });
          }),
          catchError((error) => {
            return of(postsActions.loadPostsFailure({ error }));
          }),
        ),
      ),
    );
  });

  loadPostsByAuthor$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(postsActions.loadPostsByAuthor),
      mergeMap(({ authorId }) =>
        this.postService.getPostsByAuthor(authorId).pipe(
          map((posts) => {
            return postsActions.loadPostsSuccess({
              posts: posts.map((post) => ({
                ...post,
                hasUserLiked: post.likes.some(
                  (like) => like.user.id === authorId,
                ),
              })),
            });
          }),
          catchError((error) => {
            return of(postsActions.loadPostsFailure({ error }));
          }),
        ),
      ),
    );
  });

  loadPost$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(postsActions.loadPost),
      switchMap(({ id }) =>
        this.postService.getPost(id).pipe(
          map((post) => {
            return postsActions.loadPostSuccess({ post });
          }),
          catchError((error) => {
            return of(postsActions.loadPostFailure({ error }));
          }),
        ),
      ),
    );
  });

  createPost$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(postsActions.createPost),
      switchMap(({ post }) =>
        this.postService.createPost(post).pipe(
          map((post) => {
            return postsActions.createPostSuccess({ post });
          }),
          catchError((error) => {
            return of(postsActions.createPostFailure({ error }));
          }),
        ),
      ),
    );
  });

  updatePost$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(postsActions.updatePost),
      switchMap(({ post }) =>
        this.postService.updatePost(post.id, post).pipe(
          map((post) => {
            return postsActions.updatePostSuccess({ post });
          }),
          catchError((error) => {
            return of(postsActions.updatePostFailure({ error }));
          }),
        ),
      ),
    );
  });

  likePost$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(postsActions.likePost),
      switchMap(({ id }) =>
        this.postService.likePost(id).pipe(
          map(() => {
            return postsActions.likePostSuccess({ id });
          }),
          catchError((error) => {
            return of(postsActions.likePostFailure({ error }));
          }),
        ),
      ),
    );
  });

  deletePost$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(postsActions.deletePost),
      switchMap(({ id }) =>
        this.postService.deletePost(id).pipe(
          map(() => {
            return postsActions.deletePostSuccess({ id });
          }),
          catchError((error) => {
            return of(postsActions.deletePostFailure({ error }));
          }),
        ),
      ),
    );
  });
}
