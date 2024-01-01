import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SessaoObjetivosComponent } from './sessao-objetivos.component'

describe('SessaoObjetivosComponent', () => {
  let component: SessaoObjetivosComponent
  let fixture: ComponentFixture<SessaoObjetivosComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SessaoObjetivosComponent],
    })
    fixture = TestBed.createComponent(SessaoObjetivosComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
