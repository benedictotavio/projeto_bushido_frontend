import { HttpClient } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { environment } from 'src/environments/environment'
import { AlunoTurma } from '../../turma.interface'
import { AuthService } from 'src/app/services/services-admin/auth.service'

@Component({
  selector: 'app-sessao-turma',
  templateUrl: './sessao-turma.component.html',
  styleUrls: ['./sessao-turma.component.css']
})
export class SessaoTurmaComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  private readonly apiUrl = environment.urlApi
  private readonly token = localStorage.getItem('token')
  protected readonly nomeTurma = this.route.snapshot.paramMap.get('nomeTurma')
  private readonly role = localStorage.getItem('role')
  protected readonly email = this.route.snapshot.paramMap.get('email')
  protected alunosDaTurma: AlunoTurma[] = []
  protected idade: number | undefined

  ngOnInit(): void {
    this.buscarAlunosDaTurma()
  }

  protected deletarTurma() {
    const confirmar = window.confirm('Tem certeza que deseja excluir esta turma?')
    if (confirmar) {
      this.removerTurma()
    }
  }

  private removerTurma() {
    this.http
      .delete<{ message: string }>(this.apiUrl + `turma/${this.nomeTurma}/${this.email}`, {
        headers: {
          Authorization: 'Bearer ' + this.token
        }
      })
      .subscribe({
        next: (data) => {
          window.confirm(data.message)
          this.router.navigate(['/admin', this.email, 'turmas'])
        },
        error: (error) => {
          if (error.status === 401) {
            window.confirm('O Admin não está mais autorizado. refaça o login para continuar a acessar o sistema')
            this.authService.removeToken()
            this.router.navigate(['/admin'])
          }
          if (error.status === 403 || error.status === 411 || error.status === 404 || error.status === 411) {
            window.confirm(error['error']['message'])
          }
        }
      })
  }

  protected adicionarFaltaAoAluno(rg: string) {
    this.http
      .post<{ message: string }>(
        this.apiUrl + `aluno/falta/${rg}/${new Date().getTime()}`,
        {
          motivo: 'Nova Falta',
          observacao: 'Falta automatica'
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.token
          }
        }
      )
      .subscribe({
        next: (data) => {
          window.confirm(data.message)
        },
        error: (error) => {
          if (error.status === 401) {
            window.confirm('O Admin não está mais autorizado. refaça o login para continuar a acessar o sistema')
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
        }
      })
  }

  protected definirIdadePorDataNascimento(dataNascimento: Date) {
    const dataNasc = new Date(dataNascimento)
    const anoNasc = dataNasc.getFullYear()
    const ano = new Date().getFullYear()
    return ano - anoNasc
  }

  isAdmin(): boolean {
    return this.role?.toUpperCase() === 'ADMIN'
  }

  buscarAlunosDaTurma() {
    this.http
      .get<AlunoTurma[]>(this.apiUrl + `turma/${this.nomeTurma}/alunos`, {
        headers: {
          Authorization: 'Bearer ' + this.token
        }
      })
      .subscribe({
        next: (data) => {
          this.alunosDaTurma = data
        },
        error: (error) => {
          if (error.status === 401) {
            window.confirm('O Admin não está mais autorizado. refaça o login para continuar a acessar o sistema')
            this.authService.removeToken()
            this.router.navigate(['/admin'])
          }
        }
      })
  }
}
