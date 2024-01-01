import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SessaoSobreComponent } from './sessao-sobre.component'

describe('SessaoSobreComponent', () => {
  let component: SessaoSobreComponent
  let fixture: ComponentFixture<SessaoSobreComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SessaoSobreComponent],
    })
    fixture = TestBed.createComponent(SessaoSobreComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
