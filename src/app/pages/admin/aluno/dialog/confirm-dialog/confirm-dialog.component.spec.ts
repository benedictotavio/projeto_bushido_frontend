import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ConfirmDialogComponent } from './confirm-dialog.component'

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent
  let fixture: ComponentFixture<ConfirmDialogComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmDialogComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: { close: jest.fn() }
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { message: 'Tem certeza?' }
        }
      ]
    })
    fixture = TestBed.createComponent(ConfirmDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('deve fechar o diálogo com true quando confirmado', () => {
    component.onConfirm()
    expect(component.dialogRef.close).toHaveBeenCalledWith(true)
  })

  it('deve fechar o diálogo com false quando cancelado', () => {
    component.onCancel()
    expect(component.dialogRef.close).toHaveBeenCalledWith(false)
  })
})
