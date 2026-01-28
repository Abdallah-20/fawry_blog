import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [MatCardModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
      MatButtonModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent implements OnInit{
  private fb = inject(FormBuilder);

  editProfileForm: FormGroup = this.fb.group(
    {
      name: ['', [, Validators.minLength(2)]], // Added Name
      email: ['', [, Validators.email]],
      username: ['', Validators.minLength(2)],
      password: [''],
    },
    {
      validators: (group: FormGroup) => {
        const pass = group.get('password')?.value;
        const confirm = group.get('confirmPassword')?.value;
        return pass === confirm ? null : { notMatching: true };
      },
    },
  );

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.getUserData(this.authService.getUserName()).subscribe({
      next: (user: User) => {
        this.editProfileForm.patchValue({
          name: user.name,
          email: user.email,
          username: user.username
        })
      }
    });
  }

  onEditProfile() {
    const body: any = {};
    const formObject = this.editProfileForm.value;
    for (const key in formObject) {
      if (Object.hasOwn(formObject, key) && formObject[key]) {
        body[key] = formObject[key];
      }      
    }
    this.authService.updateUser(body).subscribe({
      next: res => {
        localStorage.clear();
        this.router.navigate(["/login"]);
      }
    })
  }
}
