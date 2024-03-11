import { Component } from '@angular/core'
import { Login } from '../login.interface'
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'
import { environment } from '../../../../environments/environment'
import { LoadingService } from '../../../services/services-admin/service-loading.service';
import { AuthService } from 'src/app/services/services-admin/authservice.service'


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent {
  login: Login = {
    email: '',
    senha: '',
  }
  token = ''


  constructor(
    private http: HttpClient,
    private router: Router,
    public loadingService: LoadingService,
    private authService : AuthService
  ) {}

  ApiBushido = environment.urlApi + '/admin/login'

  Logar() {
    this.http.post<{ token: string }>(this.ApiBushido, this.login).subscribe(
      response => {
        this.authService.setAuthenticated(true)
        this.router.navigate(['/admin', this.login.email])
        localStorage.setItem('token', response.token)
      },
      error => {
        console.error(error)
        if (error.status === 401) {
          this.router.navigate(['/admin'])
          window.alert('Email ou senha inválidos')
        }
      }
    )
  }
}
