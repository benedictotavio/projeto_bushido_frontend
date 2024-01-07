import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Artigo01Component } from './artigo-01.component';

describe('Artigo01Component', () => {
  let component: Artigo01Component;
  let fixture: ComponentFixture<Artigo01Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Artigo01Component]
    });
    fixture = TestBed.createComponent(Artigo01Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
