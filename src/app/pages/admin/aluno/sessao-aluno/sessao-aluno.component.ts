import { HttpClient } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { environment } from 'src/environments/environment'
import { AlunoEditado, AlunoResponse, Graduacao } from 'src/app/pages/admin/aluno.interface'
import { AuthService } from 'src/app/services/services-admin/auth.service'
import { Turma } from '../../turma.interface'

@Component({
  selector: 'app-sessao-aluno',
  templateUrl: './sessao-aluno.component.html',
  styleUrls: ['./sessao-aluno.component.css']
})
export class SessaoAlunoComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  private readonly token = localStorage.getItem('token')
  aluno: AlunoResponse | undefined
  alunoEditado: AlunoEditado | undefined
  email = this.route.snapshot.paramMap.get('email')
  rg_aluno = this.route.snapshot.paramMap.get('rg')
  deficiencia = ''
  acompanhamentoSaude = ''
  private readonly url = environment.urlApi + 'aluno'
  protected modoEdicao = false
  protected modoEdicaoTurma = false
  protected readonly umaSemanaEmSegundos = 604800000
  protected readonly tresMesesEmSegundos = 7776000000
  protected readonly role = localStorage.getItem('role')
  protected turmas: Turma[] = []
  protected nota = 0

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
    nota: 0
  }

  ngOnInit(): void {
    this.buscarAlunoPorRg()
    this.listarTurmas()
  }

  protected aprovarAluno() {
    this.nota = Number.parseInt(window.prompt('Insira a nota do Aluno') as string)
    this.aprovacao(this.nota)
  }

  protected reprovarAluno() {
    this.nota = Number.parseInt(window.prompt('Insira a nota do Aluno') as string)
    this.reprovacao(this.nota)
  }

  protected setModoEdicao() {
    this.modoEdicao = !this.modoEdicao
  }

  protected setModoEdicaoTurma() {
    this.modoEdicaoTurma = !this.modoEdicaoTurma
  }

  private listarTurmas() {
    this.http
      .get<Turma[]>(environment.urlApi + 'turma', {
        headers: {
          Authorization: 'Bearer ' + this.token
        }
      })
      .subscribe({
        next: (data) => {
          this.turmas = data
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

  protected buscarAlunoPorRg() {
    this.http
      .get<AlunoResponse[]>(this.url + `?rg=${this.rg_aluno}`, {
        headers: {
          Authorization: 'Bearer ' + this.token
        }
      })
      .subscribe({
        next: (data) => {
          if (data.length === 0) {
            window.confirm('Aluno não encontrado')
            this.router.navigate(['/admin', this.email, 'buscar'])
          }
          this.aluno = data[0]
          this.aluno.dataPreenchimento = new Date(this.aluno.dataPreenchimento).toLocaleDateString('pt-BR')
          this.aluno.dataNascimento = new Date(this.aluno.dataNascimento).toLocaleDateString('pt-BR')
          this.graduacaoAtual = this.aluno.graduacao[this.aluno.graduacao.length - 1]
        },
        error: (error) => {
          if (error.status === 401) {
            window.confirm('O admin não esta mais autorizado. Faça o login para continuar a acessar o sistema')
            this.authService.removeToken()
            this.router.navigate(['/admin'])
          }
          if (error.status === 404) {
            window.confirm('Aluno não encontrado')
            this.router.navigate(['/admin', this.email, 'buscar'])
          }
        }
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
            Authorization: 'Bearer ' + this.token
          }
        }
      )
      .subscribe({
        next: (data) => {
          window.confirm(data.message)
          window.location.reload()
        },
        error: (error) => {
          if (error.status === 401) {
            window.confirm('')
            this.authService.removeToken()
          }
          if (error.status === 404) {
            window.confirm('Aluno não encontrado')
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

  protected adicionarDeficiencia() {
    if (this.deficiencia.trim() !== '') {
      this.http
        .post<{ id: string; message: string }>(
          this.url + `/deficiencia/${this.rg_aluno}?deficiencia=${this.deficiencia}`,
          {},
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
              window.confirm('O Admin não esta mais autorizado. refaça o login para continuar a acessar o sistema')
              setInterval(() => {
                this.authService.removeToken()
              }, 3000)
            }
            if (error.status === 404) {
              window.confirm('Aluno não encontrado')
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
      this.deficiencia = ''
    }
  }

  protected adicionarAcompanhamentoSaude() {
    if (this.acompanhamentoSaude.trim() !== '') {
      this.http
        .post<{ id: string; message: string }>(
          this.url + `/acompanhamentoSaude/${this.rg_aluno}?acompanhamento=${this.acompanhamentoSaude}`,
          {},
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
              window.confirm('O Admin não esta mais autorizado. refaça o login para continuar a acessar o sistema')
              setInterval(() => {
                this.authService.removeToken()
              }, 3000)
            }
            if (error.status === 404) {
              window.confirm('Aluno não encontrado')
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
      this.acompanhamentoSaude = ''
    }
  }

  protected removerFalta(falta: string) {
    this.http
      .delete<{ message: string }>(this.url + `/falta/${this.rg_aluno}/${falta}`, {
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
          if (error.status === 404) {
            window.confirm('Aluno não encontrado')
          }
          if (error.status === 403) {
            window.confirm('Aluno não possui falta')
          }
        }
      })
  }

  protected removerAcompanhamentoSaude(acompanhamento: string) {
    this.http
      .delete<{ message: string }>(
        this.url + `/acompanhamentoSaude/${this.rg_aluno}?acompanhamento=${acompanhamento}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.token
          }
        }
      )
      .subscribe({
        next: (data) => {
          window.confirm(data['message'])
        },
        error: (error) => {
          if (error.status === 401) {
            window.confirm('O Admin não esta mais autorizado. refaça o login para continuar a acessar o sistema')
            this.authService.removeToken()
          }
          if (error.status === 404) {
            window.confirm('Aluno não encontrado')
          }
          if (error.status === 403) {
            window.confirm('Aluno não possui acompanhamento')
          }
        }
      })
  }

  protected removerDeficiencia(id: string) {
    this.http
      .delete<{ message: string }>(this.url + `/deficiencia/${this.rg_aluno}?deficiencia=${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.token
        }
      })
      .subscribe({
        next: (data) => {
          window.confirm(data.message)
        },
        error: (error) => {
          if (error.status === 401) {
            window.confirm('O Admin não esta mais autorizado. refaça o login para continuar a acessar o sistema')
            this.authService.removeToken()
          }
          if (error.status === 404) {
            window.confirm('Aluno não encontrado')
          }
          if (error.status === 403) {
            window.confirm('Aluno não possui deficiência')
          }
        }
      })
  }

  protected removerResponsavel(cpf: string) {
    this.http
      .delete<{ message: string }>(this.url + `/responsavel/${this.rg_aluno}?cpf=${cpf}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.token
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
          if (error.status === 404) {
            window.confirm('Aluno não encontrado')
          }
          if (error.status === 403) {
            window.confirm('Aluno não possui responsável')
          }
        }
      })
  }

  private aprovacao(nota: number) {
    const confirmar = window.confirm('Tem certeza que deseja aprovar este aluno?')
    if (!confirmar) {
      return
    }

    this.http
      .post<{ message: string }>(
        this.url + `/graduacao/${this.rg_aluno}/aprovar/${nota}`,
        {},
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
          window.location.reload()
        },
        error: (error) => {
          if (error.status === 401) {
            window.confirm('O Admin não esta mais autorizado. refaça o login para continuar a acessar o sistema')
            this.authService.removeToken()
            this.router.navigate(['/admin'])
          }
          if (
            error.status === 403 ||
            error.status === 404 ||
            error.status === 406 ||
            error.status === 409 ||
            error.status === 411
          ) {
            window.confirm(error.error.message)
          }
        }
      })
  }

  private reprovacao(nota: number) {
    const confirmar = window.confirm('Tem certeza que deseja reprovar este aluno?')
    if (!confirmar) {
      return
    }

    this.http
      .post<{ message: string }>(
        this.url + `/graduacao/${this.rg_aluno}/reprovar/${nota}`,
        {},
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
            window.confirm(error.error.message)
          }
        }
      })
  }

  private adapterAlunoParaAlunoEditado(aluno: AlunoResponse): AlunoEditado {
    return {
      nome: aluno.nome,
      // dataNascimento: aluno.dataNascimento,
      genero: aluno.genero,
      turma: aluno.turma,
      dadosSociais: aluno.dadosSociais,
      dadosEscolares: aluno.dadosEscolares,
      endereco: aluno.endereco,
      historicoDeSaude: {
        tipoSanguineo: aluno.historicoSaude.tipoSanguineo,
        usoMedicamentoContinuo: aluno.historicoSaude.usoMedicamentoContinuo,
        alergia: aluno.historicoSaude.alergia,
        cirurgia: aluno.historicoSaude.cirurgia,
        doencaCronica: aluno.historicoSaude.doencaCronica
      }
    }
  }

  protected avaliacaoDisponive(): boolean {
    return (
      (this.graduacaoAtual.cargaHoraria >= 30 &&
        new Date(this.graduacaoAtual.inicioGraduacao).getTime() <
          new Date(this.graduacaoAtual.inicioGraduacao).getTime() + this.umaSemanaEmSegundos) ||
      new Date(this.graduacaoAtual.inicioGraduacao).getTime() <
        new Date(this.graduacaoAtual.inicioGraduacao).getTime() + this.tresMesesEmSegundos
    )
  }

  protected isAdmin(): boolean {
    return this.role?.toUpperCase() === 'ADMIN'
  }
}
