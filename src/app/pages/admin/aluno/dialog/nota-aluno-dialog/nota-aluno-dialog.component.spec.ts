import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MatDialogRef } from '@angular/material/dialog'
import { NotaAlunoDialogComponent } from './nota-aluno-dialog.component'

describe('NotaAlunoDialogComponent', () => {
  let component: NotaAlunoDialogComponent
  let fixture: ComponentFixture<NotaAlunoDialogComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotaAlunoDialogComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: { close: jest.fn() }
        }
      ]
    })
    fixture = TestBed.createComponent(NotaAlunoDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('deve fechar a caixa de diálogo sem valor quando cancelado', () => {
    component.onNoClick()
    expect(component.dialogRef.close).toHaveBeenCalled()
  })

  it('deve fechar a caixa de diálogo com a nota quando confirmada', () => {
    component.nota = 10
    component.onConfirm()
    expect(component.dialogRef.close).toHaveBeenCalledWith(10)
  })
})
