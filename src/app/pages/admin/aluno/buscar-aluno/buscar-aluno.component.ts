import { Component } from '@angular/core'
import { AlunoResponse } from '../../aluno.interface'
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'
import { ActivatedRoute, Router } from '@angular/router'
import { AuthService } from 'src/app/services/services-admin/auth.service'

@Component({
  selector: 'app-buscar-aluno',
  templateUrl: './buscar-aluno.component.html'
})
export class BuscarAlunoComponent {
  protected alunos: AlunoResponse[] = []
  protected pesquisarAluno = ''
  private readonly token = localStorage.getItem('token')
  private readonly apiUrl = environment.urlApi + `aluno`
  protected readonly email = this.route.snapshot.paramMap.get('email')
  protected readonly itemsPerPage = 10
  protected currentPage = 1
  protected searchBy = false

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  protected pesquisar() {
    if (this.pesquisarAluno === '') {
      window.alert('Preencha o campo para realizar a busca')
      return
    }
    this.buscarAlunoPorMatricula()
    this.searchBy = true

    this.currentPage = 1
    this.buscarAlunoPorNome()
    this.searchBy = true
  }

  protected buscarAlunoPorMatricula() {
    this.http
      .get<AlunoResponse[]>(this.apiUrl + `?matricula=${this.pesquisarAluno}`, {
        headers: {
          Authorization: 'Bearer ' + this.token
        }
      })
      .subscribe({
        next: (data) => {
          this.alunos = data
        },
        error: (error) => {
          if (error.status === 401) {
            window.alert('O Admin não esta mais autorizado. refaça o login para continuar a acessar o sistema')
            this.authService.removeToken()
            this.router.navigate(['/admin'])
          }
          if (error.status === 404) {
            window.alert(error['error']['message'])
            this.pesquisarAluno = ''
          }
        }
      })
  }

  protected buscarAlunoPorNome() {
    this.http
      .get<AlunoResponse[]>(
        this.apiUrl + `?nome=${this.pesquisarAluno}&page=${this.currentPage - 1}&size=${this.itemsPerPage}`,
        {
          headers: {
            Authorization: 'Bearer ' + this.token
          }
        }
      )
      .subscribe({
        next: (data) => {
          this.alunos = data
        },
        error: (error) => {
          if (error.status === 401) {
            window.alert('O Admin não esta mais autorizado. refaça o login para continuar a acessar o sistema')
            this.authService.removeToken()
            this.router.navigate(['/admin'])
          }
          if (error.status === 404) {
            window.alert('Aluno não encontrado')
            this.pesquisarAluno = ''
          }
        }
      })
  }

  private validarCpf(rg: string) {
    const rgPattern = /^(\d{11})$/
    return rgPattern.test(rg)
  }

  onPageChange(page: number) {
    this.currentPage = page
    this.buscarAlunoPorNome()
  }
}
