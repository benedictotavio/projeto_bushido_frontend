import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SessaoComoAjudarComponent } from './sessao-como-ajudar.component'

describe('SessaoComoAjudarComponent', () => {
  let component: SessaoComoAjudarComponent
  let fixture: ComponentFixture<SessaoComoAjudarComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SessaoComoAjudarComponent],
    })
    fixture = TestBed.createComponent(SessaoComoAjudarComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
