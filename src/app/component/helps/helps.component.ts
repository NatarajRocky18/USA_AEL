import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { SharedService } from '../../services/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-helps',
  templateUrl: './helps.component.html',
  styleUrl: './helps.component.scss'
})
export class HelpsComponent {
  constructor(private dataService: DataService, private sharedService: SharedService, private spinner: NgxSpinnerService) { }
  currentQuestionIndex = 0;
  sectionHelp: string = '';
  questions: any = [];
  questionHelp: string = '';
  offerAiHelp: string = '';
  aiHelpButtonLabel: string = '';
  section_id: string = '';

  ngOnInit(): void {
    this.getAiQuestion();
    this.getQuestionsAndAnswer();
    this.sharedService.questionHelpValue$.subscribe((helpText: string) => {
      this.questionHelp = helpText;
    });

    this.sharedService.sectionHelp$.subscribe((data) => {
      this.sectionHelp = data;
    });

    this.sharedService.sectionAiButton$.subscribe((data) => {
      this.offerAiHelp = data
      console.warn(this.offerAiHelp);
    });

    this.sharedService.sectionValue$.subscribe((section) => {
      this.section_id = section.current_section_id;

    })




    this.offerAiHelp;
    this.aiHelpButtonLabel;

  }

  getQuestionsAndAnswer(): void {

    this.dataService.questionsAndAnswer(1).subscribe((data) => {

      if (data) {
        this.questions = data.questions;
        this.sectionHelp = data.section_help;

        this.aiHelpButtonLabel = data.ai_help_button_label;

        // Set the initial questionHelp if questions exist
        if (this.questions.length > 0) {
          this.questionHelp = this.questions[0].question_help || '';
        }
        console.warn(this.sectionHelp);
      } else {
        console.error('No questions found in the response:', data);
        this.sectionHelp = '';
      }
    }, (error) => {
      console.error('Error fetching questions:', error);
    })
  }

  // get Ai questions
  aiQuestions: any
  spinnerShow: boolean = false;
  getAiQuestion() {
    this.spinnerShow = true;
    this.spinner.show();
    this.dataService.aiQuestionLoading(this.section_id).subscribe((response) => {
      this.sharedService.getAiQuestionsRes(response);
      this.aiQuestions = response;
      console.warn(this.aiQuestions, "answer ai values");
      this.spinnerShow = false;
      this.spinner.hide();

    }, error => {
      console.error("ai error response", error);
      this.spinnerShow = false;
      this.spinner.hide();

    })
  }

}