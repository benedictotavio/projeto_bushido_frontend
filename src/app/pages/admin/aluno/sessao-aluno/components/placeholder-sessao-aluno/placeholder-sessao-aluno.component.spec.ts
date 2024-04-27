import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PlaceholderSessaoAlunoComponent } from './placeholder-sessao-aluno.component'

describe('PlaceholderSessaoAlunoComponent', () => {
  let component: PlaceholderSessaoAlunoComponent
  let fixture: ComponentFixture<PlaceholderSessaoAlunoComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlaceholderSessaoAlunoComponent]
    })
    fixture = TestBed.createComponent(PlaceholderSessaoAlunoComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
