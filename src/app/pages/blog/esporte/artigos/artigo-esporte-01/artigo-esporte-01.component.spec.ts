import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ArtigoEsporte01Component } from './artigo-esporte-01.component'

describe('ArtigoEsporte01Component', () => {
  let component: ArtigoEsporte01Component
  let fixture: ComponentFixture<ArtigoEsporte01Component>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArtigoEsporte01Component],
    })
    fixture = TestBed.createComponent(ArtigoEsporte01Component)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
