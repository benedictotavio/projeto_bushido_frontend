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
    fatorRh: 'POSITIVO',
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
    imovel: 'PRÓPRIO',
    numerosDePessoasNaCasa: 0,
    contribuintesDaRendaFamiliar: 0,
    alunoContribuiParaRenda: false,
    rendaFamiliarEmSalariosMinimos: 0,
  }

  aluno: AlunoProps = {
    nome: '',
    sobrenome: '',
    genero: 'OUTRO',
    dataNascimento: '',
    dadosSociais: this.dadosSociais,
    dadosEscolares: this.dadosEscolares,
    endereco: this.endereco,
    rg: '',
    responsaveis: [],
    graduacao: {
      kyu: 0,
      frequencia: 0,
    },
    historicoSaude: this.historicoSaude,
  }

  ApiBushido = environment.urlApi + 'aluno'
  private readonly token = localStorage.getItem('token')
  private deficiencia = ''
  private acompanhamentoSaude = ''
  registrarAluno() {
    this.aluno.responsaveis.unshift(this.responsavel)
    console.log(this.aluno)
    console.log(JSON.stringify(this.aluno))
    this.http
      .post<{ id: string; message: string }>(this.ApiBushido, this.aluno, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
      })
      .subscribe(
        response => {
          this.router.navigate([
            `/admin/${this.route.snapshot.paramMap.get('email')}/aluno`,
            this.aluno.rg,
          ])
          window.alert(response.message)
        },
        error => {
          if (error.status === 401) {
            localStorage.removeItem('token')
            this.router.navigate(['/admin'])
          }
          if (error.status === 403) {
            localStorage.removeItem('token')
            this.router.navigate(['/admin'])
          }
          console.error(error)
        }
      )
  }

  adicionarAcompanhamento() {
    if (this.acompanhamentoSaude.trim() !== '') {
      this.historicoSaude.acompanhamentoSaude.push(this.acompanhamentoSaude)
      this.acompanhamentoSaude = ''
    }
  }

  adicionarDeficiencia() {
    if (this.deficiencia.trim() !== '') {
      this.historicoSaude.deficiencia.push(this.deficiencia)
      this.deficiencia = ''
    }
  }
}
