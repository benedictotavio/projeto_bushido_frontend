import { Component, Input } from '@angular/core'
import { Graduacao } from 'src/app/pages/admin/aluno.interface'

@Component({
  selector: 'app-modal-historico-graduacao',
  templateUrl: './modal-historico-graduacao.component.html',
  styleUrls: ['./modal-historico-graduacao.component.css']
})
export class ModalHistoricoGraduacaoComponent {
  @Input()
  graduacao!: Graduacao[]

  protected graduacaoFinal(index: number) {
    return index === this.graduacao.length - 1
  }
}
