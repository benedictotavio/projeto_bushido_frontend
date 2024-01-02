import { ComponentFixture, TestBed } from '@angular/core/testing'

import { KarateSfSobreComponent } from './karate-sf-sobre.component'

describe('KarateSfSobreComponent', () => {
  let component: KarateSfSobreComponent
  let fixture: ComponentFixture<KarateSfSobreComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KarateSfSobreComponent],
    })
    fixture = TestBed.createComponent(KarateSfSobreComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
