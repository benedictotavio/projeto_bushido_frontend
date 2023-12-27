import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SejaUmDoadorComponent } from './seja-um-doador.component';

describe('SejaUmDoadorComponent', () => {
  let component: SejaUmDoadorComponent;
  let fixture: ComponentFixture<SejaUmDoadorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SejaUmDoadorComponent]
    });
    fixture = TestBed.createComponent(SejaUmDoadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
