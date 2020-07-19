import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef } from '@angular/core';
import { MultichoiceTaskData, Answer } from '../../../core/interfaces';
import { FormControl, Validators } from '@angular/forms';
import { DataService } from 'src/app/core/services/data.service';
import { allowedNodeEnvironmentFlags } from 'process';


@Component({
  selector: 'stp-multichoice-task-details',
  templateUrl: './multichoice-task-details.component.html',
  styleUrls: ['./multichoice-task-details.component.scss']
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultichoiceTaskDetailsComponent implements OnInit {

  constructor(
    private _dataService: DataService
  ) { }

  private _editableAnswer: Answer;
  private _pendingAnswer: Answer;

  ngOnInit(): void {
    this.answers = this.data.answers;
    this.questionCtrl = new FormControl(this.data.question, Validators.required);
  }

  @Input()
  data: MultichoiceTaskData;

  //#region QUESTION

  questionEditing: boolean;

  applyQuestionEdit(event:Event){
    event.stopPropagation();
    if (!this.questionCtrl.valid){
      return;
    }

    this.data.question = this.questionCtrl.value;
    this.questionEditing = false;
  }

  cancelQuestionEdit(event:Event){
    event.stopPropagation();
    this.questionCtrl.setValue(this.data.question);
    this.questionEditing = false;
  }

  //#endregion

  // #region ANSWERS

  displayedColumns: string[] = ['id', 'text', 'isCorrect', 'actions'];
  answers: Answer[];
  questionCtrl: FormControl;

  onAnswerClick(answer: Answer) {
    this._editableAnswer = answer;
  }

  isAnswerEditable(answer: Answer): boolean {
    const res = this._editableAnswer === answer;
    return res;
  }

  isAnswerPending(answer: Answer){
    const res = this._pendingAnswer === answer;
    return res;
  }
  
  applyAnswerEdit(event: Event, answer: Answer, input: HTMLInputElement) {
    event.stopPropagation();
    this._pendingAnswer = answer;
    
    answer.text = input.value;

    // if this is new, just added answer
    if (answer.id === undefined) {
      this._dataService.addAnswer(this.data.taskId, answer)
        .subscribe(res => {
          this._pendingAnswer = undefined;
          this._editableAnswer = undefined;
          if (!res){
            alert('Adding answer failed. ' + res.message);
          }
        },
        err => {
          alert('Adding answer failed. ' + err);
        });   
    }
  }

  cancelAnswerEdit(event: Event, answer: Answer, input: HTMLInputElement) {
    event.stopPropagation();
    this._editableAnswer = undefined;

    // if this is new, just added answer
    if (answer.id === undefined) {
      // remove answer which about to add
      this.removeAnswerInternal(answer);
    }
    else {
      input.value = answer.text;
    }
  }

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
    const newAnswer = { text: '', isCorrect: false };
    this.addAnswerInternal(newAnswer);
    this._editableAnswer = newAnswer;
  }

  deleteAnswer(answer: Answer) {
    this.removeAnswerInternal(answer);
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
