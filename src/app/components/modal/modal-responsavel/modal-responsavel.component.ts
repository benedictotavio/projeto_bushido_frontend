import { HttpClient } from '@angular/common/http'
import { Component } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { AuthService } from 'src/app/services/services-admin/auth.service'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-modal-responsavel',
  templateUrl: './modal-responsavel.component.html',
  styleUrls: ['./modal-responsavel.component.css']
})
export class ModalResponsavelComponent {
  constructor(
    private readonly http: HttpClient,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  private readonly token = localStorage.getItem('token')
  private readonly url = environment.urlApi + `aluno/responsavel/${this.route.snapshot.paramMap.get('cpf')}`
  responsavel = {
    nome: '',
    cpf: '',
    telefone: '',
    filiacao: '',
    email: ''
  }

  protected adicionarResponsavel() {
    this.http
      .post<{ id: string; message: string }>(this.url, this.responsavel, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.token
        }
      })
      .subscribe({
        next: (data) => {
          window.confirm(data['message'])
          window.location.reload()
        },
        error: (error) => {
          if (error.status === 401) {
            window.confirm('O Admin não esta mais autorizado. refaça o login para continuar a acessar o sistema')
            this.authService.removeToken()
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
        }
      })
  }
}
