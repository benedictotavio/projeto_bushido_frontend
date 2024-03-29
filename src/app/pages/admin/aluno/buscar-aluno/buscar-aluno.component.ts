import { Component } from '@angular/core'
import { AlunoResponse } from '../../aluno.interface'
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment.development'
import { FormsModule } from '@angular/forms'
import { Router, ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-buscar-aluno',
  templateUrl: './buscar-aluno.component.html',
  styleUrls: ['./buscar-aluno.component.css'],
})
export class BuscarAlunoComponent {
  email = this.route.snapshot.paramMap.get('email')
  rg!: string
  aluno: AlunoResponse | undefined

  constructor(
    private http: HttpClient,
    private form: FormsModule,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  buscarAluno() {
    const apiUrl = environment.urlApi + `aluno?rg=${this.rg}`

    this.http
      .get(apiUrl, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      })
      .subscribe({
        next: data => {
          this.aluno = data as AlunoResponse
        },
        error: error => {
          if (error.status === 401) {
            window.alert('O token informado é inválido')
            localStorage.removeItem('token')
            this.router.navigate(['/admin'])
          }
          if (error.status === 404) {
            window.alert('Aluno não encontrado')
          }
        },
      })
  }
}
