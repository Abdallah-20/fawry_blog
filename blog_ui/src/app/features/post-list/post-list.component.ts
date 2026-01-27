import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { PostService } from '../../core/services/post.service';
import { MatDialog } from '@angular/material/dialog';
import { CommentDialogComponent } from './comment-dialog/comment-dialog.component';
import { A11yModule } from "@angular/cdk/a11y";

interface Post {
  id: string;
  title: string;
  authorName: string;
  content: string;
  likeCount: number;
  dislikeCount: number;
  commentsCount: number;
  createdAt: string;
}

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, A11yModule],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss',
})
export class PostListComponent {
  private dialog = inject(MatDialog);
  posts: Post[] = [];
  loading: boolean = true;

  constructor(private postService: PostService) {}

  openComments(postId: string) {
    this.dialog.open(CommentDialogComponent, {
      width: '500px',
      data: { postId },
    });
  }
  ngOnInit(): void {
    this.getPosts();
  }

  private getPosts() {
    this.postService.getPosts().subscribe({
      next: (data) => {
        this.posts = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching posts:', err);
        this.loading = false;
      },
    });
  }

  onReact(post: Post, isLike: boolean) {
    this.postService.react(+post.id, isLike).subscribe({
      next: data => {
        this.getPosts();
      }
    })
  }
}
