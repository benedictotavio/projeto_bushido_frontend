import { HttpClient } from '@angular/common/http'
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
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
        error: (error) => this.handleError(error),
      })
  }

  protected buscarAlunoPorMatricula() {
    this.http
      .get<AlunoResponse[]>(this.url + `?matricula=${this.matricula_aluno}`, {
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
          this.verificaStatusAluno()
        },
        error: (error) => this.handleError(error),
      })
  }

  protected editarAlunoPorMatricula(): void {  
    if (!this.aluno) {  
        console.error('Aluno não encontrado.');  
        return;  
    }  

    const url = this.imagemSelecionada ? this.urlComImagem : this.url;  
    this.funcaoAuxiliarEditarAlunoPorMatricula(url, `${this.matricula_aluno}`, this.aluno);  
}  

private funcaoAuxiliarEditarAlunoPorMatricula(url: string, matricula: string, aluno: AlunoResponse): void {  
    this.http.put<{ id: string; message: string }>(  
        `${url}/${matricula}`,  
        this.adapterAlunoParaAlunoEditado(aluno),  
        {  
            headers: {  
                Authorization: `Bearer ${this.token}`,  
            },  
        }  
    ).subscribe({  
        next: (data) => {  
            window.confirm(data.message);  
            window.location.reload();  
        },  
        error: (error) => this.handleError(error),  
    });  
}  



  protected adicionarDeficiencia() {
    if (this.deficiencia.trim() !== '') {
      this.http
        .post<{ id: string; message: string }>(
          this.url + `/deficiencia/${this.matricula_aluno}?deficiencia=${this.deficiencia}`,
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
          error: (error) => this.handleError(error),
        })
      this.deficiencia = ''
    }
  }

  protected adicionarAcompanhamentoSaude() {
    if (this.acompanhamentoSaude.trim() !== '') {
      this.http
        .post<{ id: string; message: string }>(
          this.url + `/acompanhamentoSaude/${this.matricula_aluno}?acompanhamento=${this.acompanhamentoSaude}`,
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
          error: (error) => this.handleError(error),
        })
      this.acompanhamentoSaude = ''
    }
  }

  protected removerFalta(falta: string) {
    this.http
      .delete<{ message: string }>(this.url + `/falta/${this.matricula_aluno}/${falta}`, {
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
        error: (error) => this.handleError(error),
      })
  }

  protected removerAcompanhamentoSaude(acompanhamento: string) {
    this.http
      .delete<{ message: string }>(
        this.url + `/acompanhamentoSaude/${this.matricula_aluno}?acompanhamento=${acompanhamento}`,
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
        error: (error) => this.handleError(error),
      })
  }

  protected removerDeficiencia(id: string) {
    this.http
      .delete<{ message: string }>(this.url + `/deficiencia/${this.matricula_aluno}?deficiencia=${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.token
        }
      })
      .subscribe({
        next: (data) => {
          window.confirm(data.message)
        },
        error: (error) => this.handleError(error),
      })
  }

  protected removerResponsavel(cpf: string) {
    this.http
      .delete<{ message: string }>(this.url + `/responsavel/${this.matricula_aluno}?cpf=${cpf}`, {
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
        error: (error) => this.handleError(error),
      })
  }

  private aprovacao(nota: number) {
    const confirmar = window.confirm('Tem certeza que deseja aprovar este aluno?')
    if (!confirmar) {
      return
    }

    this.http
      .post<{ message: string }>(
        this.url + `/graduacao/${this.matricula_aluno}/aprovar/${nota}`,
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
        error: (error) => this.handleError(error),
      })
  }

  private reprovacao(nota: number) {
    const confirmar = window.confirm('Tem certeza que deseja reprovar este aluno?')
    if (!confirmar) {
      return
    }

    this.http
      .post<{ message: string }>(
        this.url + `/graduacao/${this.matricula_aluno}/reprovar/${nota}`,
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
        error: (error) => this.handleError(error),
      })
  }

  protected editarStatusAluno(status: boolean) {
    const confirmar = window.confirm('Tem certeza que deseja alterar o status do aluno?')
    if (!confirmar) {
      return window.location.reload()
    }
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
          window.confirm(data.message)
          window.location.reload()
        },
        error: (error) => this.handleError(error),
      })
  }

  private adapterAlunoParaAlunoEditado(aluno: AlunoResponse): FormData {  
    const formData = new FormData();  
  
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
            doencaCronica: aluno.historicoSaude.doencaCronica,  
        },  
    };  

    formData.append('aluno', new Blob([JSON.stringify(this.alunoEditado)], { type: 'application/json' }));  

    if (this.imagemSelecionada) {  
        formData.append('imagemAluno', this.imagemSelecionada);  
    }  

    return formData;  
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
    if (this.graduacaoAtual.status == true) {
      this.statusDoAluno = 'Ativo'
    } else {
      this.statusDoAluno = 'Inativo'
    }
  }

  alterarStatusAluno(event: Event): void {
    const target = event.target as HTMLInputElement
    if (target.checked) {
      this.graduacaoAtual.status = true
    } else {
      this.graduacaoAtual.status = false
    }
    this.editarStatusAluno(this.graduacaoAtual.status)
  }

  private handleError(error: any): void {  
    switch (error.status) {  
        case 401:  
        window.confirm('O admin não esta mais autorizado. Faça o login para continuar a acessar o sistema')
        this.authService.removeToken()
        this.router.navigate(['/admin'])
            break;  
        case 404:  
        window.confirm('Aluno não encontrado')
        this.router.navigate(['/admin', this.email, 'buscar']) 
            break;  
        case 400:  
        case 403:  
        case 409:  
        case 411:  
            window.confirm(error.error?.message || 'Erro desconhecido');  
            break;  
        default:  
        window.confirm('Erro inesperado:');  
    }  
  }  
}
