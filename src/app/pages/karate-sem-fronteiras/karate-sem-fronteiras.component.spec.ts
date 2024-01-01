import { ComponentFixture, TestBed } from '@angular/core/testing'

import { KarateSemFronteirasComponent } from './karate-sem-fronteiras.component'

describe('KarateSemFronteirasComponent', () => {
  let component: KarateSemFronteirasComponent
  let fixture: ComponentFixture<KarateSemFronteirasComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KarateSemFronteirasComponent],
    })
    fixture = TestBed.createComponent(KarateSemFronteirasComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
