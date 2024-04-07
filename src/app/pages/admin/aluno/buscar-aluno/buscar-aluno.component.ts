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
  email = this.route.snapshot.paramMap.get('email')
  rg!: string
  aluno: AlunoResponse | undefined

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  buscarAluno() {
    this.showPlaceholder = true // Exibe o placeholder ao clicar no botão Buscar Aluno
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
            this.rg = ''
            this.showPlaceholder = false
          }
        },
      })
  }
}
