import { HttpClient } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { environment } from 'src/environments/environment'
import { AlunoResponse } from 'src/app/pages/admin/aluno.interface'

@Component({
  selector: 'app-sessao-aluno',
  templateUrl: './sessao-aluno.component.html',
  styleUrls: ['./sessao-aluno.component.css'],
})
export class SessaoAlunoComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  aluno: AlunoResponse | undefined
  email = this.route.snapshot.paramMap.get('email')

  ngOnInit(): void {
    this.fetchData()
  }

  fetchData() {
    const url = environment.urlApi + `aluno?rg=${this.route.snapshot.paramMap.get('rg')}`

    this.http
      .get(url, {
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
            window.confirm('O token informado é inválido')
            console.error(error)
            setInterval(() => {
              localStorage.removeItem('token')
            }, 3000)
          }
        },
      })
  }
}
