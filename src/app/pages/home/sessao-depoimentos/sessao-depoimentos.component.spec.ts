import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SessaoDepoimentosComponent } from './sessao-depoimentos.component'

describe('SessaoDepoimentosComponent', () => {
  let component: SessaoDepoimentosComponent
  let fixture: ComponentFixture<SessaoDepoimentosComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SessaoDepoimentosComponent],
    })
    fixture = TestBed.createComponent(SessaoDepoimentosComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
