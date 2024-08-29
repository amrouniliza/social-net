import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PostService } from '../../../services/post.service';
import { catchError, map, of, switchMap } from 'rxjs';
import { postsActions } from '../actions/posts.actions';

@Injectable()
export class PostsEffects {
  private actions$ = inject(Actions);
  private postService = inject(PostService);

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
      switchMap(({ authorId }) =>
        this.postService.getPostsByAuthor(authorId).pipe(
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
