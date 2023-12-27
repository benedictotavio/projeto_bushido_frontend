import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessaoPatrocinadoresComponent } from './sessao-patrocinadores.component';

describe('SessaoPatrocinadoresComponent', () => {
  let component: SessaoPatrocinadoresComponent;
  let fixture: ComponentFixture<SessaoPatrocinadoresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SessaoPatrocinadoresComponent]
    });
    fixture = TestBed.createComponent(SessaoPatrocinadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
