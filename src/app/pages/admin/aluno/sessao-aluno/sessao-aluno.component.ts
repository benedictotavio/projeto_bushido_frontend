import { HttpClient } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { environment } from 'src/environments/environment'
import { AlunoEditado, AlunoResponse, Graduacao } from 'src/app/pages/admin/aluno.interface'

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

  protected vincularAlunoAUmaTurma() {
    const nomeTurma = window.prompt('Digite o nome da turma')
    this.adicionarAlunoATurma(nomeTurma as string)
  }

  protected buscarAlunoPorRg() {
    this.http
      .get<AlunoResponse[]>(this.url + `?rg=${this.rg_aluno}`, {
        headers: {
          Authorization: 'Bearer ' + this.token,
        },
      })
      .subscribe({
        next: data => {
          if (data.length === 0) {
            window.confirm('Aluno não encontrado')
            this.router.navigate(['/admin', this.email, 'buscar'])
          }
          this.aluno = data[0]
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
            window.confirm('')
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
              window.confirm(
                'O Admin não esta mais autorizado. refaça o login para continuar a acessar o sistema'
              )
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
              window.confirm(
                'O Admin não esta mais autorizado. refaça o login para continuar a acessar o sistema'
              )
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
      .delete<{ message: string }>(this.url + `/falta/${this.rg_aluno}?data=${falta}`, {
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
          }
        },
      })
  }

  protected removerAcompanhamentoSaude(acompanhamento: string) {
    this.http
      .delete<{ message: string }>(
        this.url + `/acompanhamentoSaude/${this.rg_aluno}?acompanhamento=${acompanhamento}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.token,
          },
        }
      )
      .subscribe({
        next: data => {
          window.confirm(data['message'])
          window.location.reload()
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
          }
        },
      })
  }

  protected removerDeficiencia(id: string) {
    this.http
      .delete<{ message: string }>(this.url + `/deficiencia/${this.rg_aluno}?deficiencia=${id}`, {
        headers: {
          'Content-Type': 'application/json',
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
          }
        },
      })
  }

  protected removerResponsavel(cpf: string) {
    this.http
      .delete<{ message: string }>(this.url + `/responsavel/${this.rg_aluno}?cpf=${cpf}`, {
        headers: {
          'Content-Type': 'application/json',
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

  private adicionarAlunoATurma(nomeTurma: string) {
    this.http
      .post<{ message: string }>(
        `${environment.urlApi}turma/${nomeTurma}/aluno`,
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

  private dateToLocalDateString(dateString: string): string {
    const parts = dateString.split('/')
    const formattedDate =
      parts[2] + '-' + parts[1].padStart(2, '0') + '-' + parts[0].padStart(2, '0')
    return formattedDate
  }

  private adapterAlunoParaAlunoEditado(aluno: AlunoResponse): AlunoEditado {
    return {
      dadosSociais: aluno.dadosSociais,
      dadosEscolares: aluno.dadosEscolares,
      endereco: aluno.endereco,
      historicoDeSaude: {
        tipoSanguineo: aluno.historicoSaude.tipoSanguineo,
        usoMedicamentoContinuo: aluno.historicoSaude.usoMedicamento,
        alergia: aluno.historicoSaude.alergia,
        cirurgia: aluno.historicoSaude.cirurgia,
        doencaCronica: aluno.historicoSaude.doencaCronica,
      },
    }
  }
}
