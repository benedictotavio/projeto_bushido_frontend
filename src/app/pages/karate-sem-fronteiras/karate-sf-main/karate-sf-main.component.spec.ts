import { ComponentFixture, TestBed } from '@angular/core/testing'

import { KarateSfMainComponent } from './karate-sf-main.component'

describe('KarateSfMainComponent', () => {
  let component: KarateSfMainComponent
  let fixture: ComponentFixture<KarateSfMainComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KarateSfMainComponent],
    })
    fixture = TestBed.createComponent(KarateSfMainComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
