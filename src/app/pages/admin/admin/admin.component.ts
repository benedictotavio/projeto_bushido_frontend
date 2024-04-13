import { Component } from '@angular/core'
import { Login } from '../auth.interface'
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'
import { environment } from '../../../../environments/environment'
import { AuthService } from 'src/app/services/services-admin/auth.service'
import { setAdminLocalStorage } from '../local-storage.handler'

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  login: Login = {
    email: '',
    senha: ''
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ApiBushido = environment.urlApi + 'admin/login'

  Logar() {
    this.http.post<{ token: string; role: string }>(this.ApiBushido, this.login).subscribe({
      next: (data) => {
        this.authService.setAuthenticated(true)
        this.router.navigate(['/admin', this.login.email])
        setAdminLocalStorage(data.role, data.token)
      },
      error: (error) => {
        if (error.status === 401) {
          window.alert('Email ou senha inválidos')
        }
        if (
          error.status === 400 ||
          error.status === 403 ||
          error.status === 404 ||
          error.status === 409 ||
          error.status === 411
        ) {
          window.confirm(error['error']['message'])
          window.location.reload()
        }
      }
    })
  }
}
