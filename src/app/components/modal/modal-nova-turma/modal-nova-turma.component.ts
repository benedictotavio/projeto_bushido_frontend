import { HttpClient } from '@angular/common/http'
import { Component } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Turma } from 'src/app/pages/admin/turma.interface'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-modal-nova-turma',
  templateUrl: './modal-nova-turma.component.html',
  styleUrls: ['./modal-nova-turma.component.css'],
})
export class ModalNovaTurmaComponent {
  constructor(
    private readonly http: HttpClient,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  private readonly url = environment.urlApi
  private readonly token = localStorage.getItem('token')
  protected nomeTurma = this.route.snapshot.paramMap.get('nomeTurma')
  private readonly rg = this.route.snapshot.paramMap.get('rg')
  protected novaTurma: Turma = {
    nome: '',
    tutor: '',
    endereco: '',
    alunos: [],
  }

  protected adicionarTurma() {
    this.http
      .post<{ message: string }>(this.url + 'turma', this.novaTurma, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
      })
      .subscribe({
        next: data => {
          window.confirm(data.message)
          window.location.reload()
        },
        error: error => {
          if (error.status === 401) {
            window.confirm(
              'O Admin não esta mais autorizado. refaça o login para continuar a acessar o sistema'
            )
            localStorage.removeItem('token')
            this.router.navigate(['/admin'])
          }
          if (
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

  protected fecharModal() {
    this.novaTurma = {
      nome: '',
      tutor: '',
      endereco: '',
      alunos: [],
    }
  }
}
