import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef } from '@angular/core';
import { MultichoiceTaskData, Answer } from '../../../core/view-models';
import { FormControl, Validators } from '@angular/forms';
import { DataService } from 'src/app/core/services/data.service';
import { allowedNodeEnvironmentFlags } from 'process';
import { EditCompletedEventArgs } from 'src/app/shared/editable-label/editable-label.component';
import { TaskService } from 'src/app/core/services/task.service';


@Component({
  selector: 'stp-multichoice-task-details',
  templateUrl: './multichoice-task-details.component.html',
  styleUrls: ['./multichoice-task-details.component.scss']
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultichoiceTaskDetailsComponent implements OnInit {

  constructor(
    //private _dataService: DataService
    private _taskService: TaskService
  ) { }


  ngOnInit(): void {
    this.answers = this.data.answers;
    this.questionCtrl = new FormControl(this.data.question, Validators.required);
  }

  @Input()
  data: MultichoiceTaskData;

  //#region QUESTION

  questionEditing: boolean;

  applyQuestionEdit(event: Event) {
    event.stopPropagation();
    if (!this.questionCtrl.valid) {
      return;
    }

    this.data.question = this.questionCtrl.value;
    this.questionEditing = false;
  }

  cancelQuestionEdit(event: Event) {
    event.stopPropagation();
    this.questionCtrl.setValue(this.data.question);
    this.questionEditing = false;
  }

  //#endregion

  // #region ANSWERS

  private _pendingAnswer: Answer;

  displayedColumns: string[] = ['id', 'text', 'isCorrect', 'actions'];
  answers: Answer[];
  questionCtrl: FormControl;

  // onAnswerClick(answer: Answer) {
  //   this._editableAnswer = answer;
  // }

  // isAnswerEditable(answer: Answer): boolean {
  //   const res = this._editableAnswer === answer;
  //   return res;
  // }

  isAnswerPending(answer: Answer) {
    const res = this._pendingAnswer === answer;
    return res;
  }

  onEditCanceled(answer: Answer) {
    if (answer.id === undefined) {
      // remove answer which about to add
      this.removeAnswerInternal(answer);
    }
  }

  onEditCompleted(event: EditCompletedEventArgs, answer: Answer) {

    this._pendingAnswer = answer;
    event.source.processing = true;
    //this._pendingAnswer.nameStateTracker.next({ processing: true });

    // if this is new, just added answer
    if (answer.id === undefined) {
      this._taskService.addTaskAnswer({
        taskId: this.data.taskId,
        name: event.value,
        isCorrect: answer.isCorrect
      }).subscribe(
        (res) => {
          answer.id = res.id;
          answer.text = res.text;
          answer.isCorrect = res.isCorrect;

          //this._pendingAnswer.nameStateTracker.next({ processing: false, editMode: false, error: null });
          event.source.processing = false;
          event.source.editMode = false;          
          event.source.error = null;

          this._pendingAnswer = undefined;
        },
        (err) => {
          //this._pendingAnswer.nameStateTracker.next({ processing: false, editMode: true, error: err.error, value: answer.text });
          event.source.processing = false;
          event.source.editMode = true;          
          event.source.error = err.error;
          event.source.value = answer.text;          
        }
      );
    }
    else {

      this._taskService.updateTaskAnswer({
        id: answer.id,
        isCorrect: answer.isCorrect,
        name: event.value
      }).subscribe(
        () => {
          answer.text = event.value;
          //this._pendingAnswer.nameStateTracker.next({ processing: false, editMode: false, error: null });
          event.source.processing = false;
          event.source.editMode = false;          
          event.source.error = null;
          this._pendingAnswer = undefined;
        },
        (err) => {
          //this._pendingAnswer.nameStateTracker.next({ processing: false, editMode: true, error: err.error, value: answer.text });
          event.source.processing = false;
          event.source.editMode = true;          
          event.source.error = err.error;
          event.source.value = answer.text;          
        }
      );
    }
    //   this._dataService.addAnswer(this.data.taskId, answer)
    //     .subscribe(res => {

    //       if (!res) {
    //         alert('Adding answer failed. ' + res.message);
    //       }
    //       event.handleValueCallback(res.ok);
    //       this._pendingAnswer = undefined;
    //     },
    //       err => {
    //         alert('Adding answer failed. ' + err);
    //         event.handleValueCallback(false);
    //         this._pendingAnswer = undefined;
    //       });
    // }
    // else {
    //   if (!event.canceled) {
    //     answer.text = event.value;
    //     event.handleValueCallback(true);
    //   }
    // }
    //setTimeout(() => event.handleValueCallback(true), 2000);    
  }

  // applyAnswerEdit(event: Event, answer: Answer, input: HTMLInputElement) {
  //   event.stopPropagation();
  //   this._pendingAnswer = answer;

  //   answer.text = input.value;

  //   // if this is new, just added answer
  //   if (answer.id === undefined) {
  //     this._dataService.addAnswer(this.data.taskId, answer)
  //       .subscribe(res => {
  //         this._pendingAnswer = undefined;
  //         this._editableAnswer = undefined;
  //         if (!res) {
  //           alert('Adding answer failed. ' + res.message);
  //         }
  //       },
  //         err => {
  //           alert('Adding answer failed. ' + err);
  //         });
  //   }
  // }

  // cancelAnswerEdit(event: Event, answer: Answer, input: HTMLInputElement) {
  //   event.stopPropagation();
  //   this._editableAnswer = undefined;

  //   // if this is new, just added answer
  //   if (answer.id === undefined) {
  //     // remove answer which about to add
  //     this.removeAnswerInternal(answer);
  //   }
  //   else {
  //     input.value = answer.text;
  //   }
  // }

  // TODO: Hide editor without focus when clicking outside
  // onEditorFocusout(event: Event){
  //   event.stopPropagation();
  //   this._editableAnswer = undefined;
  // }

  addAnswer(event: MouseEvent) {
    // TODO: quick decision. Improve UX.
    if (this.answers.find(x => x.id === undefined)) {
      alert('You need to finish adding previous answer!');
      return;
    }
    const newAnswer = new Answer();
    // { text: '', isCorrect: false };
    this.addAnswerInternal(newAnswer);
    //this._editableAnswer = newAnswer;
  }

  deleteAnswer(answer: Answer) {
    if (!answer.id) {
      throw new Error("Anwer must have an id");
    }
    //this._pendingAnswer.nameStateTracker.next({ processing: true });
    this._pendingAnswer = answer;
    this._taskService.deleteTaskAnswer(answer.id).subscribe(
      () => {
        //this._pendingAnswer.nameStateTracker.next({ processing: false, editMode: false, error: null });
        this.removeAnswerInternal(answer);
        this._pendingAnswer = undefined;
      },
      (err) => {
        this._pendingAnswer = undefined;
        //this._pendingAnswer.nameStateTracker.next({ processing: false, error: err.error });
      }
    );
  }

  private addAnswerInternal(newAnswer: Answer) {
    let answersCopy = this.answers.slice();
    answersCopy.push(newAnswer);
    this.answers = answersCopy;
  }

  private removeAnswerInternal(answer: Answer) {
    let answersCopy = this.answers.slice();
    let ind = answersCopy.indexOf(answer);
    answersCopy.splice(ind, 1);
    this.answers = answersCopy;
  }

  // #endregion
}
