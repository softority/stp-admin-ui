import { Component, OnInit, Input, Output, EventEmitter, ViewChild, HostListener, HostBinding } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

export interface EditCompletedEventArgs {
  value?: string;
  canceled: boolean;
  valueObject?: Object;
  handleValueCallback?: (ok: boolean) => void;
}

@Component({
  selector: 'stp-editable-label',
  templateUrl: './editable-label.component.html',
  styleUrls: ['./editable-label.component.scss']
})
export class EditableLabelComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.valueCtrl = new FormControl(this.value, Validators.required);
  }

  valueCtrl: FormControl;
  applyingChanges: boolean = false;

  // @Input()
  // data: any;
  @Input()
  placeholder: string;

  @Input()
  value: string;

  // Object, containing the value. Optional.
  @Input()
  valueObject: Object;

  @Input()
  editing: boolean = false;

  @Input()
  inputType: string = 'text';

  @Output()
  public editCompleted = new EventEmitter<EditCompletedEventArgs>();

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

  applyEdit(event: Event) {
    event.stopPropagation();
    if (!this.valueCtrl.valid) {
      return;
    }
    this.applyingChanges = true;
    this.editCompleted.emit(
      {
        canceled: false,
        value: this.valueCtrl.value,
        valueObject: this.valueObject,
        handleValueCallback:
          (ok) => {
            this.applyingChanges = false;
            if (ok) {
              this.editing = false;
            }
            else {
              this.valueCtrl.setValue(this.value);
            }
            this.value = this.valueCtrl.value;
          }
      });
  }

  cancelEdit(event: Event) {
    event.stopPropagation();
    this.valueCtrl.setValue(this.value);
    this.editing = false;

    this.editCompleted.emit(
      {
        canceled: true,
        valueObject: this.valueObject
      });
  }
}
