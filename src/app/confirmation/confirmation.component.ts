import { Component, Inject } from '@angular/core';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [
    MatDialogActions, 
    MatDialogTitle, 
    MatDialogContent, 
    MatButtonModule, 
    MatInputModule, 
    MatFormFieldModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.css'
})
export class ConfirmationComponent {
  editValue: string = '';

  constructor(
    public dialogRef: MatDialogRef<ConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data && data.value) {
      this.editValue = data.value;
    }
  }

  closeDialog(response: boolean) {
    if (this.data.isEdit && response) {
      this.dialogRef.close(this.editValue);
    } else {
      this.dialogRef.close(response);
    }
  }
}