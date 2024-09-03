// post.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment, CreatePostDto, Like, Post } from '../models';
import { CreateCommentDto } from '../models';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiUrl = 'http://localhost:3000/posts'; // URL de l'API

  constructor(private http: HttpClient) {}

  createPost(postData: CreatePostDto): Observable<Post> {
    const formData = new FormData();
    // transforme l'objet postData en FormData
    if (
      postData &&
      typeof postData === 'object' &&
      !(postData instanceof Date) &&
      !(postData instanceof File) &&
      !(postData instanceof Blob)
    ) {
      Object.keys(postData).reduce((formData, key) => {
        formData.append(key, postData[key]);
        return formData;
      }, formData);
    }

    return this.http.post<Post>(this.apiUrl, formData, {
      withCredentials: true,
    });
  }

  getPost(id: string): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`, {
      withCredentials: true,
    });
  }

  getPosts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`, {
      withCredentials: true,
    });
  }

  getPostsByAuthor(authorId: string): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/author/${authorId}`, {
      withCredentials: true,
    });
  }

  updatePost(
    id: string,
    postData: Partial<Omit<Post, 'id' | 'imageUrl'>>,
  ): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/${id}`, postData, {
      withCredentials: true,
    });
  }

  deletePost(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      withCredentials: true,
    });
  }

  likePost(postId: string): Observable<Like> {
    return this.http.post<Like>(
      `${this.apiUrl}/${postId}/likes`,
      {},
      { withCredentials: true },
    );
  }

  unlikePost(postId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${postId}/likes`, {
      withCredentials: true,
    });
  }

  commentPost(
    postId: string,
    createCommentDto: CreateCommentDto,
  ): Observable<Comment> {
    return this.http.post<Comment>(
      `${this.apiUrl}/${postId}/comments`,
      createCommentDto,
      { withCredentials: true },
    );
  }

  deleteComment(commentId: string): Observable<void> {
    return this.http.delete<void>(
      `http://localhost:3000/comments/${commentId}`,
      {
        withCredentials: true,
      },
    );
  }
}
