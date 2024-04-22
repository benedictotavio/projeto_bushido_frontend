import { HttpClient } from '@angular/common/http'
import { Component } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Turma } from 'src/app/pages/admin/turma.interface'
import { environment } from 'src/environments/environment'
import { AdminResponse } from './turma'
import { AuthService } from 'src/app/services/services-admin/auth.service'

@Component({
  selector: 'app-modal-nova-turma',
  templateUrl: './modal-nova-turma.component.html',
  styleUrls: ['./modal-nova-turma.component.css']
})
export class ModalNovaTurmaComponent {
  constructor(
    private readonly http: HttpClient,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}

  protected buscarTutor = ''
  private readonly url = environment.urlApi
  private readonly token = localStorage.getItem('token')
  protected nomeTurma = this.route.snapshot.paramMap.get('nomeTurma')
  private readonly rg = this.route.snapshot.paramMap.get('rg')
  protected selectedAdmin = false

  protected novaTurma: Turma = {
    nome: '',
    tutor: {
      nome: '',
      email: ''
    },
    endereco: ''
  }

  protected adminsEncontrados: AdminResponse[] | undefined
  protected buscarAdminPorNome(nome: string) {
    if (nome === '') {
      return
    }

    this.http
      .get<AdminResponse[]>(environment.urlApi + `admin/users?nome=${nome}`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      })
      .subscribe({
        next: (data) => {
          if (data.length === 0) {
            window.confirm('Tutor não encontrado')
            return
          }
          this.adminsEncontrados = data
        },
        error: (error) => {
          if (error.status === 401) {
            window.confirm('O Admin não está mais autorizado. refaça o login para continuar a acessar o sistema')
            this.authService.removeToken()
            this.router.navigate(['/admin'])
          }
          if (error.status === 404) {
            window.confirm(error['error']['message'])
          }
        }
      })
  }

  protected adicionarTurma() {
    this.http
      .post<{ message: string }>(this.url + `turma`, this.novaTurma, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`
        }
      })
      .subscribe({
        next: (data) => {
          window.confirm(data.message)
          window.location.reload()
        },
        error: (error) => {
          if (error.status === 401) {
            window.confirm('O Admin não esta mais autorizado. refaça o login para continuar a acessar o sistema')
            this.authService.removeToken()
            this.router.navigate(['/admin'])
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
        complete: () => {
          this.novaTurma = {
            nome: '',
            tutor: {
              nome: '',
              email: ''
            },
            endereco: ''
          }
        }
      })
  }

  protected fecharModal() {
    this.novaTurma = {
      nome: '',
      tutor: {
        nome: '',
        email: ''
      },
      endereco: ''
    }
  }

  protected selecionarAdmin(admin: { nome: string; email: string }) {
    this.selectedAdmin = true
    this.novaTurma.tutor = {
      nome: admin.nome,
      email: admin.email
    }
  }
}
