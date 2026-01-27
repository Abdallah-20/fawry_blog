import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
// 1. Import the Spinner Module
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { delay, finalize } from 'rxjs/operators';
import { PostService } from '../../../core/services/post.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-comment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    FormsModule,
  ],
  templateUrl: './comment-dialog.component.html',
  styles: [
    `
      .spinner-container {
        display: flex;
        justify-content: center;
        padding: 20px;
      }
      .comment-list {
        max-height: 300px;
        overflow-y: auto;
        margin-bottom: 20px;
      }
      .comment-item {
        background: #f0f2f5;
        padding: 10px;
        border-radius: 8px;
        margin-bottom: 10px;
      }
      .full-width {
        width: 100%;
        margin-top: 10px;
      }
    `,
  ],
})
export class CommentDialogComponent implements OnInit {
  loading: boolean = true;
  comments: any[] = [];
  newCommentText = '';
  postId: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { postId: string },
    private postService: PostService,
    private authService: AuthService,
  ) {
    this.postId = this.data.postId;
  }

  ngOnInit() {
    this.fetchComments();
  }

  fetchComments() {
    this.loading = true;
    this.postService.getPostComments(this.postId)
    .pipe(delay(1500))
    .subscribe({
      next: (commentsData) => {
        this.comments = commentsData;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching comments: ', err);
        this.loading = false;
      },
    });
  }

  onAddComment() {
  if (this.newCommentText.trim()) {
    const newComment: any = {
  username: this.authService.getUserName(),
  postId: this.postId,
  content: this.newCommentText
};
    this.postService.addComment(newComment)
    .subscribe({
      next: (newComment) => {
        this.comments.push(newComment);
        this.newCommentText = '';
        this.fetchComments();
      },
      error: (err) => console.error('Failed to post comment:', err)
    });
  }
}
}
