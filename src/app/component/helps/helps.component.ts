import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-helps',
  templateUrl: './helps.component.html',
  styleUrl: './helps.component.scss'
})
export class HelpsComponent {
  constructor(private dataService: DataService, private sharedService: SharedService) { }
  currentQuestionIndex = 0;
  sectionHelp: string = '';
  questions: any = [];
  questionHelp: string = '';

  ngOnInit(): void {
    this.getQuestionsAndAnswer();
    this.sharedService.questionHelpValue$.subscribe((helpText: string) => {
      this.questionHelp = helpText;
    });
   
  }

  getQuestionsAndAnswer(): void {
    this.dataService.questionsAndAnswer().subscribe((data) => {

      if (data) {
        this.questions = data.questions;
        this.sectionHelp = data.section_help;
        console.warn(this.sectionHelp);
      } else {
        console.error('No questions found in the response:', data);
        this.sectionHelp = '';
      }
    }, (error) => {
      console.error('Error fetching questions:', error);
    })
  }

}
