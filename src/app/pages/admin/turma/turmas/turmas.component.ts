import { HttpClient } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { Turma } from '../../turma.interface'
import { environment } from 'src/environments/environment'
import { AuthService } from 'src/app/services/services-admin/auth.service'

@Component({
  selector: 'app-turmas',
  templateUrl: './turmas.component.html',
  styleUrls: ['./turmas.component.css']
})
export class TurmasComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}
  protected readonly email = this.route.snapshot.paramMap.get('email')
  private readonly apiUrl = environment.urlApi + 'turma'
  private readonly token = localStorage.getItem('token')
  private readonly role = localStorage.getItem('role')
  protected nomeTurma = ''

  turmas: Turma[] = []
  protected readonly minhasTurmas = JSON.parse(localStorage.getItem('turmas') ?? '[]')
  protected turmaEncontrada: Turma | undefined
  protected activeTab = '#tab1'
  protected dataInicial!: number
  protected DataFinal!: number

  ngOnInit(): void {
    if (this.role?.toUpperCase() !== 'ADMIN') {
      this.turmas = this.minhasTurmas
      return
    }
    this.listarTurmas()
  }

  private listarTurmas() {
    this.http
      .get<Turma[]>(this.apiUrl, {
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

  protected buscarTurmaPorNome(nomeTurma: string) {
    this.http
      .get<Turma>(this.apiUrl + `/${nomeTurma}`, {
        headers: {
          Authorization: 'Bearer ' + this.token
        }
      })
      .subscribe({
        next: (data) => {
          this.turmaEncontrada = data
        },
        error: (error) => {
          if (error.status === 401) {
            window.confirm('O Admin não está mais autorizado. refaça o login para continuar a acessar o sistema')
            this.authService.removeToken()
            this.router.navigate(['/admin'])
          }
          if (error.status === 404) {
            window.confirm('Turma não encontrada')
          }
        }
      })
  }

  protected mudarTabs(tabId: string) {
    this.activeTab = tabId
  }

  isAdmin(): boolean {
    return this.role?.toUpperCase() === 'ADMIN'
  }

  buscarPorData(): void{
    const dataInicial =  new Date(this.dataInicial).getTime()
    const DataFinal = new Date(this.DataFinal).getTime()

    this.http.get(this.apiUrl + `{turma?dataInicial=${dataInicial}&dataFinal=${DataFinal}}`, {
      headers: {
        Authorization: 'Bearer ' + this.token
      }
    })
    .subscribe({
      next: (data)=>{
        console.log(data) // buscando turma pela data
        this.turmaEncontrada = data as Turma;
      },
      error: (error) => {
        if (error.status === 401) {
          window.confirm('O Admin não está mais autorizado. refaça o login para continuar a acessar o sistema')
          this.authService.removeToken()
          this.router.navigate(['/admin'])
        }
        if (error.status === 404) {
          window.confirm('Turma não encontrada')
        }
      }

    })}
}
