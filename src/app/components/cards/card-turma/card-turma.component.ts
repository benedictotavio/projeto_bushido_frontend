import { Component, Input } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Turma } from 'src/app/pages/admin/turma.interface'

@Component({
  selector: 'app-card-turma',
  templateUrl: './card-turma.component.html',
  styleUrls: ['./card-turma.component.css']
})
export class CardTurmaComponent {
  @Input()
  turma!: Turma

  constructor(private route: ActivatedRoute) {}

  protected readonly totalDeAlunos = 30
  protected porcetagemDeAlunos = 0
  protected readonly email = this.route.snapshot.params['email']
}
