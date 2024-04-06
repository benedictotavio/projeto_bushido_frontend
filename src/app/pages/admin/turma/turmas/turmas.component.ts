import { HttpClient } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { Turma } from '../../turma.interface'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-turmas',
  templateUrl: './turmas.component.html',
  styleUrls: ['./turmas.component.css'],
})
export class TurmasComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  protected readonly email = this.route.snapshot.paramMap.get('email')
  private readonly apiUrl = environment.urlApi + 'turma'
  private readonly token = localStorage.getItem('token')
  protected nomeTurma = ''

  turmas: Turma[] = []
  turmaEncontrada: Turma | undefined
  ngOnInit(): void {
    this.listarTurmas()
  }

  private listarTurmas() {
    this.http
      .get<Turma[]>(this.apiUrl, {
        headers: {
          Authorization: 'Bearer ' + this.token,
        },
      })
      .subscribe({
        next: data => {
          this.turmas = data
          console.log(this.turmas)
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

  protected buscarTurmaPorNome(nomeTurma: string) {
    this.http
      .get<Turma>(this.apiUrl + `/${nomeTurma}`, {
        headers: {
          Authorization: 'Bearer ' + this.token,
        },
      })
      .subscribe({
        next: data => {
          this.turmaEncontrada = data
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
}
