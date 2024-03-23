import { Component } from '@angular/core'
import { AlunoResponse } from '../aluno.interface'
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-buscar-aluno',
  templateUrl: './buscar-aluno.component.html',
  styleUrls: ['./buscar-aluno.component.css'],
})
export class BuscarAlunoComponent {
  
  email = this.route.snapshot.paramMap.get('email')
  rg!: string
  aluno!: AlunoResponse | any

  constructor(private http:HttpClient, private form: FormsModule, private route: ActivatedRoute,  private router: Router,){}

  buscarAluno() {
    const apiUrl = environment.urlApi + `aluno?rg=${this.rg}`;

    this.http.get(apiUrl).subscribe(
      (response) => {
        this.aluno = response;
        console.log("Aluno Encontrado")
      },
      (error) => {
        window.alert('Rg Não existe');
      }
    );

    }
}
