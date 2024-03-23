import { ComponentFixture, TestBed } from '@angular/core/testing'

import { BuscarAlunoComponent } from './buscar-aluno.component'

describe('BuscarAlunoComponent', () => {
  let component: BuscarAlunoComponent
  let fixture: ComponentFixture<BuscarAlunoComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuscarAlunoComponent],
    })
    fixture = TestBed.createComponent(BuscarAlunoComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
