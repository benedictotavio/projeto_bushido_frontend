import { HttpClient } from '@angular/common/http'
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

@Component({
  selector: 'app-registro-aluno',
  templateUrl: './registro-aluno.component.html',
  styleUrls: ['./registro-aluno.component.css']
})
export class RegistroAlunoComponent implements OnInit {
  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService
  ) {}

  imagemSelecionada!: File
  previewImagem!: string | ArrayBuffer | null

  historicoSaude: historicoSaudeProps = {
    tipoSanguineo: 'A_POSITIVO',
    usoMedicamentoContinuo: {
      resposta: '',
      tipo: ''
    },
    cirurgia: {
      resposta: false,
      tipo: ''
    },
    alergia: {
      resposta: false,
      tipo: ''
    },
    doencaCronica: {
      resposta: false,
      tipo: ''
    },
    deficiencia: [],
    acompanhamentoSaude: []
  }

  responsavel: ResponsavelProps = {
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
    filiacao: 'OUTRO'
  }

  dadosEscolares: DadosEscolaresProps = {
    turno: 'MANHA',
    escola: '',
    serie: 0
  }

  endereco: EnderecoProps = {
    estado: '',
    cidade: '',
    cep: '',
    numero: '',
    logradouro: ''
  }

  dadosSociais: DadosSociaisProps = {
    bolsaFamilia: false,
    auxilioBrasil: false,
    imovel: 'PROPRIO',
    numerosDePessoasNaCasa: 0,
    contribuintesDaRendaFamiliar: 0,
    alunoContribuiParaRenda: false,
    rendaFamiliar: 0
  }

  aluno: AlunoProps = {
    cpf: '',
    rg: '',
    nome: '',
    genero: 'OUTRO',
    corDePele: '',
    turma: '',
    cartaoSus: '',
    statusAluno: '',
    dataNascimento: 0,
    dataInicioPratica: 0,
    dadosSociais: this.dadosSociais,
    dadosEscolares: this.dadosEscolares,
    endereco: this.endereco,
    responsaveis: this.responsavel,
    graduacao: {
      kyu: 0,
      dan: 0
    },
    historicoSaude: this.historicoSaude
  }

  protected turmas: Turma[] = []
  private readonly token = localStorage.getItem('token')
  protected readonly email = this.route.snapshot.paramMap.get('email')
  private readonly ApiBushido = environment.urlApi + 'aluno'
  private readonly ApiBushidoComImagem = environment.urlApi + 'aluno/comImagem'
  protected deficiencia = ''
  protected acompanhamentoSaude = ''
  protected tresAnosEmMilisegundos = 1000 * 60 * 60 * 24 * 365 * 3

  ngOnInit(): void {
    this.listarTurmas()
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

  protected registrarAluno() {
    const dataNasc = new Date(this.aluno.dataNascimento)

    if (dataNasc.getFullYear() > new Date().getFullYear() - 4) {
      window.confirm('Data de nascimento inválida')
      return
    }

    this.aluno.dataNascimento = dataNasc.getTime()
    const alunoFormData = this.prepareFormData(this.aluno)
    if (this.imagemSelecionada != null) {
      this.http
        .post<{ id: string; message: string }>(this.ApiBushidoComImagem, alunoFormData, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })
        .subscribe({
          next: (res) => {
            window.alert(res.message)
            this.router.navigate([`/admin/${this.email}/aluno`, res.id])
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
              error.status === 406 ||
              error.status === 409 ||
              error.status === 411 ||
              error.status === 422
            ) {
              window.confirm(error['error']['message'])
            }
          }
        })
    } else {
      this.http
      .post<{ id: string; message: string }>(this.ApiBushido, alunoFormData, {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      })
      .subscribe({
        next: (res) => {
          window.alert(res.message)
          this.router.navigate([`/admin/${this.email}/aluno`, res.id])
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
            error.status === 406 ||
            error.status === 409 ||
            error.status === 411 ||
            error.status === 422
          ) {
            window.confirm(error['error']['message'])
          }
        }
      })
    }
  }

  adicionarAcompanhamento() {
    if (this.valorNoArray(this.historicoSaude.acompanhamentoSaude, this.acompanhamentoSaude)) {
      window.confirm('Acompanhamento ja adicionado')
      this.acompanhamentoSaude = ''
      return
    }

    if (this.acompanhamentoSaude.trim() !== '') {
      this.historicoSaude.acompanhamentoSaude.push(this.acompanhamentoSaude)
      this.acompanhamentoSaude = ''
    }
  }

  adicionarDeficiencia() {
    if (this.valorNoArray(this.historicoSaude.deficiencia, this.deficiencia)) {
      window.confirm('Deficiência ja adicionada')
      this.deficiencia = ''
      return
    }

    if (this.deficiencia.trim() !== '') {
      this.historicoSaude.deficiencia.push(this.deficiencia)
      this.deficiencia = ''
    }
  }

  protected buscarEnderecoPeloCep() {
    if (this.removeSpecialCharacters(this.endereco.cep).length !== 8) {
      return
    }

    this.http
      .get<EnderecoViaCepResponse>(`https://viacep.com.br/ws/${this.removeSpecialCharacters(this.endereco.cep)}/json/`)
      .subscribe({
        next: (data) => {
          if (data.cep) {
            this.endereco.cep = data.cep
            this.endereco.cidade = data.localidade
            this.endereco.estado = data.uf
            this.endereco.logradouro = data.logradouro
          }
        },
        error: (error) => {
          if (error.status === 400) {
            window.confirm('CEP inválido')
            this.aluno.endereco.cep = ''
          }
          if (error.status === 404) {
            window.confirm('CEP inválido')
            this.aluno.endereco.cep = ''
          }
        }
      })
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
}
