import { HttpClient } from '@angular/common/http'
import { Component } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-modal-falta',
  templateUrl: './modal-falta.component.html',
  styleUrls: ['./modal-falta.component.css'],
})
export class ModalFaltaComponent {
  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  private readonly url = environment.urlApi + 'aluno/falta'
  private readonly token = localStorage.getItem('token')
  private readonly rg = this.route.snapshot.paramMap.get('rg')

  novaFalta = {
    data: '',
    motivo: '',
    observacao: '',
  }

  protected adicionarFalta() {
    this.novaFalta.data = this.dateToMilliseconds(this.novaFalta.data)
    this.http
      .post<{ message: string }>(this.url + `/${this.rg}/${this.novaFalta.data}`, this.novaFalta, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.token,
        },
      })
      .subscribe({
        next: data => {
          window.confirm(data['message'])
          window.location.reload()
        },
        error: error => {
          if (error.status === 401) {
            window.confirm(
              'O admin não esta autorizado a realizar esta ação. Faça o login novamente'
            )
            localStorage.removeItem('token')
            this.router.navigate(['admin'])
          }
          if (error.status === 403) {
            window.confirm('Preencha todas as propriedades corretamente')
          }
          if (error.status === 404) {
            window.confirm('Aluno não encontrado')
          }
          if (error.status === 409) {
            window.confirm('Falta ja existente nessa data')
          }
          if (error.status === 422) {
            window.confirm('Todos os campos devem ser preenchidos corretamente')
          }
        },
      })
  }

  private dateToMilliseconds(dateString: string): string {
    const date = new Date(dateString)
    const timezoneOffsetMilliseconds = date.getTimezoneOffset() * 60 * 1000
    return (date.getTime() + timezoneOffsetMilliseconds).toString()
  }
}
