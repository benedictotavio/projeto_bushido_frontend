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
    dataNascimento: '',
    dadosSociais: this.dadosSociais,
    dadosEscolares: this.dadosEscolares,
    endereco: this.endereco,
    rg: '',
    responsaveis: [],
    graduacao: {
      kyu: 0,
    },
    historicoSaude: this.historicoSaude,
  }
  private readonly token = localStorage.getItem('token')

  email = this.route.snapshot.paramMap.get('email')
  ApiBushido = environment.urlApi + 'aluno'
  deficiencia = ''
  acompanhamentoSaude = ''
  registrarAluno() {
    this.aluno.responsaveis.unshift(this.responsavel)
    this.aluno.nome = this.aluno.nome + ' ' + this.aluno.sobrenome
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
        error: err => {
          console.log(err)
          if (err.status === 401) {
            window.confirm(
              'O Admin não esta mais autorizado. refaça o login para continuar a acessar o sistema'
            )
            localStorage.removeItem('token')
            this.router.navigate(['/admin'])
          }
          if (err.status === 403) {
            window.confirm('Preencha todas as propriedades corretamente')
          }
          if (err.status === 422) {
            window.confirm('Todos os campos devem ser preenchidos corretamente')
          }
          if (err.status === 409) {
            window.confirm('O email informado já foi registrado')
          }
        },
      })
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
