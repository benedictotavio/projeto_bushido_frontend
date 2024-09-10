import { Component } from '@angular/core'
import { MatDialogRef } from '@angular/material/dialog'

@Component({
  selector: 'app-nota-aluno-dialog',
  template: `
    <h1 mat-dialog-title>Insira a Nota do Aluno</h1>
    <div mat-dialog-content>
      <form>
        <div class="mb-3">
          <label for="nota" class="form-label">Nota</label>
          <input id="nota" [(ngModel)]="nota" name="nota" type="number" class="form-control" />
        </div>
      </form>
    </div>
    <div mat-dialog-actions class="d-flex">
      <div class="flex-fill me-2">
        <button class="btn btn-success w-100" (click)="onConfirm()">Confirmar</button>
      </div>
      <div class="flex-fill">
        <button class="btn btn-danger w-100" (click)="onNoClick()">Cancelar</button>
      </div>
    </div>
  `
})
export class NotaAlunoDialogComponent {
  nota!: number

  constructor(public dialogRef: MatDialogRef<NotaAlunoDialogComponent>) {}

  onNoClick(): void {
    this.dialogRef.close()
  }

  onConfirm(): void {
    this.dialogRef.close(this.nota)
  }
}
