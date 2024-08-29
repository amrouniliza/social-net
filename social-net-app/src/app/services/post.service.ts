// post.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../models';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiUrl = 'http://localhost:3000/posts'; // URL de l'API

  constructor(private http: HttpClient) {}

  createPost(postData: Omit<Post, 'id' | 'imageUrl'>): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, postData, {
      withCredentials: true,
    });
  }

  getPost(id: string): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`, {
      withCredentials: true,
    });
  }

  getPosts(): Observable<any> {
    return this.http.get<Post[]>(`${this.apiUrl}`, {
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
}
