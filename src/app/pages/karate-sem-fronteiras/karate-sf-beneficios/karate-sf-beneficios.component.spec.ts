import { ComponentFixture, TestBed } from '@angular/core/testing'

import { KarateSfBeneficiosComponent } from './karate-sf-beneficios.component'

describe('KarateSfBeneficiosComponent', () => {
  let component: KarateSfBeneficiosComponent
  let fixture: ComponentFixture<KarateSfBeneficiosComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KarateSfBeneficiosComponent],
    })
    fixture = TestBed.createComponent(KarateSfBeneficiosComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
