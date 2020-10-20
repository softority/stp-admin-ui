import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'stp-enum-select',
  templateUrl: './enum-select.component.html',
  styleUrls: ['./enum-select.component.scss']
})
export class EnumSelectComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  // getComplexityName(value: number) {
  //   return TaskComplexity[value];
  // }
  // complexityValues: number[] = Object.keys(TaskComplexity)
  //   .filter(k => typeof TaskComplexity[k as any] === "string")
  //   .map(x => parseInt(x));

}
