import { HttpClient } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { environment } from 'src/environments/environment'
import { Turma } from '../../turma.interface'

@Component({
  selector: 'app-registro-aluno',
  templateUrl: './registro-aluno.component.html',
  styleUrls: ['./registro-aluno.component.css'],
})
export class RegistroAlunoComponent implements OnInit {
  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  historicoSaude: historicoSaudeProps = {
    tipoSanguineo: 'A_POSITIVO',
    usoMedicamentoContinuo: {
      resposta: '',
      tipo: '',
    },
    cirurgia: {
      resposta: false,
      tipo: '',
    },
    alergia: {
      resposta: false,
      tipo: '',
    },
    doencaCronica: {
      resposta: false,
      tipo: '',
    },
    deficiencia: [],
    acompanhamentoSaude: [],
  }

  responsavel: ResponsavelProps = {
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
    filiacao: 'OUTRO',
  }

  dadosEscolares: DadosEscolaresProps = {
    turno: 'MANHA',
    escola: '',
    serie: 0,
  }

  endereco: EnderecoProps = {
    estado: '',
    cidade: '',
    cep: '',
    numero: '',
  }

  dadosSociais: DadosSociaisProps = {
    bolsaFamilia: false,
    auxilioBrasil: false,
    imovel: 'PROPRIO',
    numerosDePessoasNaCasa: 0,
    contribuintesDaRendaFamiliar: 0,
    alunoContribuiParaRenda: false,
    rendaFamiliarEmSalariosMinimos: 0,
  }

  aluno: AlunoProps = {
    nome: '',
    genero: 'OUTRO',
    turma: '',
    dataNascimento: new Date().getTime(),
    dadosSociais: this.dadosSociais,
    dadosEscolares: this.dadosEscolares,
    endereco: this.endereco,
    rg: '',
    responsaveis: this.responsavel,
    graduacao: {
      kyu: 7,
      dan: 1,
    },
    historicoSaude: this.historicoSaude,
  }

  protected turmas: Turma[] = []
  private readonly token = localStorage.getItem('token')
  protected readonly email = this.route.snapshot.paramMap.get('email')
  private readonly ApiBushido = environment.urlApi + 'aluno'
  protected deficiencia = ''
  protected acompanhamentoSaude = ''

  ngOnInit(): void {
    this.listarTurmas()
  }

  private buscarTurmaPorNome() {
    this.http
      .get<Turma>(environment.urlApi + `turma/${this.aluno.turma}`, {
        headers: {
          Authorization: 'Bearer ' + this.token,
        },
      })
      .subscribe({
        next: data => {
          this.turmas.push(data)
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

  private listarTurmas() {
    this.http
      .get<Turma[]>(environment.urlApi + 'turma', {
        headers: {
          Authorization: 'Bearer ' + this.token,
        },
      })
      .subscribe({
        next: data => {
          this.turmas = data
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

  registrarAluno() {
    this.aluno.dataNascimento = new Date(this.aluno.dataNascimento).getTime()
    this.http
      .post<{ id: string; message: string }>(this.ApiBushido, this.aluno, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
      })
      .subscribe({
        next: res => {
          window.alert(res.message)
          this.router.navigate([`/admin/${this.email}/aluno`, res.id])
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
        },
      })
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

  private valorNoArray(arrStrings: string[], valor: string) {
    return arrStrings.includes(valor)
  }

  protected buscarEnderecoPeloCep() {
    if (this.removeSpecialCharacters(this.endereco.cep).length !== 8) {
      return
    }

    this.http
      .get<EnderecoViaCepResponse>(
        `https://viacep.com.br/ws/${this.removeSpecialCharacters(this.endereco.cep)}/json/`
      )
      .subscribe({
        next: data => {
          if (data.cep) {
            this.endereco.cep = data.cep
            this.endereco.cidade = data.localidade
            this.endereco.estado = data.uf
            return
          }
          window.confirm('Endereço nao encontrado')
        },
        error: error => {
          if (error.status === 400) {
            window.confirm('CEP inválido')
            this.aluno.endereco.cep = ''
          }
          if (error.status === 404) {
            window.confirm('CEP inválido')
            this.aluno.endereco.cep = ''
          }
        },
      })
  }

  private removeSpecialCharacters(inputString: string): string {
    return inputString.replace(/[-.]/g, '')
  }
}
