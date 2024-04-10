import { Component } from '@angular/core'
import { AlunoResponse } from '../../aluno.interface'
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-buscar-aluno',
  templateUrl: './buscar-aluno.component.html',
  styleUrls: ['./buscar-aluno.component.css'],
})
export class BuscarAlunoComponent {
  showPlaceholder = false
  protected alunos: AlunoResponse[] = []
  protected pesquisarAluno = ''
  private readonly token = localStorage.getItem('token')
  private readonly apiUrl = environment.urlApi + `aluno`
  protected readonly email = this.route.snapshot.paramMap.get('email')
  protected readonly itemsPerPage = 10
  protected currentPage = 1
  protected showPagination = false

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  protected pesquisar() {
    if (this.pesquisarAluno === '') {
      window.alert('Preencha o campo para realizar a busca')
      return
    }

    if (this.validarRG(this.pesquisarAluno.trim())) {
      this.buscarAlunoPorRg()
      return
    }

    this.currentPage = 1
    this.showPagination = true
    this.buscarAlunoPorNome()
  }

  protected buscarAlunoPorRg() {
    this.showPlaceholder = true // Exibe o placeholder ao clicar no botão Buscar Aluno

    this.http
      .get<AlunoResponse[]>(this.apiUrl + `?rg=${this.pesquisarAluno}`, {
        headers: {
          Authorization: 'Bearer ' + this.token,
        },
      })
      .subscribe({
        next: data => {
          this.alunos = data
          this.showPlaceholder = false
        },
        error: error => {
          if (error.status === 401) {
            window.alert(
              'O Admin não esta mais autorizado. refaça o login para continuar a acessar o sistema'
            )
            localStorage.removeItem('token')
            this.router.navigate(['/admin'])
          }
          if (error.status === 404) {
            window.alert(error['error']['message'])
            this.pesquisarAluno = ''
            this.showPlaceholder = false
          }
        },
      })
  }

  protected buscarAlunoPorNome() {
    this.http
      .get<AlunoResponse[]>(
        this.apiUrl +
          `?nome=${this.pesquisarAluno}&page=${this.currentPage - 1}&size=${this.itemsPerPage}`,
        {
          headers: {
            Authorization: 'Bearer ' + this.token,
          },
        }
      )
      .subscribe({
        next: data => {
          this.alunos = data
          this.showPlaceholder = false
        },
        error: error => {
          if (error.status === 401) {
            window.alert(
              'O Admin não esta mais autorizado. refaça o login para continuar a acessar o sistema'
            )
            localStorage.removeItem('token')
            this.router.navigate(['/admin'])
          }
          if (error.status === 404) {
            window.alert('Aluno não encontrado')
            this.pesquisarAluno = ''
            this.showPlaceholder = false
          }
        },
      })
  }

  private validarRG(rg: string) {
    const rgPattern = /^\d{9}$/
    return rgPattern.test(rg)
  }

  onPageChange(page: number) {
    this.currentPage = page
    this.buscarAlunoPorNome()
    console.log(this.itemsPerPage, this.alunos.length, this.currentPage - 1)
  }
}
