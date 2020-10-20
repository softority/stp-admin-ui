import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

export class PromptDialogData {
  title?: string;
  placeholder?: string;
  name?: string;
}

@Component({
  selector: 'stp-prompt-dialog',
  templateUrl: './prompt-dialog.component.html',
  styleUrls: ['./prompt-dialog.component.scss']
})
export class PromptDialogComponent {

  form: FormGroup;
  title: string;
  placeholder: string;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PromptDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PromptDialogData) {

    this.title = data.title;
    this.placeholder = data.placeholder;

    this.form = fb.group({
      name: [data.name, Validators.required]
    });
  }

  // onCancelClick(): void {
  //   this.dialogRef.close();
  // }

  onOkClick(): void {
    this.dialogRef.close(this.form.value?.name);
  }

}
