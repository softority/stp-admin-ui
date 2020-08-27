import { Component, OnInit, Input, Output, EventEmitter, ViewChild, HostListener, HostBinding } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';


export interface EditCompletedEventArgs {
  value: string;
  source: EditableLabelInterface;
  //canceled: boolean;
  //valueObject?: Object;
  //handleValueCallback?: (ok: boolean) => void;
}
export interface EditableLabelInterface {
  editMode: boolean;
  processing: boolean;
  error: string;
  value: string;
}

export interface EditableLabelState {
  editMode?: boolean;
  processing?: boolean;
  error?: string;
  value?: string;
}

@Component({
  selector: 'stp-editable-label',
  templateUrl: './editable-label.component.html',
  styleUrls: ['./editable-label.component.scss']
})
export class EditableLabelComponent implements OnInit, EditableLabelInterface {

  @Input()
  placeholder: string;

  @Input()
  value: string;

  @Input()
  state$: Observable<EditableLabelState>;

  @Input()
  inputType: string = 'text';

  @Input()
  editMode: boolean = false;

  @Output()
  public editCompleted = new EventEmitter<EditCompletedEventArgs>();

  @Output()
  public editCanceled = new EventEmitter();

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

  error: string;
  valueCtrl: FormControl;

  processing: boolean = false;

  constructor() {
    
  }

  ngOnInit(): void {
    this.valueCtrl = new FormControl(this.value, Validators.required);
    if (this.state$) {
      this.state$.subscribe(x => {
        if (x.editMode !== undefined) {
          this.editMode = x.editMode;
        }
        if (x.processing !== undefined) {
          this.processing = x.processing;
        }
        if (x.error !== undefined) {
          this.error = x.error;
        }
        if (x.value !== undefined) {
          this.valueCtrl.setValue(x.value);
        }
      })
    }
  }

  applyEdit(event: Event) {
    event.stopPropagation();
    if (!this.valueCtrl.valid) {
      return;
    }

    this.editCompleted.emit(
      {
        value: this.valueCtrl.value,
        source: this
      });
  }

  cancelEdit(event: Event) {
    event.stopPropagation();
    this.valueCtrl.setValue(this.value);
    this.editMode = false;

    this.editCanceled.emit();
  }
}
