import { Component } from '@angular/core'
import { Login } from '../login.interface'
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'

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
    private router: Router
  ) {}

  ApiBushido = 'https://projeto-bushido-backend.onrender.com/api/V1/admin/login'

  Logar() {
    this.http.post<{ token: string }>(this.ApiBushido, this.login).subscribe(
      response => {
        this.token = response.token
        // Redirecionar para a página do dashboard aqui se o login for autenticado
        try{
          this.router.navigate(['/admin', this.login.email])
          localStorage.setItem('token', this.token)
        }catch (e) {
          console.log(e)
        }

      },
      error => {
        console.error(error)
        if (error.status === 401) {
          window.alert('Email ou senha inválidos')
        }
      }
    )
  }
}
