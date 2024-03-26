import { HttpClient } from '@angular/common/http'
import { Component } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-janela-modal',
  templateUrl: './janela-modal.component.html',
  styleUrls: ['./janela-modal.component.css'],
})
export class JanelaModalComponent {
  constructor(
    private readonly http: HttpClient,
    private route: ActivatedRoute
  ) {}

  private readonly token = localStorage.getItem('token')
  private readonly url =
    environment.urlApi + `aluno/responsavel/${this.route.snapshot.paramMap.get('rg')}`
  responsavel = {
    nome: '',
    cpf: '',
    telefone: '',
    filiacao: '',
    email: '',
  }

  protected adicionarResponsavel() {
    this.http
      .post<{ id: string; message: string }>(this.url, this.responsavel, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.token,
        },
      })
      .subscribe({
        next: data => {
          window.confirm(data['message'])
          window.location.reload()
        },
        error: error => {
          if (error.status === 401) {
            window.confirm('O token informado é inválido')
            localStorage.removeItem('token')
          }
          if (error.status === 403) {
            window.confirm('Preencha todas as propriedades corretamente')
          }
          if (error.status === 422) {
            window.confirm('Todos os campos devem ser preenchidos corretamente')
          }
          if (error.status === 409) {
            window.confirm('O email cpf já foi registrado')
          }
        },
      })
  }
}
