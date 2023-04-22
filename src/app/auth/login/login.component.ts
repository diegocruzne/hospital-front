import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public formSubmitted = false;

  public loginForm = this.fb.group({
    email: [
      localStorage.getItem('email') || 'test101@gmail.com',
      [Validators.required, Validators.email],
    ],
    password: ['123456', Validators.required],
    remember: [false],
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.cargarBoton();
  }

  login() {
    this.usuarioService.login(this.loginForm.value).subscribe({
      next: (resp) => {
        if (this.loginForm.get('remember')?.value) {
          localStorage.setItem(
            'email',
            this.loginForm.get('email')?.value || ''
          );
        } else {
          localStorage.removeItem('email');
        }

        this.router.navigateByUrl('/');
      },
      error: (err) => {
        Swal.fire('Error', err.error.msg, 'error');
      },
    });
  }

  cargarBoton() {
    google.accounts.id.initialize({
      client_id:
        '836974771332-1jnh1i39bi2ujf9e1qfvpddmtnhg977e.apps.googleusercontent.com',
      callback: (res: any) => {
        this.devuelveToken(res);
      },
    });

    google.accounts.id.renderButton(document.getElementById('buttonDiv'), {
      theme: 'outline',
      size: 'large',
    });
    // google.accounts.id.prompt();
  }

  devuelveToken(algo: any) {
    this.usuarioService.loginGoogle(algo.credential).subscribe((resp) => {
      this.router.navigateByUrl('/');
    });
  }
}
