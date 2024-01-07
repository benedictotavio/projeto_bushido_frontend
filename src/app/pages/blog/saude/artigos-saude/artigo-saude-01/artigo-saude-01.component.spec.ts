import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtigoSaude01Component } from './artigo-saude-01.component';

describe('ArtigoSaude01Component', () => {
  let component: ArtigoSaude01Component;
  let fixture: ComponentFixture<ArtigoSaude01Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArtigoSaude01Component]
    });
    fixture = TestBed.createComponent(ArtigoSaude01Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
