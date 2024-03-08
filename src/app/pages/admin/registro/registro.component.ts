import { Component } from '@angular/core'
import { User } from '../user.interface'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../../environments/environment'
import { Router } from '@angular/router'

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegistroComponent {
  ApiBushido = environment.urlApi + '/admin/signup'
  user: User = {
    nome: '',
    email: '',
    cargo: '',
    senha: '',
    role: '',
  }

  token = localStorage.getItem("token");

  constructor(private http: HttpClient) {}

  register() {
    this.http.post(this.ApiBushido, this.user).subscribe(
      response => {
        console.log('Usuário registrado com sucesso', response)
        // lidar com o registro bem-sucedido aqui
      },
      error => {
        console.error('Erro ao registrar usuário', error)
        // lidar com erro aqui
      }
    )
  }
}
