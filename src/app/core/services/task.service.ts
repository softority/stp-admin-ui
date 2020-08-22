import { Injectable } from '@angular/core';
import { TaskDataService, SkillDataService } from './data.service';
import { TaskViewModel, TaskInfo, SkillVm, SkillStatus } from '../view-models';
import { Observable, throwError, BehaviorSubject, Subject, combineLatest, of } from 'rxjs';
import { switchMap, catchError, flatMap, map, share, publishLast, refCount, tap, switchMapTo, publish, startWith, mergeMap, shareReplay } from 'rxjs/operators';
import { CreateTaskCommand, SkillStateDto } from '../data-contract';
import { ActivatedRoute } from '@angular/router';
import { CreateTaskDialogResult } from 'src/app/admin/create-task-dialog/create-task-dialog.component';

// Manages the tasks
// Load the tasks by category, applies the filter 
@Injectable({
  providedIn: 'root'
})
export class TaskService {

  // private _tasks: BehaviorSubject<TaskViewModel[]> = new BehaviorSubject([]);
  // public readonly tasks$: Observable<TaskViewModel[]> = this._tasks.asObservable();

  filterText$: Observable<string> = new Observable(null);
  allSkills$: Observable<SkillVm[]>;

  private _categoryId: number;
  private _categoryTracker = new Subject();

  private _tasksTracker: Subject<TaskViewModel[]> = new Subject();
  private _tasks$: Observable<TaskViewModel[]>;
  private _tasksStore: { items: TaskViewModel[] } = { items: [] };

  private _skillsTracker = new Subject();

  constructor(
    private _taskDataService: TaskDataService,
    private _skillDataService: SkillDataService,
  ) {

    // this._categoryTracker.pipe(
    //   //tap((categoryId) => this._categoryId = categoryId),
    //   switchMap(() =>
    //     this.taskDataService.getTasksByCategory(this._categoryId).pipe(
    //       map(((x) => x.map((y => new TaskViewModel(y))))),
    //       tap(x => this._tasksStore = x),
    //       tap(x => this._tasksTracker.next(x)),
    //       catchError((err) => { alert(err); return throwError(err); })
    //     )
    //   )
    // );

    // this._categoryTracker
    //   .subscribe(() => console.log(`categoryTracker: ${this._categoryId}`));

    const allTasks$ = this._tasksTracker.asObservable();
    this._tasks$ = allTasks$;
    // apply filter
    // this._tasks$ = combineLatest([allTasks$, this.filterText$]).pipe(
    //   map(([allTasks, filterText]) => filterText ? this.filterTasks(allTasks, filterText) : allTasks)
    // );
    this.allSkills$ = this._skillsTracker.pipe(
      tap(() => console.log(`_skillsTracker. FIRE`)),
      startWith(null),
      switchMap(x => this.getAllSkills())
    );
    //this._skillsTracker.next();
  }

  getTasks(categoryId: number): Observable<TaskViewModel[]> {
    this._categoryId = categoryId;
    const res$ = this.load();
    return res$;
  }

  private load() {
    if (this._categoryId === undefined) {
      throw new Error('Service is not initialized! categoryId is undefined');
    }
    this._taskDataService.getTasksByCategory(this._categoryId).pipe(
      map(((x) => x.map((y => new TaskViewModel(y)))))
    ).subscribe(
      res => {
        this._tasksStore.items = res;
        this._tasksTracker.next(Object.assign({}, this._tasksStore).items);
      },
      err => { alert(err.error); return throwError(err); }
    );
    return this._tasks$;
  }

  updateSkills(taskId: number, skills: SkillVm[]): Observable<SkillVm[]> {
    const dto: SkillStateDto[] = this.getSkillStates(skills);
    if (dto.length === 0) {
      return of(null);
    }
    const res$ = this._taskDataService.updateSkills(taskId, dto).pipe(
      map(x => x.map(y => SkillVm.fromDto(y))),
      tap(() => this.refreshAllSkillsIfNeeded(skills)),
      catchError((err) => { alert(err.error); return throwError(err); })
    );
    return res$;
  }

  private refreshAllSkillsIfNeeded(skills: SkillVm[]){
    if (skills.find(x => x.status === SkillStatus.New)){
      console.log(`refreshAllSkillsIfNeeded. _skillsTracker.next()`)
      // refresh allSkills local catalog 
      this._skillsTracker.next()
    }
  }
  createTask(data: CreateTaskDialogResult): Observable<TaskViewModel> {

    // const res$ = this.taskDataService.createTask(cmd).pipe(map(x => new TaskViewModel(x)))
    //   .subscribe(x => {
    //     //this._tasksStore.push(x);
    //     //this._tasksTracker.next(Object.assign({}, this._tasksStore));        
    //   },
    //   err => alert(err));

    const cmd = {
      name: data.name,
      complexity: data.complexity,
      durationMinutes: data.durationMinutes,
      points: data.points,
      taskCategoryId: this._categoryId,
      type: data.type,
      skills: this.getSkillStates(data.skills)
    };

    //this._tasksTracker.next(Object.assign({}, this._tasksStore).items);
    const res$ = this._taskDataService.createTask(cmd).pipe(
      map(x => new TaskViewModel(x)),
      tap(x => this._tasksStore.items.push(x)),
      tap(() => this._tasksTracker.next(Object.assign({}, this._tasksStore).items)),
      tap(() => this.refreshAllSkillsIfNeeded(data.skills)),
      catchError((err) => { alert(err.error); return throwError(err); })
    );
    return res$;

    // res$.subscribe(res => {
    //   this._tasks.getValue().push(res);
    //   this._tasks.next(this._tasks.getValue());
    // });
  }

  updateTaskPosition(taskId: number, newPosition: number): Observable<TaskViewModel[]> {
    const res$ = this._taskDataService.updateTaskPosition(taskId, newPosition)
      .pipe(
        switchMap(() => this.load()),
        catchError((err) => { alert(err.error); return throwError(err); })
      );
    return res$;
  }


  private filterTasks(tasks: TaskViewModel[], filterText: string): TaskViewModel[] {
    filterText = filterText.toLowerCase();
    const res = tasks.filter(x => x.header.name.toLowerCase().indexOf(filterText) === 0);
    return res;
  }
  private getAllSkills(): Observable<SkillVm[]> {
    // TODO: logic of forcing reload
    // TODO: <??> shareReplay is not working as expected!
    const res$ = this._skillDataService.getAllSkills().pipe(
      map(x => x.map(y => SkillVm.fromDto(y, SkillStatus.Added))),
      //shareReplay(1),
    );
    return res$;
  }
  private getSkillStates(skills: SkillVm[]): SkillStateDto[] {
    const res: SkillStateDto[] = [];
    for (let s of skills.filter(x => x.status !== SkillStatus.Unchanged)) {
      res.push(SkillVm.getSkillState(s));
    }
    return res;
  }

}
