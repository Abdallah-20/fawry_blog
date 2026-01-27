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

  constructor(private http: HttpClient, private authService: AuthService) {}

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}`);
  }

  getPostComments(postId: string): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/${postId}/comments`).pipe(
      map(res => res.result)
    )
  }

  addComment(commentData: CommentData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/comment`, commentData);
  }

  react(postId: number, isLike: boolean) {
    const username = this.authService.getUserName()
    return this.http.post<any>(`${this.apiUrl}/${postId}/${username}/react/${isLike}`, null);
  }
}
