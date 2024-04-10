import { HttpClient } from '@angular/common/http'
import { Component } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-registro-aluno',
  templateUrl: './registro-aluno.component.html',
  styleUrls: ['./registro-aluno.component.css'],
})
export class RegistroAlunoComponent {
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
    sobrenome: '',
    genero: 'OUTRO',
    turma: '',
    dataNascimento: '',
    dadosSociais: this.dadosSociais,
    dadosEscolares: this.dadosEscolares,
    endereco: this.endereco,
    rg: '',
    responsaveis: {
      nome: '',
      cpf: '',
      telefone: '',
      email: '',
      filiacao: 'OUTRO',
    },
    graduacao: {
      kyu: 7,
      dan: 1,
    },
    historicoSaude: this.historicoSaude,
  }

  private readonly token = localStorage.getItem('token')

  email = this.route.snapshot.paramMap.get('email')
  ApiBushido = environment.urlApi + 'aluno'
  deficiencia = ''
  acompanhamentoSaude = ''
  registrarAluno() {
    this.aluno.nome = this.aluno.nome + ' ' + this.aluno.sobrenome
    this.aluno.responsaveis = this.responsavel
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
            error.status === 403 ||
            error.status === 404 ||
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
}
