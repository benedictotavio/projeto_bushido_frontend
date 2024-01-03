import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsporteComponent } from './esporte.component';

describe('EsporteComponent', () => {
  let component: EsporteComponent;
  let fixture: ComponentFixture<EsporteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EsporteComponent]
    });
    fixture = TestBed.createComponent(EsporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
