import { Component, Input, OnInit, Optional, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'; import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PostService } from '../../core/services/post.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatIconModule
  ],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.scss'
})
export class CreatePostComponent {
  @Input() post: any;
  @ViewChild('postForm') postForm!: NgForm;
  title: string = '';
  content: string = '';
  loading: boolean = false;
  error: string | null = null;
  success: boolean = false;

  constructor(private postService: PostService,
    @Optional() private dialogRef?: MatDialogRef<CreatePostComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: any) {
    this.post = data?.post;
  }


  ngOnInit() {
    if (this.post) {
      this.title = this.post.title;
      this.content = this.post.content;
    }
  }


  onSubmit() {
    if (!this.title || !this.content) {
      this.error = 'Title and content are required.';
      return;
    }
    this.loading = true;
    this.error = null;
    this.success = false;

    const postData = {
      title: this.title,
      content: this.content
    };


    if (this.post && this.dialogRef) {
      this.dialogRef.close({ title: this.title, content: this.content });
      this.loading = false;
      return;
    }

    this.postService.createPost(postData).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
        this.title = '';
        this.content = '';
        this.postForm.resetForm();
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to create post.';
      }
    });
  }
}
