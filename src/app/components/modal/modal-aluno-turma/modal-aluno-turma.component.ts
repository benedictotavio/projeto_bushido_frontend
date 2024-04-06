import { HttpClient } from '@angular/common/http'
import { Component } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { AlunoResponse } from 'src/app/pages/admin/aluno.interface'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-modal-aluno-turma',
  templateUrl: './modal-aluno-turma.component.html',
  styleUrls: ['./modal-aluno-turma.component.css'],
})
export class ModalAlunoTurmaComponent {
  constructor(
    private readonly http: HttpClient,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  private readonly url = environment.urlApi
  private readonly nomeTurma = this.route.snapshot.paramMap.get('nomeTurma')
  private readonly token = localStorage.getItem('token')
  protected rg = ''
  protected aluno: AlunoResponse | undefined

  protected adicionarAlunoATurma() {
    this.http
      .post<{ message: string }>(
        `${this.url}turma/aluno/${this.nomeTurma}`,
        {
          nome: this.aluno?.nome,
          genero: this.aluno?.genero,
          dataNascimento: this.dateToLocalDateString(this.aluno?.dataNascimento as string),
          rg: this.aluno?.rg,
        },
        {
          headers: {
            Authorization: 'Bearer ' + this.token,
          },
        }
      )
      .subscribe({
        next: data => {
          window.confirm(data.message)
          this.fecharModal()
          window.location.reload()
        },
        error: error => {
          if (error.status === 401) {
            window.confirm('O token informado é inválido')
            localStorage.removeItem('token')
            this.router.navigate(['/admin'])
          }
          if (error.status === 403) {
            window.confirm('Preencha todas as propriedades corretamente')
          }
          if (error.status === 404) {
            window.confirm('Aluno não encontrado')
          }
          if (error.status === 409) {
            window.confirm('Aluno ja pertence à turma')
          }
        },
      })
  }

  protected buscarAlunoPorRg() {
    this.http
      .get<AlunoResponse>(this.url + 'aluno' + `?rg=${this.rg}`, {
        headers: {
          Authorization: 'Bearer ' + this.token,
        },
      })
      .subscribe({
        next: data => {
          this.aluno = data
        },
        error: error => {
          if (error.status === 401) {
            window.confirm('O token informado é inválido')
            localStorage.removeItem('token')
            this.router.navigate(['/admin'])
          }
          if (error.status === 403) {
            window.confirm('Preencha todas as propriedades corretamente')
          }
          if (error.status === 404) {
            window.confirm('Aluno não encontrado')
          }
          console.log(error)
        },
      })
  }

  protected fecharModal() {
    this.rg = ''
    this.aluno = undefined
  }

  private dateToLocalDateString(dateString: string): string {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const formattedDate = `${year}-${month}-${day}`
    return formattedDate
  }
}