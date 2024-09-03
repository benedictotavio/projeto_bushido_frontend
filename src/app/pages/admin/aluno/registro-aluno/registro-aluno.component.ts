import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { environment } from 'src/environments/environment'
import { Turma } from '../../turma.interface'
import { AuthService } from 'src/app/services/services-admin/auth.service'
import {
  AlunoProps,
  DadosEscolaresProps,
  DadosSociaisProps,
  EnderecoProps,
  EnderecoViaCepResponse,
  ResponsavelProps,
  historicoSaudeProps
} from '../../types'
import {
  validarCartaoSus,
  validarCep,
  validarCPF,
  validarEmail,
  validarIdadeAluno,
  validarRG,
  validarTelefone
} from '../../validator'
import { NgForm } from '@angular/forms'
import { MatSnackBar } from '@angular/material/snack-bar'
import { AlunoService } from 'src/app/services/services-admin/aluno.service'

@Component({
  selector: 'app-registro-aluno',
  templateUrl: './registro-aluno.component.html',
  styleUrls: ['./registro-aluno.component.css']
})
export class RegistroAlunoComponent implements OnInit {
  imagemSelecionada!: File
  previewImagem!: string | ArrayBuffer | null

  historicoSaude: historicoSaudeProps = this.inicializarHistoricoSaude()
  responsavel: ResponsavelProps = this.inicializarResponsavel()
  dadosEscolares: DadosEscolaresProps = this.inicializarDadosEscolares()
  endereco: EnderecoProps = this.inicializarEndereco()
  dadosSociais: DadosSociaisProps = this.inicializarDadosSociais()
  aluno: AlunoProps = this.inicializarAluno()

  protected turmas: Turma[] = []
  protected readonly email = this.route.snapshot.paramMap.get('email')
  private readonly ApiBushido = `${environment.urlApi}aluno`
  private readonly ApiBushidoComImagem = `${environment.urlApi}aluno/comImagem`
  protected deficiencia = ''
  protected acompanhamentoSaude = ''
  protected tresAnosEmMilisegundos = 1000 * 60 * 60 * 24 * 365 * 3

  constructor(
    private readonly alunoService: AlunoService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.listarTurmas()
  }

  private inicializarHistoricoSaude(): historicoSaudeProps {
    return {
      tipoSanguineo: '',
      usoMedicamentoContinuo: { resposta: '', tipo: '' },
      cirurgia: { resposta: false, tipo: '' },
      alergia: { resposta: false, tipo: '' },
      doencaCronica: { resposta: false, tipo: '' },
      deficiencia: [],
      acompanhamentoSaude: []
    }
  }

  private inicializarResponsavel(): ResponsavelProps {
    return { nome: '', cpf: '', telefone: '', email: '', filiacao: '' }
  }

  private inicializarDadosEscolares(): DadosEscolaresProps {
    return { turno: '', escola: '', serie: null }
  }

  private inicializarEndereco(): EnderecoProps {
    return { estado: '', cidade: '', cep: '', numero: '', logradouro: '' }
  }

  private inicializarDadosSociais(): DadosSociaisProps {
    return {
      bolsaFamilia: false,
      auxilioBrasil: false,
      imovel: '',
      numerosDePessoasNaCasa: null,
      contribuintesDaRendaFamiliar: null,
      alunoContribuiParaRenda: false,
      rendaFamiliar: null
    }
  }

  private inicializarAluno(): AlunoProps {
    return {
      cpf: '',
      rg: '',
      nome: '',
      telefone: '',
      email: '',
      genero: '',
      corDePele: '',
      turma: '',
      cartaoSus: '',
      dataNascimento: null,
      dadosSociais: this.dadosSociais,
      dadosEscolares: this.dadosEscolares,
      endereco: this.endereco,
      responsaveis: this.responsavel,
      graduacao: { kyu: null, dan: null },
      historicoSaude: this.historicoSaude
    }
  }

  private listarTurmas() {
    this.alunoService.listarTurmas().subscribe({
      next: (data) => (this.turmas = data),
      error: (error) => this.alunoService.handleError(error, 'Turma')
    })
  }

  registrarAluno(form: NgForm) {
    if (form.invalid) {
      this.markAllFieldsAsTouched(form)
      this.alunoService.showSnackbar('Preencha os campos obrigatórios e submeta o formulário', 'error-snackbar')
      return
    }

    this.aluno.dataNascimento = new Date(this.aluno.dataNascimento!).getTime()
    const alunoFormData = this.prepareFormData(this.aluno)
    const url = this.imagemSelecionada ? this.ApiBushidoComImagem : this.ApiBushido

    this.alunoService.registrarAluno(url, alunoFormData).subscribe({
      next: (res) => {
        this.alunoService.showSnackbar(res.message, 'success-snackbar')
        this.router.navigate([`/admin/${this.email}/aluno`, res.id])
      },
      error: (error) => this.alunoService.handleError(error, 'Aluno')
    })
  }

  markAllFieldsAsTouched(form: NgForm) {
    Object.keys(form.controls).forEach((field) => {
      const control = form.controls[field]
      control.markAsTouched({ onlySelf: true })
    })
  }

  adicionarAcompanhamento() {
    if (this.valorNoArray(this.historicoSaude.acompanhamentoSaude, this.acompanhamentoSaude)) {
      this.alunoService.showSnackbar('Acompanhamento já adicionado', 'error-snackbar')
      this.acompanhamentoSaude = ''
      return
    }

    if (this.acompanhamentoSaude.trim() !== '') {
      this.historicoSaude.acompanhamentoSaude.push(this.acompanhamentoSaude)
      this.acompanhamentoSaude = ''
    }
  }

  public addDeficiencia(deficiencia: string): void {
    this.deficiencia = deficiencia
    this.adicionarDeficiencia()
  }
  public addAcompanhamento(acompanhamento: string): void {
    this.acompanhamentoSaude = acompanhamento
    this.adicionarAcompanhamento()
  }

  adicionarDeficiencia() {
    if (this.valorNoArray(this.historicoSaude.deficiencia, this.deficiencia)) {
      this.alunoService.showSnackbar('Deficiência já adicionada', 'error-snackbar')
      this.deficiencia = ''
      return
    }

    if (this.deficiencia.trim() !== '') {
      this.historicoSaude.deficiencia.push(this.deficiencia)
      this.deficiencia = ''
    }
  }

  buscarEnderecoPeloCep() {
    if (this.removeSpecialCharacters(this.endereco.cep).length !== 8) {
      return
    }

    this.alunoService.buscarEnderecoPeloCep(this.endereco.cep).subscribe({
      next: (data) => this.updateEndereco(data),
      error: (error) => this.handleCepError(error)
    })
  }

  private updateEndereco(data: EnderecoViaCepResponse) {
    if (data.cep) {
      this.endereco.cep = data.cep
      this.endereco.cidade = data.localidade
      this.endereco.estado = data.uf
      this.endereco.logradouro = data.logradouro
    }
  }

  handleCepError(error: any) {
    if (error.status === 400 || error.status === 404) {
      this.alunoService.showSnackbar('CEP inválido', 'error-snackbar')
      this.aluno.endereco.cep = ''
    }
  }

  private valorNoArray(arrStrings: string[], valor: string) {
    return arrStrings.includes(valor)
  }

  private removeSpecialCharacters(inputString: string): string {
    return inputString.replace(/[-.]/g, '')
  }

  prepareFormData(aluno: AlunoProps): FormData {
    const formData = new FormData()
    formData.append('alunoDTORequest', new Blob([JSON.stringify(aluno)], { type: 'application/json' }))

    if (this.imagemSelecionada != null) {
      formData.append('imagemAluno', this.imagemSelecionada)
    }

    return formData
  }

  selecionarImagem(event: any) {
    if (event.target.files) {
      this.imagemSelecionada = event.target.files[0]
      this.mostrarImagem()
    }
  }

  mostrarImagem() {
    const reader = new FileReader()
    reader.onload = () => {
      this.previewImagem = reader.result
    }
    reader.readAsDataURL(this.imagemSelecionada)
  }

  isDataNascValid(): boolean {
    if (!this.aluno.dataNascimento) {
      return false
    }
    const dateTimestamp = new Date(this.aluno.dataNascimento).getTime()
    return validarIdadeAluno(dateTimestamp)
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

  isEmailValid(email: string | null): boolean {
    return validarEmail(email)
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

  isSerieValid(serie: number | null): boolean {
    return serie === null || (Number(serie) > 0 && Number(serie) <= 9)
  }

  isPessoasNaCasaValid(pessoas: number | null): boolean {
    return pessoas === null || (pessoas > 0 && pessoas <= 15)
  }

  isContribuintesDaRendaValid(contribuintes: number | null): boolean {
    return contribuintes === null || (contribuintes > 0 && contribuintes <= 15)
  }

  isDeficienciaValid(deficiencia: string | null): boolean {
    return !deficiencia || deficiencia.trim().length > 0
  }

  isAcompanhamentoSaudeValid(acompanhamentoSaude: string | null): boolean {
    return !acompanhamentoSaude || acompanhamentoSaude.trim().length > 0
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

  onKyuChange() {
    if (this.aluno.graduacao.kyu !== 1) {
      this.aluno.graduacao.dan = null
    }
  }
}
