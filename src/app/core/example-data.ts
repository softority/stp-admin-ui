import { TaskSectionViewModel } from 'src/app/core/interfaces'
import { TaskVm, MultichoiceTaskAnswerVm, MultichoiceTaskInfoVm} from 'src/app/core/view-models'
import { TaskListComponent } from '../admin/task-list/task-list.component';
import { TaskComplexity } from './data-contract';

export const answers: MultichoiceTaskAnswerVm[] = [
  {id: 1, name: 'Addition will produce result 1.', isCorrect: false, state: {value: 'Addition will produce result 1.'}},
  {id: 2,name: 'Result of addition is system-dependent.', isCorrect: false, state: {value: 'Result of addition is system-dependent.'}},
  {id: 3, name: 'Program will generate run-time exception.', isCorrect: false, state: {value: 'Program will generate run-time exception.'}},
  {id: 4, name: 'Compiler will report an error: Operator \'+\' is not defined for types T and int.', isCorrect: true, state: {value: 'Compiler will report an error: Operator \'+\' is not defined for types T and int.'}},
  {id: 5, name: 'None of the above.', isCorrect: false, state: {value: 'None of the above.'}}  
];


export const multichoiceData: MultichoiceTaskInfoVm = {
  question: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  answers: answers
}



export const tasks: TaskVm[] = [
  {
    header:
    {
      id: 1,
      name: 'Array dimensions question with generics constraints and basics v02 MR',
      type: 'Multi-choice',
      skills: [],
      points: 20,
      duration: 7,
      complexity: TaskComplexity.High,
      state: {}
    },
    content: multichoiceData
  },
  {
    header:
    {
      id: 2,
      name: 'Task 2',
      type: 'Multi-choice',
      skills: [],
      points: 20,
      duration: 7,
      complexity: TaskComplexity.High,
      state: {}
    },
    content: multichoiceData
  },
  {
    header:
    {
      id: 3,
      name: 'Task 3',
      type: 'Multi-choice',
      skills: [],
      points: 20,
      duration: 7,
      complexity: TaskComplexity.High,
      state: {}
    },
    content: multichoiceData
  },
  {
    header:
    {
      id: 4,
      name: 'Task 4',
      type: 'Multi-choice',
      skills: [],
      points: 20,
      duration: 7,
      complexity: TaskComplexity.High,
      state: {}
    },
    content: multichoiceData
  },
]
export const tasks2: TaskVm[] = [
  {
    header:
    {
      id: 1,
      name: 'Array dimensions question with generics constraints and basics v02 MR',
      type: 'Multi-choice',
      skills: [],
      points: 20,
      duration: 7,
      complexity: TaskComplexity.High,
      state: {}
    },
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam porttitor non mauris eu aliquet. Curabitur eros purus, porttitor congue convallis vitae, hendrerit non velit. Nulla facilisi. Sed eros mi, scelerisque in enim sit amet, facilisis efficitur ipsum. Duis ac ex efficitur, ullamcorper lacus ut, varius augue. In hac habitasse platea dictumst. Aliquam lobortis leo ut turpis consequat venenatis. Donec in tortor massa. Donec diam nulla, consequat eget imperdiet nec, lacinia et metus.Nam consequat euismod erat. Etiam eget porttitor massa, nec posuere tellus. Sed imperdiet aliquet dui, nec vulputate massa vulputate sed. Sed nunc magna, tristique efficitur cursus at, bibendum eu dui. Fusce lacinia arcu nunc. Nulla consequat urna id imperdiet iaculis. Phasellus fermentum tristique arcu, ac ullamcorper est finibus nec. Phasellus elementum, felis et pellentesque cursus, sapien lectus convallis justo, a consequat eros turpis vel arcu. Vivamus elementum posuere risus, venenatis laoreet urna porttitor a. Sed a porttitor sem. Phasellus velit erat, lobortis quis augue vel, porta euismod libero. Sed quis finibus sem. Nullam mollis, augue ac elementum dignissim, sem nibh vestibulum arcu, sed auctor sapien augue vehicula diam. Proin sem lectus, pharetra sed interdum sit amet, sollicitudin eu leo. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Proin facilisis quam lectus, vitae mattis urna dapibus at. Nam et facilisis magna, eget dignissim dui. Aliquam bibendum ullamcorper mauris eget eleifend. Phasellus vulputate felis eget quam porttitor finibus. Aenean malesuada est at mattis ornare. Curabitur sed velit sodales, placerat justo vel, iaculis lorem. Fusce id finibus mauris. Donec efficitur eros et justo dignissim auctor. Aenean dictum facilisis purus aliquet venenatis. Donec non dignissim nulla, sit amet molestie erat. Morbi ut velit a ante facilisis tempor non eu ante. Sed vehicula lacus ac turpis ullamcorper, in vehicula magna luctus. Morbi tortor eros, elementum sit amet facilisis id, accumsan non dui. Donec massa ante, eleifend nec lorem quis, blandit accumsan quam. Aliquam lobortis velit vitae enim eleifend, a porta quam dapibus. Nulla venenatis porttitor metus. Nunc nisi ante, tincidunt in elementum vitae, finibus ac mi. Proin ornare arcu et vestibulum posuere. Maecenas quis massa congue, finibus lacus eget, consectetur ex. Vivamus lacinia nulla in risus elementum, at semper lectus congue. Vestibulum ut tincidunt ante. Proin et vehicula odio. Nam luctus, ligula at tristique pulvinar, purus nunc euismod libero, at dapibus quam felis in orci. Phasellus in ornare tellus. Pellentesque vel molestie mauris. Sed sit amet lectus erat. Nullam quis congue mi.'
  },
  {
    header:
    {
      id: 2,
      name: 'Task 2',
      type: 'Multi-choice',
      skills: [],
      points: 20,
      duration: 7,
      complexity: TaskComplexity.High,
      state: {}
    },
    content: '_Content 2'
  },
  {
    header:
    {
      id: 3,
      name: 'Task 3',
      type: 'Multi-choice',
      skills: [],
      points: 20,
      duration: 7,
      complexity: TaskComplexity.High,
      state: {}
    },
    content: '_Content 3'
  },
  {
    header:
    {
      id: 4,
      name: 'Task 4',
      type: 'Multi-choice',
      skills: [],
      points: 20,
      duration: 7,
      complexity: TaskComplexity.High,
      state: {}
    },
    content: '_Content 4'
  },
]
export const tasks3: TaskVm[] = [
  {
    header:
    {
      id: 1,
      name: 'Array dimensions question with generics constraints and basics v02 MR',
      type: 'Multi-choice',
      skills: [],
      points: 20,
      duration: 7,
      complexity: TaskComplexity.High,
      state: {}
    },
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam porttitor non mauris eu aliquet. Curabitur eros purus, porttitor congue convallis vitae, hendrerit non velit. Nulla facilisi. Sed eros mi, scelerisque in enim sit amet, facilisis efficitur ipsum. Duis ac ex efficitur, ullamcorper lacus ut, varius augue. In hac habitasse platea dictumst. Aliquam lobortis leo ut turpis consequat venenatis. Donec in tortor massa. Donec diam nulla, consequat eget imperdiet nec, lacinia et metus.Nam consequat euismod erat. Etiam eget porttitor massa, nec posuere tellus. Sed imperdiet aliquet dui, nec vulputate massa vulputate sed. Sed nunc magna, tristique efficitur cursus at, bibendum eu dui. Fusce lacinia arcu nunc. Nulla consequat urna id imperdiet iaculis. Phasellus fermentum tristique arcu, ac ullamcorper est finibus nec. Phasellus elementum, felis et pellentesque cursus, sapien lectus convallis justo, a consequat eros turpis vel arcu. Vivamus elementum posuere risus, venenatis laoreet urna porttitor a. Sed a porttitor sem. Phasellus velit erat, lobortis quis augue vel, porta euismod libero. Sed quis finibus sem. Nullam mollis, augue ac elementum dignissim, sem nibh vestibulum arcu, sed auctor sapien augue vehicula diam. Proin sem lectus, pharetra sed interdum sit amet, sollicitudin eu leo. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Proin facilisis quam lectus, vitae mattis urna dapibus at. Nam et facilisis magna, eget dignissim dui. Aliquam bibendum ullamcorper mauris eget eleifend. Phasellus vulputate felis eget quam porttitor finibus. Aenean malesuada est at mattis ornare. Curabitur sed velit sodales, placerat justo vel, iaculis lorem. Fusce id finibus mauris. Donec efficitur eros et justo dignissim auctor. Aenean dictum facilisis purus aliquet venenatis. Donec non dignissim nulla, sit amet molestie erat. Morbi ut velit a ante facilisis tempor non eu ante. Sed vehicula lacus ac turpis ullamcorper, in vehicula magna luctus. Morbi tortor eros, elementum sit amet facilisis id, accumsan non dui. Donec massa ante, eleifend nec lorem quis, blandit accumsan quam. Aliquam lobortis velit vitae enim eleifend, a porta quam dapibus. Nulla venenatis porttitor metus. Nunc nisi ante, tincidunt in elementum vitae, finibus ac mi. Proin ornare arcu et vestibulum posuere. Maecenas quis massa congue, finibus lacus eget, consectetur ex. Vivamus lacinia nulla in risus elementum, at semper lectus congue. Vestibulum ut tincidunt ante. Proin et vehicula odio. Nam luctus, ligula at tristique pulvinar, purus nunc euismod libero, at dapibus quam felis in orci. Phasellus in ornare tellus. Pellentesque vel molestie mauris. Sed sit amet lectus erat. Nullam quis congue mi.'
  },
  {
    header:
    {
      id: 2,
      name: 'Task 2',
      type: 'Multi-choice',
      skills: [],
      points: 20,
      duration: 7,
      complexity: TaskComplexity.High,
      state: {}
    },
    content: '_Content 2'
  },
  {
    header:
    {
      id: 3,
      name: 'Task 3',
      type: 'Multi-choice',
      skills: [],
      points: 20,
      duration: 7,
      complexity: TaskComplexity.High,
      state: {}
    },
    content: '_Content 3'
  },
  {
    header:
    {
      id: 4,
      name: 'Task 4',
      type: 'Multi-choice',
      skills: [],
      points: 20,
      duration: 7,
      complexity: TaskComplexity.High,
      state: {}
    },
    content: '_Content 4'
  },
]

export const sections: TaskSectionViewModel[] = [
  {
    header: {
      id: 1,
      name: 'Section 1',
      state: {value: 'Section 1'}
    },
    tasks: tasks,
   
  },
  {
    header: {
      id: 2,
      name: 'Section 2',
      state: {value: 'Section 2'}
    },
    tasks: tasks2
  },
  {
    header: {
      id: 3,
      name: 'Section 3',
      state: {value: 'Section 3'}
    },
    tasks: tasks3
  }
];

/** Example file/folder data. */
export const files = [
  {
    id: 1,
    name: 'Web development',
    type: 'folder',
    children: [
      {
        id: 2,
        name: 'Back-end',
        type: 'folder',
        children: [
          {
            id: 3,
            name: '.NET, C#',
            type: 'folder',
            children: [
              { id: 101, name: 'Senior dev questions v1', type: 'file' },
              { id: 55, name: 'Full stack coding task', type: 'file' },
            ]
          },
          { id: 80, name: 'material', type: 'folder' }
        ]
      },
      {
        id: 4,
        name: 'Front-end',
        type: 'folder',
        children: [
          {
            id: 5,
            name: 'Angular',
            type: 'folder',
            children: [
              { id: 30, name: 'Rx forms test task', type: 'file' },
              { id: 15, name: 'Observables Q & A', type: 'file' },
            ]
          },
          { id: 81, name: 'material', type: 'folder' }
        ]
      }
    ]
  },
  {
    id: 6,
    name: 'angular',
    type: 'folder',
    children: [
      {
        id: 7,
        name: 'packages',
        type: 'folder',
        children: [
          { id: 41, name: '.travis.yml', type: 'file' },
          { id: 37, name: 'firebase.json', type: 'file' }
        ]
      },
      { id: 137, name: 'package.json', type: 'file' }
    ]
  },
  {
    id: 8,
    name: 'angularjs',
    type: 'folder',
    children: [
      { id: 38, name: 'gulpfile.js', type: 'file' },
      { id: 39, name: 'README.md', type: 'file' }
    ]
  }
];
