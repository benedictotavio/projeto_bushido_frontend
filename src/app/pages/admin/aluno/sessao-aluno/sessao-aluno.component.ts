import { HttpClient } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { environment } from 'src/environments/environment'
import { AlunoResponse } from 'src/app/pages/admin/aluno.interface'

@Component({
  selector: 'app-sessao-aluno',
  templateUrl: './sessao-aluno.component.html',
  styleUrls: ['./sessao-aluno.component.css'],
})
export class SessaoAlunoComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  private readonly token = localStorage.getItem('token')

  aluno: AlunoResponse | undefined
  email = this.route.snapshot.paramMap.get('email')
  rg_aluno = this.route.snapshot.paramMap.get('rg')
  deficiencia = ''
  acompanhamentoSaude = ''
  url = environment.urlApi + 'aluno'
  modoEdicao = false
  ngOnInit(): void {
    this.buscarAlunoPorRg()
  }

  buscarAlunoPorRg() {
    this.http
      .get<AlunoResponse>(this.url + `?rg=${this.rg_aluno}`, {
        headers: {
          Authorization: 'Bearer ' + this.token,
        },
      })
      .subscribe({
        next: data => {
          console.log(data)
          this.aluno = data
          this.aluno.dataPreenchimento = new Date(this.aluno.dataPreenchimento).toLocaleDateString(
            'pt-BR'
          )
          this.aluno.dataNascimento = new Date(this.aluno.dataNascimento).toLocaleDateString(
            'pt-BR'
          )
        },
        error: error => {
          if (error.status === 401) {
            window.confirm('O token informado é inválido')
            localStorage.removeItem('token')
          }
          if (error.status === 404) {
            window.confirm('Aluno não encontrado')
          }
          console.error(error)
        },
      })
  }

  editarAlunoPorRg() {
    console.log(this.aluno)
    console.log(this.aluno?.dataNascimento)
    const dataNascimento = this.aluno?.dataNascimento as string
    if (this.aluno) {
      this.aluno.dataNascimento = this.setDataNascimento(dataNascimento)
    }
    this.http
      .put<{ id: string; message: string }>(this.url + '/' + this.rg_aluno, this.aluno, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.token,
        },
      })
      .subscribe({
        next: data => {
          window.confirm(data.message)
        },
        error: error => {
          if (error.status === 401) {
            window.confirm('O token informado é inválido')
            localStorage.removeItem('token')
          }
          if (error.status === 404) {
            window.confirm('Aluno não encontrado')
          }
          console.error(error)
        },
      })
  }

  adicionarDeficiencia() {
    if (this.deficiencia.trim() !== '') {
      this.http
        .post<{ id: string; message: string }>(
          this.url + `/deficiencia/${this.rg_aluno}?deficiencia=${this.deficiencia}`,
          {},
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
              window.confirm('O token informado é inválido')
              console.error(error)
              setInterval(() => {
                localStorage.removeItem('token')
              }, 3000)
            }
            if (error.status === 404) {
              window.confirm('Aluno não encontrado')
            }
          },
        })
      this.deficiencia = ''
    }
  }

  adicionarAcompanhamentoSaude() {
    if (this.acompanhamentoSaude.trim() !== '') {
      this.http
        .post<{ id: string; message: string }>(
          this.url +
            `/acompanhamentoSaude/${this.rg_aluno}?acompanhamento=${this.acompanhamentoSaude}`,
          {},
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
              window.confirm('O token informado é inválido')
              console.error(error)
              setInterval(() => {
                localStorage.removeItem('token')
              }, 3000)
            }
            if (error.status === 404) {
              window.confirm('Aluno não encontrado')
            }
          },
        })
      this.acompanhamentoSaude = ''
    }
  }

  protected setModoEdicao() {
    this.modoEdicao = !this.modoEdicao
  }

  private setDataNascimento(dataNoFormatoAntigo: string): string {
    const [day, month, year] = dataNoFormatoAntigo.split('/')
    const date = new Date(`${year}-${month}-${day}`)
    const formattedYear = date.getFullYear()
    const formattedMonth = String(date.getMonth() + 1).padStart(2, '0')
    const formattedDay = String(date.getDate()).padStart(2, '0')
    const formattedDate = `${formattedYear}-${formattedMonth}-${formattedDay}`
    return formattedDate
  }
}
