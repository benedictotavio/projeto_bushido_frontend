import { HttpClient } from '@angular/common/http'
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { environment } from 'src/environments/environment'
import { AlunoEditado, AlunoResponse, Graduacao } from 'src/app/pages/admin/aluno.interface'
import { AuthService } from 'src/app/services/services-admin/auth.service'
import { Turma } from '../../turma.interface'
import { validarCartaoSus, validarCep, validarCPF, validarEmail, validarRG, validarTelefone } from '../../validator'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatDialog } from '@angular/material/dialog'
import { NotaAlunoDialogComponent } from '../dialog/nota-aluno-dialog/nota-aluno-dialog.component'
import { ConfirmDialogComponent } from '../dialog/confirm-dialog/confirm-dialog.component'
import { AlunoService } from 'src/app/services/services-admin/aluno.service'
import { NgForm } from '@angular/forms'

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
    public dialog: MatDialog,
    private alunoService: AlunoService
  ) {}

  @ViewChild('limparInput', { static: false }) limparInput!: ElementRef

  private readonly token = localStorage.getItem('token')
  aluno: AlunoResponse | undefined
  alunoEditado!: AlunoEditado
  email = this.route.snapshot.paramMap.get('email')
  matricula_aluno = this.route.snapshot.paramMap.get('matricula')
  protected deficiencia = ''
  protected acompanhamentoSaude = ''
  private readonly url = environment.urlApi + 'aluno'
  private readonly urlComImagem = environment.urlApi + 'aluno/comImagem'
  protected modoEdicao = false
  protected modoEdicaoTurma = false
  protected readonly umaSemanaEmSegundos = 604800000
  protected readonly tresMesesEmSegundos = 7776000000
  protected readonly role = localStorage.getItem('role')
  protected turmas: Turma[] = []
  protected nota = 0
  private estadoOriginalToggle!: boolean
  statusDoAluno!: string
  imagemSelecionada!: File
  previewImagem!: string | ArrayBuffer | null
  bloquearAlteracaoImagem = true

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
    this.buscarAlunoPorMatricula()
    this.listarTurmas()
  }

  protected aprovarAluno() {
    const dialogRef = this.dialog.open(NotaAlunoDialogComponent)
    dialogRef.afterClosed().subscribe((nota) => {
      this.aprovacao(nota)
    })
  }

  protected reprovarAluno() {
    const dialogRef = this.dialog.open(NotaAlunoDialogComponent)
    dialogRef.afterClosed().subscribe((nota) => {
      this.reprovacao(nota)
    })
  }

  protected setModoEdicao() {
    this.modoEdicao = !this.modoEdicao
  }

  protected setModoEdicaoTurma() {
    this.modoEdicaoTurma = !this.modoEdicaoTurma
  }

  private listarTurmas() {
    this.alunoService.listarTurmas().subscribe({
      next: (data) => {
        this.turmas = data
      },
      error: (error) => this.alunoService.handleError(error, 'Turma')
    })
  }

  protected buscarAlunoPorMatricula() {
    this.alunoService.buscarAlunoPorMatricula(`${this.matricula_aluno}`).subscribe({
      next: (data) => {
        if (data.length === 0) {
          this.alunoService.showSnackbar('Aluno não encontrado.', 'error-snackbar')
          this.router.navigate(['/admin', this.email, 'buscar'])
        }
        this.aluno = data[0]
        this.aluno.dataPreenchimento = new Date(this.aluno.dataPreenchimento).toLocaleDateString('pt-BR')
        this.aluno.dataNascimento = new Date(this.aluno.dataNascimento).toLocaleDateString('pt-BR')
        this.graduacaoAtual = this.aluno.graduacao[this.aluno.graduacao.length - 1]
        this.verificaStatusAluno()
      },
      error: (error) => this.alunoService.handleError(error, 'Aluno')
    })
  }

  protected editarAlunoPorMatricula(form: NgForm): void {
    if (form.invalid) {
      this.markAllFieldsAsTouched(form)
      this.alunoService.showSnackbar('Preencha os campos obrigatórios e submeta o formulário', 'error-snackbar')
      return
    }
    if (!this.aluno) {
      this.alunoService.showSnackbar('Aluno não encontrado.', 'error-snackbar')
      return
    }

    const url = this.imagemSelecionada ? this.urlComImagem : this.url

    this.alunoService
      .editarAlunoPorMatricula(url, this.aluno.matricula, this.adapterAlunoParaAlunoEditado(this.aluno))
      .subscribe({
        next: (data) => {
          this.alunoService.showSnackbar(data['message'], 'success-snackbar')
          setTimeout(() => {
            window.location.reload()
          }, 3000)
        },
        error: (error) => this.alunoService.handleError(error, 'Aluno')
      })
  }

  adicionarDeficiencia() {
    if (this.deficiencia.trim() !== '') {
      this.alunoService.adicionarDeficiencia(`${this.matricula_aluno}`, this.deficiencia).subscribe({
        next: (data) => {
          this.alunoService.showSnackbar(data['message'], 'success-snackbar')
          setTimeout(() => {
            window.location.reload()
          }, 3000)
        },
        error: (error) => this.alunoService.handleError(error, 'Deficiência')
      })
      this.deficiencia = ''
    }
  }

  protected adicionarAcompanhamentoSaude() {
    if (this.acompanhamentoSaude.trim() !== '') {
      this.alunoService.adicionarAcompanhamentoSaude(`${this.matricula_aluno}`, this.acompanhamentoSaude).subscribe({
        next: (data) => {
          this.alunoService.showSnackbar(data['message'], 'success-snackbar')
          setTimeout(() => {
            window.location.reload()
          }, 3000)
        },
        error: (error) => this.alunoService.handleError(error, 'Acompanhamento de saúde')
      })
      this.acompanhamentoSaude = ''
    }
  }

  protected removerFalta(falta: string) {
    this.alunoService.removerFalta(`${this.matricula_aluno}`, falta).subscribe({
      next: (data) => {
        this.alunoService.showSnackbar(data['message'], 'success-snackbar')
        setTimeout(() => {
          window.location.reload()
        }, 3000)
      },
      error: (error) => this.alunoService.handleError(error, 'Falta')
    })
  }

  protected removerAcompanhamentoSaude(acompanhamento: string) {
    this.alunoService.removerAcompanhamentoSaude(`${this.matricula_aluno}`, acompanhamento).subscribe({
      next: (data) => {
        this.alunoService.showSnackbar(data['message'], 'success-snackbar')
        setTimeout(() => {
          window.location.reload()
        }, 3000)
      },
      error: (error) => this.alunoService.handleError(error, 'Acompanhamento de saúde')
    })
  }

  protected removerDeficiencia(id: string) {
    this.alunoService.removerDeficiencia(`${this.matricula_aluno}`, id).subscribe({
      next: (data) => {
        this.alunoService.showSnackbar(data.message, 'success-snackbar')
        setTimeout(() => {
          window.location.reload()
        }, 3000)
      },
      error: (error) => this.alunoService.handleError(error, 'Deficiência')
    })
  }

  protected removerResponsavel(cpf: string) {
    this.alunoService.removerDeficiencia(`${this.matricula_aluno}`, cpf).subscribe({
      next: (data) => {
        this.alunoService.showSnackbar(data.message, 'success-snackbar')
        setTimeout(() => {
          window.location.reload()
        }, 3000)
      },
      error: (error) => this.alunoService.handleError(error, 'Responável')
    })
  }

  private aprovacao(nota: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Tem certeza que deseja aprovar este aluno?' }
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.alunoService.aprovacao(`${this.matricula_aluno}`, nota).subscribe({
          next: (data) => {
            this.alunoService.showSnackbar(data.message, 'success-snackbar')
            setTimeout(() => {
              window.location.reload()
            }, 3000)
          },
          error: (error) => this.alunoService.handleError(error, 'Aprovar')
        })
      }
    })
  }

  private reprovacao(nota: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Tem certeza que deseja reprovar este aluno?' }
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.http
        this.alunoService.reprovacao(`${this.matricula_aluno}`, nota).subscribe({
          next: (data) => {
            this.alunoService.showSnackbar(data.message, 'success-snackbar')
            setTimeout(() => {
              window.location.reload()
            }, 3000)
          },
          error: (error) => this.alunoService.handleError(error, 'Reprovar')
        })
      }
    })
  }

  confirmarAlterarStatusAluno(event: Event) {
    const novoStatus = (event.target as HTMLInputElement).checked
    this.estadoOriginalToggle = this.graduacaoAtual.status

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Tem certeza que deseja alterar o status do aluno?' }
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.editarStatusAluno(novoStatus)
      } else {
        // eslint-disable-next-line
        (event.target as HTMLInputElement).checked = this.estadoOriginalToggle
      }
    })
  }

  protected editarStatusAluno(status: boolean) {
    this.alunoService.editarStatusAluno(`${this.matricula_aluno}`, status)
    this.http
      .put<{ id: string; message: string }>(
        this.url + `/graduacao/${this.matricula_aluno}/mudarStatus/${status}`,
        {},
        {
          headers: {
            Authorization: 'Bearer ' + this.token
          }
        }
      )
      .subscribe({
        next: (data) => {
          this.alunoService.showSnackbar(data.message, 'success-snackbar')
          setTimeout(() => {
            window.location.reload()
          }, 3000)
        },
        error: (error) => this.alunoService.handleError(error, 'Status')
      })
  }

  private adapterAlunoParaAlunoEditado(aluno: AlunoResponse): FormData {
    const formData = new FormData()

    this.alunoEditado = {
      nome: aluno.nome,
      genero: aluno.genero,
      cpf: aluno.cpf,
      rg: aluno.rg,
      telefone: aluno.telefone,
      email: aluno.email,
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

    formData.append('aluno', new Blob([JSON.stringify(this.alunoEditado)], { type: 'application/json' }))

    if (this.imagemSelecionada) {
      formData.append('imagemAluno', this.imagemSelecionada)
    }

    return formData
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

  selecionarImagem(event: any) {
    this.bloquearAlteracaoImagem = false
    if (event.target.files) {
      this.imagemSelecionada = event.target.files[0]
    }

    this.mostrarImagem()
  }

  mostrarImagem() {
    const reader = new FileReader()
    console.log(reader)
    reader.onload = () => {
      this.previewImagem = reader.result
    }

    reader.readAsDataURL(this.imagemSelecionada)
  }

  removerImagem() {
    this.limparInput.nativeElement.value = ''
    this.bloquearAlteracaoImagem = true
  }

  verificaStatusAluno() {
    this.statusDoAluno = this.graduacaoAtual.status ? 'Ativo' : 'Inativo'
  }

  alterarStatusAluno(event: Event): void {
    const target = event.target as HTMLInputElement
    this.graduacaoAtual.status = target.checked
    this.editarStatusAluno(this.graduacaoAtual.status)
  }

  markAllFieldsAsTouched(form: NgForm) {
    Object.keys(form.controls).forEach((field) => {
      const control = form.controls[field]
      control.markAsTouched({ onlySelf: true })
    })
  }

  isCpfValid(cpf: string): boolean {
    return validarCPF(cpf)
  }

  isRgValid(rg: string | null): boolean {
    return validarRG(rg)
  }

  isCartaoSusValid(cartaoSus: string | null): boolean {
    return validarCartaoSus(cartaoSus)
  }

  isEmailValid(telefone: string | null): boolean {
    return validarEmail(telefone)
  }

  isTelefoneValid(telefone: string | null): boolean {
    return validarTelefone(telefone)
  }

  isCepValid(cep: string | null): boolean {
    return validarCep(cep)
  }

  isRendaValid(renda: number | null): boolean {
    return renda === null || (renda > 0 && renda <= 300000)
  }

  isSerieValid(serie: string | null): boolean {
    return serie === null || (Number(serie) > 0 && Number(serie) <= 9)
  }

  isPessoasNaCasaValid(pessoas: number | null): boolean {
    return pessoas === null || (pessoas > 0 && pessoas <= 15)
  }

  isContribuintesDaRendaValid(contribuintes: number | null): boolean {
    return contribuintes === null || (contribuintes > 0 && contribuintes <= 15)
  }

  isDeficienciaValid(deficienciaInput: string | null): boolean {
    return !deficienciaInput || deficienciaInput.trim().length > 0
  }

  isAcompanhamentoSaudeValid(): boolean {
    const acompanhamentoSaudeInput = this.acompanhamentoSaude
    return !acompanhamentoSaudeInput || acompanhamentoSaudeInput.trim().length > 0
  }

  isAlergiaValid(alergia: string | null): boolean {
    return !alergia || alergia.trim().length > 0
  }

  isUsoMedicamentosValid(usoMedicamentos: string | null): boolean {
    return !usoMedicamentos || usoMedicamentos.trim().length > 0
  }

  isCirurgiasValid(cirurgias: string | null): boolean {
    return !cirurgias || cirurgias.trim().length > 0
  }

  isDoencaCronicaValid(doencaCronica: string | null): boolean {
    return !doencaCronica || doencaCronica.trim().length > 0
  }
}
