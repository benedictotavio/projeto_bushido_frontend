import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SessaoMainComponent } from './sessao-main.component'

describe('SessaoMainComponent', () => {
  let component: SessaoMainComponent
  let fixture: ComponentFixture<SessaoMainComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SessaoMainComponent],
    })
    fixture = TestBed.createComponent(SessaoMainComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
