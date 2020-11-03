import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef } from '@angular/core';
import { MultichoiceTaskInfoVm, MultichoiceTaskAnswerVm } from '../../../core/view-models';
import { FormControl, Validators } from '@angular/forms';
import { EditCompletedEventArgs } from 'src/app/shared/components/editable-label/editable-label.component';
import { TaskService } from 'src/app/core/services/task.service';
import { MatCheckboxChange } from '@angular/material/checkbox';


@Component({
  selector: 'stp-multichoice-task-details',
  templateUrl: './multichoice-task-details.component.html',
  styleUrls: ['./multichoice-task-details.component.scss']
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultichoiceTaskDetailsComponent implements OnInit {

  @Input()
  data: MultichoiceTaskInfoVm;

  constructor(
    private _taskService: TaskService
  ) { }

  ngOnInit(): void {
    this.answers = this.data.answers;
    this.questionCtrl = new FormControl(this.data.question, Validators.required);
  }

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

  displayedColumns: string[] = ['id', 'text', 'isCorrect', 'actions'];
  answers: MultichoiceTaskAnswerVm[];
  questionCtrl: FormControl;

  private _pendingAnswer: MultichoiceTaskAnswerVm;

  isAnswerPending(answer: MultichoiceTaskAnswerVm) {
    const res = this._pendingAnswer === answer;
    return res;
  }

  onEditCanceled(answer: MultichoiceTaskAnswerVm) {
    if (answer.id === undefined) {
      // remove answer which about to add
      this.removeAnswerInternal(answer);
    }
  }

  onEditCompleted(event: EditCompletedEventArgs<string>, answer: MultichoiceTaskAnswerVm) {

    this._pendingAnswer = answer;
    answer.state = {
      processing: true
    };

    // if this is new, just added answer
    if (answer.id === undefined) {
      this._taskService.addTaskAnswer({
        taskId: this.data.taskId,
        name: event.value,
        isCorrect: answer.isCorrect
      }).subscribe(
        (res) => {
          answer.id = res.id;
          answer.name = res.name;
          answer.isCorrect = res.isCorrect;

          answer.state = {
            processing: false,
            editMode: false,
            error: null,
            value: res.name
          };
          this._pendingAnswer = undefined;
        },
        (err) => {

          answer.state = {
            processing: false,
            editMode: false,
            error: null, 
            value: answer.name
          };
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
          answer.state = {
            processing: false,
            editMode: false,
            error: null,
            value: event.value
          };
          this._pendingAnswer = undefined;
        },
        (err) => {
          answer.state = {
            processing: false,
            editMode: true,
            error: err.error,
            value: answer.name
          };          
        }
      );
    }
  }

  addAnswer(event: MouseEvent) {
    // TODO: quick decision. Improve UX.
    if (this.answers.find(x => x.id === undefined)) {
      alert('You need to finish adding previous answer!');
      return;
    }
    const newAnswer = new MultichoiceTaskAnswerVm();
    newAnswer.state = {
      editMode: true,
      value: ''
    };
    this.addAnswerInternal(newAnswer);
  }

  onCheckedChanged(event: MatCheckboxChange, answer: MultichoiceTaskAnswerVm) {
    const isCorrect = event.checked;
    if (answer.id === undefined) {
      answer.isCorrect = isCorrect;
    }
    else {
      this._pendingAnswer = answer;
      this._taskService.updateTaskAnswer({
        id: answer.id,
        isCorrect: isCorrect,
        name: answer.name
      }).subscribe(
        () => {
          answer.isCorrect = isCorrect;
          this._pendingAnswer = undefined;
        },
        (err) => {
          // TODO: fix
          event.checked = answer.isCorrect;
        }
      );
    }
  }

  deleteAnswer(answer: MultichoiceTaskAnswerVm) {
    if (!answer.id) {
      // if this is just added answer that hasn't been created on the server
      this.removeAnswerInternal(answer);
      return;
    }
    this._pendingAnswer = answer;
    this._taskService.deleteTaskAnswer(answer.id).subscribe(
      () => {
        this.removeAnswerInternal(answer);
        this._pendingAnswer = undefined;
      },
      (err) => {
        this._pendingAnswer = undefined;
      }
    );
  }

  private addAnswerInternal(newAnswer: MultichoiceTaskAnswerVm) {
    let answersCopy = this.answers.slice();
    answersCopy.push(newAnswer);
    this.answers = answersCopy;
  }

  private removeAnswerInternal(answer: MultichoiceTaskAnswerVm) {
    let answersCopy = this.answers.slice();
    let ind = answersCopy.indexOf(answer);
    answersCopy.splice(ind, 1);
    this.answers = answersCopy;
  }

  // #endregion
}
