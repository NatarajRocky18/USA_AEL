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

  private sectionHelp = new Subject<any>();
  sectionHelp$ = this.sectionHelp.asObservable();

  sectiongHelpUpdate(section: any) {  
    this.sectionHelp.next(section);
  }

  private section_status = new Subject<any>();
  sectionValue$ = this.section_status.asObservable();

  sectionValueUpdate(sections: any) {
    this.section_status.next(sections);
  }

  private section_value_change = new Subject<any>();
  sideNavDataShare$ = this.section_value_change.asObservable();

  sideNaveShareDataValue(value: any): any {
    this.section_value_change.next(value)
  }

  private sectionAiButton = new Subject<any>();
  sectionAiButton$ = this.sectionAiButton.asObservable();

  sectionAiButtonUpdate(value: any) {
    this.sectionAiButton.next(value)
  }

  private aiQuestions = new Subject<any>();
  aiQuestions$ = this.aiQuestions.asObservable();

  getAiQuestionsResInHelpSection(value: any) {
    this.aiQuestions.next(value);
  }


}
