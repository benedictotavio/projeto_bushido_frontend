import { Component, Input, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Turma } from 'src/app/pages/admin/turma.interface'

@Component({
  selector: 'app-card-turma',
  templateUrl: './card-turma.component.html',
  styleUrls: ['./card-turma.component.css']
})
export class CardTurmaComponent implements OnInit {
  @Input()
  turma!: Turma

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.turma['dataCriacao'] = new Date(this.turma['dataCriacao']).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  protected readonly totalDeAlunos = 30
  protected porcetagemDeAlunos = 0
  protected readonly email = this.route.snapshot.params['email']
}
