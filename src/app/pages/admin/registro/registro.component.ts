import { Component } from '@angular/core'
import { User } from '../user.interface'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../../environments/environment'
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegistroComponent {
  ApiBushido = environment.urlApi + 'admin/signup'
  user: User = {
    nome: '',
    email: '',
    cargo: '',
    senha: '',
    role: '',
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  register() {
    this.http
      .post<{ id: string; nome: string }>(this.ApiBushido, this.user, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .subscribe({
        next: response => {
          window.alert(response)
          this.router.navigate([
            `/admin/${this.route.snapshot.paramMap.get('email')}/aluno`,
            response.id,
          ])
        },
        error: error => {
          if (error.status === 401) {
            window.confirm(
              'O Admin não esta mais autorizado. refaça o login para continuar a acessar o sistema'
            )
            localStorage.removeItem('token')
          }

          if (
            error.status === 400 ||
            error.status === 403 ||
            error.status === 404 ||
            error.status === 409 ||
            error.status === 411
          ) {
            window.confirm(error['error']['message'])
          }
        },
      })
  }
}
