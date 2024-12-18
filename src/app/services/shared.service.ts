import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  private question_help = new Subject<string>();
  questionHelpValue$ = this.question_help.asObservable();

  questionHelpUpdate(section: string) {
    this.question_help.next(section);
  }

  private section_status = new Subject<any>();
  sectionValue$ = this.section_status.asObservable();

  sectionValueUpdate(sections: any) {

    this.section_status.next(sections);
  }

}
