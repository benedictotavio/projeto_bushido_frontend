import { ComponentFixture, TestBed } from '@angular/core/testing'

import { KarateSfOficinasComponent } from './karate-sf-oficinas.component'

describe('KarateSfOficinasComponent', () => {
  let component: KarateSfOficinasComponent
  let fixture: ComponentFixture<KarateSfOficinasComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KarateSfOficinasComponent],
    })
    fixture = TestBed.createComponent(KarateSfOficinasComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
