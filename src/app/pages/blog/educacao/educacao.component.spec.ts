import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducacaoComponent } from './educacao.component';

describe('EducacaoComponent', () => {
  let component: EducacaoComponent;
  let fixture: ComponentFixture<EducacaoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EducacaoComponent]
    });
    fixture = TestBed.createComponent(EducacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
