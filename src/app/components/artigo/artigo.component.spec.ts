import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtigoComponent } from './artigo.component';

describe('ArtigoComponent', () => {
  let component: ArtigoComponent;
  let fixture: ComponentFixture<ArtigoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArtigoComponent]
    });
    fixture = TestBed.createComponent(ArtigoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
