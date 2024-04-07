import { HttpClient } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { environment } from 'src/environments/environment'
import {
  AlunoEditado,
  AlunoResponse,
  Graduacao,
  HistoricoSaude,
  HistoricoSaudeEditado,
} from 'src/app/pages/admin/aluno.interface'

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
  ShowPlaceholder = true
  aluno: AlunoResponse | undefined
  alunoEditado: AlunoEditado | undefined
  email = this.route.snapshot.paramMap.get('email')
  rg_aluno = this.route.snapshot.paramMap.get('rg')
  deficiencia = ''
  acompanhamentoSaude = ''
  private readonly url = environment.urlApi + 'aluno'
  modoEdicao = false
  private historicoSaudeEditado: HistoricoSaudeEditado | undefined

  graduacaoAtual: Graduacao = {
    kyu: 0,
    faltas: [],
    status: false,
    inicioGraduacao: '',
    fimGraduacao: '',
    frequencia: 0,
    aprovado: false,
    cargaHoraria: 0,
    dan: 0,
  }

  ngOnInit(): void {
    this.buscarAlunoPorRg()
  }

  protected buscarAlunoPorRg() {
    this.http
      .get<AlunoResponse>(this.url + `?rg=${this.rg_aluno}`, {
        headers: {
          Authorization: 'Bearer ' + this.token,
        },
      })
      .subscribe({
        next: data => {
          this.aluno = data
          this.aluno.dataPreenchimento = new Date(this.aluno.dataPreenchimento).toLocaleDateString(
            'pt-BR'
          )
          this.aluno.dataNascimento = new Date(this.aluno.dataNascimento).toLocaleDateString(
            'pt-BR'
          )
          this.graduacaoAtual = this.aluno.graduacao[this.aluno.graduacao.length - 1]
          this.ShowPlaceholder = false //Tirando o placeholder
        },
        error: error => {
          if (error.status === 401) {
            window.confirm(
              'O admin não esta mais autorizado. Faça o login para continuar a acessar o sistema'
            )
            localStorage.removeItem('token')
            this.router.navigate(['/admin'])
          }
          if (error.status === 404) {
            window.confirm('Aluno não encontrado')
            this.router.navigate(['/admin', this.email, 'buscar'])
          }
          console.error(error)
        },
      })
  }

  protected editarAlunoPorRg() {
    this.http
      .put<{ id: string; message: string }>(
        this.url + '/' + this.rg_aluno,
        this.adapterAlunoParaAlunoEditado(this.aluno as AlunoResponse),
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
            localStorage.removeItem('token')
          }
          if (error.status === 404) {
            window.confirm('Aluno não encontrado')
          }
        },
      })
  }

  protected adicionarDeficiencia() {
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

  protected adicionarAcompanhamentoSaude() {
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

  protected removerFalta(falta: string) {
    this.http
      .delete(this.url + `/falta/${this.rg_aluno}?data=${falta}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.token,
        },
      })
      .subscribe({
        next: data => {
          window.confirm('Falta removida com sucesso')
          window.location.reload()
          console.log(data)
        },
        error: error => {
          if (error.status === 401) {
            window.confirm(
              'O Admin não esta mais autorizado. refaça o login para continuar a acessar o sistema'
            )
            localStorage.removeItem('token')
          }
          if (error.status === 404) {
            window.confirm('Aluno não encontrado')
          }
          if (error.status === 403) {
            console.error(error)
            window.confirm('Aluno não possui falta')
          } else {
            console.error(error)
          }
        },
      })
  }

  protected removerAcompanhamentoSaude(acompanhamento: string) {
    this.http
      .delete(this.url + `/acompanhamentoSaude/${this.rg_aluno}?acompanhamento=${acompanhamento}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.token,
        },
      })
      .subscribe({
        next: data => {
          window.confirm('Acompanhamento removido com sucesso')
          window.location.reload()
          console.log(data)
        },
        error: error => {
          if (error.status === 401) {
            window.confirm(
              'O Admin não esta mais autorizado. refaça o login para continuar a acessar o sistema'
            )
            localStorage.removeItem('token')
          }
          if (error.status === 404) {
            window.confirm('Aluno não encontrado')
          }
          if (error.status === 403) {
            console.error(error)
            window.confirm('Aluno não possui acompanhamento')
          } else {
            console.error(error)
          }
        },
      })
  }

  protected removerDeficiencia(id: string) {
    this.http
      .delete(this.url + `/deficiencia/${this.rg_aluno}?deficiencia=${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.token,
        },
      })
      .subscribe({
        next: data => {
          window.confirm('Deficiência removida com sucesso')
          window.location.reload()
          console.log(data)
        },
        error: error => {
          if (error.status === 401) {
            window.confirm(
              'O Admin não esta mais autorizado. refaça o login para continuar a acessar o sistema'
            )
            localStorage.removeItem('token')
          }
          if (error.status === 404) {
            window.confirm('Aluno não encontrado')
          }
          if (error.status === 403) {
            console.error(error)
            window.confirm('Aluno não possui deficiência')
          } else {
            console.error(error)
          }
        },
      })
  }

  protected removerResponsavel(cpf: string) {
    console.log(cpf)
    this.http
      .delete(this.url + `/responsavel/${this.rg_aluno}?cpf=${cpf}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.token,
        },
      })
      .subscribe({
        next: data => {
          window.confirm('Responsável removido com sucesso')
          window.location.reload()
          console.log(data)
        },
        error: error => {
          if (error.status === 401) {
            window.confirm(
              'O Admin não esta mais autorizado. refaça o login para continuar a acessar o sistema'
            )
            localStorage.removeItem('token')
            this.router.navigate(['/admin'])
          }
          if (error.status === 404) {
            window.confirm('Aluno não encontrado')
          }
          if (error.status === 403) {
            console.error(error)
            window.confirm('Aluno não possui responsável')
          }
        },
      })
  }

  protected setModoEdicao() {
    this.modoEdicao = !this.modoEdicao
  }

  protected aprovarAluno() {
    this.http
      .post<{ message: string }>(
        this.url + `/graduacao/${this.rg_aluno}/aprovar`,
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
          if (error.status === 403) {
            console.error(error)
            window.confirm(error.error.message)
          }
          if (error.status === 404 || error.status === 409 || error.status === 411) {
            window.confirm(error.error.message)
          }
        },
      })
  }

  protected reprovarAluno() {
    this.http
      .post<{ message: string }>(
        this.url + `/graduacao/${this.rg_aluno}/reprovar`,
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
          if (error.status === 403) {
            console.error(error)
            window.confirm('Aluno não possui responsável')
          }
          if (error.status === 404 || error.status === 409 || error.status === 411) {
            window.confirm(error.error.message)
          }
        },
      })
  }

  protected editarHistoricoSaude() {
    this.historicoSaudeEditado = this.adapterHistoricoSaudeParaHistoricoSaudeEditado(
      this.aluno?.historicoSaude as HistoricoSaude
    )

    console.log(this.historicoSaudeEditado)
    this.http
      .put<{ message: string }>(
        this.url + `/historicoSaude/${this.rg_aluno}`,
        this.historicoSaudeEditado,
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
              'O Admin não esta mais autorizado. refaça o login para continuar a acessar o sistema'
            )
            localStorage.removeItem('token')
            this.router.navigate(['/admin'])
          }
          if (error.status === 403) {
            console.error(error)
            window.confirm('Aluno não possui responsável')
          }
          if (error.status === 404 || error.status === 409 || error.status === 411) {
            window.confirm(error.error.message)
          }
        },
      })
  }

  private adapterAlunoParaAlunoEditado(aluno: AlunoResponse): AlunoEditado {
    return {
      dadosSociais: aluno.dadosSociais,
      dadosEscolares: aluno.dadosEscolares,
      endereco: aluno.endereco,
    }
  }

  private adapterHistoricoSaudeParaHistoricoSaudeEditado(
    historicoSaude: HistoricoSaude
  ): HistoricoSaudeEditado {
    return {
      fatorRh: historicoSaude.fatorRh,
      tipoSanguineo: historicoSaude.tipoSanguineo,
      usoMedicamentoContinuo: historicoSaude.usoMedicamento,
      cirurgia: historicoSaude.cirurgia,
      alergia: historicoSaude.alergia,
      doencaCronica: historicoSaude.doencaCronica,
    }
  }
}
