import { HttpClient } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { environment } from 'src/environments/environment'
import { Turma } from '../../turma.interface'

@Component({
  selector: 'app-sessao-turma',
  templateUrl: './sessao-turma.component.html',
  styleUrls: ['./sessao-turma.component.css'],
})
export class SessaoTurmaComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  private readonly apiUrl = environment.urlApi
  private readonly token = localStorage.getItem('token')
  private readonly nomeTurma = this.route.snapshot.paramMap.get('nomeTurma')
  protected readonly email = this.route.snapshot.paramMap.get('email')
  protected turmaEncontrada: Turma | undefined
  protected idade: number | undefined

  ngOnInit(): void {
    this.buscarTurmaPorNome()
  }

  protected removerAluno(rg: string) {
    const confirmar = window.confirm('Tem certeza que deseja excluir este aluno?')
    if (confirmar) {
      this.removerAlunoDaTurma(rg)
    }
  }

  protected deletarTurma() {
    const confirmar = window.confirm('Tem certeza que deseja excluir esta turma?')
    if (confirmar) {
      this.removerTurma()
    }
  }

  private removerTurma() {
    this.http
      .delete<{ message: string }>(this.apiUrl + `turma/${this.nomeTurma}`, {
        headers: {
          Authorization: 'Bearer ' + this.token,
        },
      })
      .subscribe({
        next: data => {
          window.confirm(data.message)
          this.router.navigate(['/admin/turmas'])
        },
        error: error => {
          if (error.status === 401) {
            window.confirm(
              'O Admin não está mais autorizado. refaça o login para continuar a acessar o sistema'
            )
            localStorage.removeItem('token')
            this.router.navigate(['/admin'])
          }
          if (error.status === 404) {
            window.confirm('Turma não encontrada')
          }
          if (error.status === 403) {
            window.confirm('Turma não pode ser excluída')
          }
        },
      })
  }

  protected buscarTurmaPorNome() {
    this.http
      .get<Turma>(this.apiUrl + `turma/${this.nomeTurma}`, {
        headers: {
          Authorization: 'Bearer ' + this.token,
        },
      })
      .subscribe({
        next: data => {
          this.turmaEncontrada = data
        },
        error: error => {
          if (error.status === 401) {
            window.confirm(
              'O Admin não está mais autorizado. refaça o login para continuar a acessar o sistema'
            )
            localStorage.removeItem('token')
            this.router.navigate(['/admin'])
          }
        },
      })
  }

  protected adicionarFaltaAoAluno(rg: string) {
    this.http
      .post<{ message: string }>(
        this.apiUrl + `aluno/falta/${rg}/${new Date().getTime()}`,
        {
          motivo: 'Nova Falta',
          observacao: 'Falta automatica',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.token,
          },
        }
      )
      .subscribe({
        next: data => {
          window.confirm(data.message)
        },
        error: error => {
          if (error.status === 401) {
            window.confirm(
              'O Admin não está mais autorizado. refaça o login para continuar a acessar o sistema'
            )
            localStorage.removeItem('token')
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
      })
  }

  protected definirIdadePorDataNascimento(dataNascimento: Date) {
    const dataNasc = new Date(dataNascimento)
    const anoNasc = dataNasc.getFullYear()
    const ano = new Date().getFullYear()
    return ano - anoNasc
  }

  private removerAlunoDaTurma(rg: string) {
    this.http
      .delete<{ message: string }>(this.apiUrl + `turma/${this.nomeTurma}/aluno/${rg}`, {
        headers: {
          Authorization: 'Bearer ' + this.token,
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
              'O Admin não está mais autorizado. refaça o login para continuar a acessar o sistema'
            )
            localStorage.removeItem('token')
            this.router.navigate(['/admin'])
          }
          if (error.status === 404) {
            window.confirm('Aluno não encontrado')
          }
          if (error.status === 403) {
            window.confirm('Aluno não pode ser removido')
          }
        },
      })
  }
}
