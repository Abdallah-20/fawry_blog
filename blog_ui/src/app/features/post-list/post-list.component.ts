import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { PostService } from '../../core/services/post.service';
import { MatDialog } from '@angular/material/dialog';
import { CommentDialogComponent } from './comment-dialog/comment-dialog.component';
import { A11yModule } from "@angular/cdk/a11y";
import { Post, Reaction } from '../../core/models/post.model';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthService } from '../../core/services/auth.service';
import { CreatePostComponent } from '../create-post/create-post.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, A11yModule, MatProgressBarModule, CreatePostComponent],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss',
})
export class PostListComponent {
  @Input() mode: 'all' | 'mine' = 'all';
  private dialog = inject(MatDialog);
  posts: Post[] = [];
  loading: boolean = true;
  isSharing = false;
  flag = 0;

  constructor(private postService: PostService, private authService: AuthService, private snackBar: MatSnackBar) { }

  get userName() {
    return this.authService.getUserName();
  }

  openComments(postId: string) {
    this.dialog.open(CommentDialogComponent, {
      width: '500px',
      data: { postId },
    });
  }

  ngOnInit(): void {
    this.getPosts();
  }

  getPosts() {
    const obs = this.mode === 'mine'
      ? this.postService.getPostsByUserName()
      : this.postService.getPosts();
    obs.subscribe({
      next: (data) => {
        data.forEach((post: Post) => {
          post.likeCount = post.reactions.filter((r: Reaction) => r.isLike).length;
          post.dislikeCount = post.reactions.filter((r: Reaction) => !r.isLike).length;
          const react = post.reactions.find((r: Reaction) => r.userName === this.userName);
          if (react) {
            post.isLiked = react.isLike;
          } else {
            post.isLiked = null;
          }
        });
        this.posts = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching posts:', err);
        this.loading = false;
      },
    });
  }

  isMyPostsPage() {
    return this.mode === 'mine';
  }

  onEdit(post: Post) {
    const dialogRef = this.dialog.open(CreatePostComponent, {
      width: '500px',
      data: { post }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.title && result.content) {
        this.postService.updatePost(post.id, {
          title: result.title,
          content: result.content
        }).subscribe({
          next: () => {
            this.snackBar.open('Post updated successfully', 'Close', { duration: 3000 });
            this.getPosts();
          },
          error: (err) => {
            console.error('Failed to update post:', err);
            this.snackBar.open('Failed to update post', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  onDelete(post: Post) {
    this.postService.deletePost(post.id).subscribe({
      next: () => {
        this.snackBar.open('Post deleted successfully', 'Close', { duration: 3000 })
        this.getPosts();
      },
      error: (err) => {
        console.error('Failed to delete post:', err);
        this.snackBar.open('Failed to delete post', 'Close', { duration: 3000 })
      }
    });
  }

  onReact(post: Post, isLike: boolean) {
    this.postService.react(+post.id, isLike).subscribe({
      next: data => {
        this.getPosts();
      }
    })
  }

  onShare(postId: string) {
    this.postService.getTwitterAuthUrl().subscribe({
      next: (res) => {
        const popup = window.open(res.url, "_blank", "width=600,height=600");

        const messageListener = (event: MessageEvent) => {
          console.log("Received message from popup:", event.data);
          if (event.origin !== 'http://127.0.0.1:8080') return;

          if (event.data.status === 'success') {
            console.log("Auth success! Now retweeting...");

            this.postService.retweet(postId).subscribe({
              next: (retweetRes) => {
                this.snackBar.open('Successfully retweeted!', 'Close', { duration: 3000 });
              },
              error: (err) => console.error("Retweet failed", err)
            });

            window.removeEventListener('message', messageListener);
          }
        };

        window.addEventListener('message', messageListener);
      },
      error: (err) => console.error('Could not get URL', err)
    });
  }

  calculateNetRating(post: any): number {
    const likes = post.likeCount || 0;
    const dislikes = post.dislikeCount || 0;
    const total = likes + dislikes;

    this.flag = 4;

    if (total == 0) {
      this.flag = 0;
      return 0;
    }
    if (likes == 0) {
      this.flag = 1;
      return 100;
    };
    if (dislikes == 0) {
      this.flag = 2;
      return 100;
    };

    const netRating = (likes / total) * 100;
    return Math.round(netRating);
  }

  getRatingTheme(post: any): string {
    const rating = this.calculateNetRating(post);

    if (this.flag == 0) return '';
    if (this.flag == 2) return 'primary';
    if (this.flag == 1) return 'accent';
    if (rating > 50) return 'primary';
    if (rating < 50) return 'accent';


    return '';
  }
}
