import { Component, Input } from '@angular/core'
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
      .post<{ email: string; nome: string }>(this.ApiBushido, this.user, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .subscribe(
        response => {
          window.alert(`admin ${response.nome} foi registrado concluído com sucesso!`)
          this.router.navigate([`/admin/${this.route.snapshot.paramMap.get('email')}`])
        },
        error => {
          if (error.status === 403) {
            localStorage.removeItem('token')
            this.router.navigate(['/admin'])
          } else if (error.status == 422) {
            window.confirm('Todos os campos devem ser preenchidos corretamente')
          } else if (error.status == 409) {
            window.confirm('O email informado já foi registrado')
          }
        }
      )
  }
}
