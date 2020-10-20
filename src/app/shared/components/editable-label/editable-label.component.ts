import { Component, OnInit, Input, Output, EventEmitter, ViewChild, HostListener, HostBinding } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';


export interface EditCompletedEventArgs<T extends string | number> {
  value: T;
  //source: EditableLabelInterface;
  //canceled: boolean;
  //valueObject?: Object;
  //handleValueCallback?: (ok: boolean) => void;
}
// export interface EditableLabelInterface {
//   editMode: boolean;
//   processing: boolean;
//   error: string;
//   value: string;
// }

export interface EditableLabelState<T extends string | number> {
  editMode?: boolean;
  processing?: boolean;
  error?: string;
  value?: T;
}

@Component({
  selector: 'stp-editable-label',
  templateUrl: './editable-label.component.html',
  styleUrls: ['./editable-label.component.scss']
})
export class EditableLabelComponent implements OnInit {

  @Input()
  placeholder: string;

  @Input()
  inputType: string = 'text';

  @Output()
  public editCompleted = new EventEmitter<EditCompletedEventArgs<string | number>>();

  @Output()
  public editCanceled = new EventEmitter();

  @Input()
  set state(value: EditableLabelState<string | number>){
    console.log(`EditableLabelComponent. set state: ${JSON.stringify(value)}`);
    if (value) {
      if (value.editMode !== undefined) {
        this.editMode = value.editMode;
      }
      if (value.processing !== undefined) {
        this.processing = value.processing ;
      }
      if (value.error !== undefined) {
        this.error = value.error;
      }
      if (value.value !== undefined) {
        this.value = value.value;
        this.valueCtrl.setValue(value.value);
      }
    }
  }

  value: string | number;
  editMode: boolean = false;
  error: string;
  valueCtrl: FormControl;
  processing: boolean = false;

  private _state: EditableLabelState<string | number>;

  //@ViewChild(HTMLInputElement) input:HTMLInputElement;

  // @HostListener('onblur', ['$event'])
  // handleInputBlur(event: any){
  //   if (event.target instanceof HTMLInputElement){
  //     event.target.focus();
  //   }
  // }
  // Make sure container can receive focus or else blur events won't be seen.
  //@HostBinding('attr.tabindex') tabindex = '0';

  @HostListener('blur', ['$event.target']) onBlur(target) {
    console.log(`onBlur(): ${new Date()} - ${JSON.stringify(target)}`);
  }

  constructor() {
    this.valueCtrl = new FormControl(Validators.required);
  }

  ngOnInit(): void {
    if (this.value !== undefined) {
      this.valueCtrl.setValue(this.value);
    }
  }

  applyEdit(event: Event) {
    event.stopPropagation();
    if (!this.valueCtrl.valid) {
      return;
    }

    this.editCompleted.emit(
      {
        value: this.valueCtrl.value
      });
  }

  cancelEdit(event: Event) {
    event.stopPropagation();
    this.valueCtrl.setValue(this.value);
    this.editMode = false;

    this.editCanceled.emit();
  }
}
