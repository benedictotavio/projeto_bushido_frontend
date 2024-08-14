import { HttpClient } from '@angular/common/http'
import { Component } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { AuthService } from 'src/app/services/services-admin/auth.service'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-modal-falta',
  templateUrl: './modal-falta.component.html',
  styleUrls: ['./modal-falta.component.css']
})
export class ModalFaltaComponent {
  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService
  ) {}

  private readonly url = environment.urlApi + 'aluno/falta'
  private readonly token = localStorage.getItem('token')
  private readonly matricula = this.route.snapshot.paramMap.get('matricula')

  novaFalta = {
    data: '',
    motivo: '',
    observacao: ''
  }

  protected adicionarFalta() {
    this.novaFalta.data = this.dateToMilliseconds(this.novaFalta.data)
    this.http
      .post<{ message: string }>(this.url + `/${this.matricula}/${this.novaFalta.data}`, this.novaFalta, {
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
        error: (error) => {
          if (error.status === 401) {
            window.confirm('O admin não esta autorizado a realizar esta ação. Faça o login novamente')
            this.authService.removeToken()
            this.router.navigate(['admin'])
          }
          if (
            error.status === 400 ||
            error.status === 403 ||
            error.status === 404 ||
            error.status === 406 ||
            error.status === 409 ||
            error.status === 411
          ) {
            window.confirm(error.error.message)
          }
        }
      })
  }

  private dateToMilliseconds(dateString: string): string {
    if (!dateString) {
      window.confirm('Data inválida')
      throw new Error('Data inválida')
    }

    const date = new Date(dateString)
    const timezoneOffsetMilliseconds = date.getTimezoneOffset() * 60 * 1000
    return (date.getTime() + timezoneOffsetMilliseconds).toString()
  }
}
