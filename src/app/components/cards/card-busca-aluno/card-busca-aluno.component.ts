import { Component, Input } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { AlunoResponse } from 'src/app/pages/admin/aluno.interface'

@Component({
  selector: 'app-card-busca-aluno',
  templateUrl: './card-busca-aluno.component.html',
  styleUrls: ['./card-busca-aluno.component.css']
})
export class CardBuscaAlunoComponent {
  constructor(private route: ActivatedRoute) {}

  @Input()
  aluno: AlunoResponse | undefined
  @Input()
  showPlaceholder = false

  protected email = this.route.snapshot.paramMap.get('email')
}
