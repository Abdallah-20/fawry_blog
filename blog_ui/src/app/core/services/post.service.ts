// services/post.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, ObservedValueOf, take, tap } from 'rxjs';
import { Post } from '../models/post.model';
import { AuthService } from './auth.service';

export interface CommentData {
  username: string;
  postId: number;
  content: string;
}
@Injectable({ providedIn: 'root' })
export class PostService {
  private apiUrl = 'http://localhost:8080/api/posts';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}`);
  }

  getPostsByUserName(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/me`);
  }

  createPost(postData: any): Observable<Post[]> {
    return this.http.post<Post[]>(`${this.apiUrl}`, postData);
  }

  getPostComments(postId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${postId}/comments`).pipe(
      map(res => res.result)
    )
  }

  addComment(commentData: CommentData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/comment`, commentData);
  }

  react(postId: number, isLike: boolean) {
    const userName = this.authService.getUserName()
    return this.http.post<any>(`${this.apiUrl}/${postId}/${userName}/react/${isLike}`, null);
  }

  deletePost(postId: string) {
    return this.http.delete(`${this.apiUrl}/${postId}`, { responseType: 'text' });
  }

  updatePost(postId: string, postData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${postId}`, postData);
  }

  getTwitterAuthUrl() {
  return this.http.get<{url: string}>('http://127.0.0.1:8080/api/posts/tweet', {
    withCredentials: true 
  });
}

  retweet(postId: string) {
    console.log('Retweeting post with ID:', postId);
    return this.http.post<string>(`http://127.0.0.1:8080/api/posts/retweet/${postId}`, null, {
      responseType: 'text' as 'json'
    });
  }

}
