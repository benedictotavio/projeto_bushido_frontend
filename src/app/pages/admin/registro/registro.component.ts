import { Component } from '@angular/core';
import { User } from '../user.interface';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  ApiBushido = 'https://projeto-bushido-backend.onrender.com/api/V1//admin/signup'
  user: User = {
    nome: '',
    email: '',
    cargo: '',
    senha: '',
    role: ''
  };

  constructor(private http: HttpClient) { }

  register() {
    this.http.post(this.ApiBushido, this.user)
      .subscribe(response => {
        console.log('Usuário registrado com sucesso', response);
        // lidar com o registro bem-sucedido aqui
      }, error => {
        console.error('Erro ao registrar usuário', error);
        // lidar com erro aqui
      });
  }

}
