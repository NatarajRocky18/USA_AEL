import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { SharedService } from '../../services/shared.service';
import * as _ from 'lodash'
@Component({
  selector: 'app-dynamic-question',
  templateUrl: './dynamic-question.component.html',
  styleUrl: './dynamic-question.component.scss'
})
export class DynamicQuestionComponent {

  constructor(private dataService: DataService, private sharedService: SharedService, private formBuilder: FormBuilder) { }

  options!: FormGroup;
  questions: any = [];
  showSummaryScreenAdd = false;
  currentQuestionIndex = 0;
  profileDetails: any = [];
  
  ngOnInit(): void {
    this.getQuestionsAndAnswer();

  }
  questionloaded = false;
  //get question api function
  getQuestionsAndAnswer(): void {
    this.dataService.questionsAndAnswer().subscribe((data) => {

      if (data && data.questions) {
        this.options = new FormGroup({});
        const objvalue = _.groupBy(data.questions, 'screen_id')
        this.questions = Object.values(objvalue)
        data.questions.forEach((field: any) => {
          let value: any = {}
          value['key'] = field.question_id
          value['label'] = field?.['field prompt']
          value['value'] = ""
          this.profileDetails.push(value)
          this.options.addControl(field?.['question_id'], new FormControl())
        });
        console.warn('sssfsfsf', this.questions);
        console.warn(this.options);
        this.questionloaded = true
      } else {
        console.error('No questions found in the response:', data);
        this.questions = [];
      }
    }, (error) => {
      console.error('Error fetching questions:', error);
    })
  }

  //post api function for save form values

  saveAnswerValue(screenId: string, answers: any[]) {
    this.dataService.postTextAnswer(screenId, answers).subscribe((response) => {
      console.log(response);
      if (response.section_info.current_section_status === 'finished' && !this.showSummaryScreenAdd) {

        this.showSummaryScreenAdd = true;

        this.questions.push([{ question_type: "summary" }])

      }
      console.warn(this.profileDetails, "yyyyyyyyyy");


    }, error => {
      console.error('Error submitting answer:', error);
    }
    );
  }

  prevQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
    const currentQuestion = this.questions[this.currentQuestionIndex]?.[0];
    const currentQuestionHelp = currentQuestion?.question_help;
    this.sharedService.questionHelpUpdate(currentQuestionHelp);
  }

  nextQuestion() {

    if (this.currentQuestionIndex < this.questions.length) {
      this.currentQuestionIndex++;
    }

    const currentQuestion = this.questions[this.currentQuestionIndex]?.[0];
    const currentQuestionHelp = currentQuestion?.question_help;
    this.sharedService.questionHelpUpdate(currentQuestionHelp);

    const screenId = this.questions[this.currentQuestionIndex - 1]?.[0].screen_id;
    console.warn('scareen value', screenId);

    let questions = this.questions.flat();

    const objvalueSet = new Set(questions.filter((res: any) => res.screen_id === screenId).map((res: any) => res['question_id'].toString()));
    const dataToSend = Object.entries(this.options.value).reduce((result: any, [key, value]) => {
      if (value !== null && value !== '' && value !== undefined) {

        if (_.isEmpty(objvalueSet) || objvalueSet.has(key)) {
          let currentSummaryvalue = this.profileDetails.find((res: any) => res.key == key);

          if (currentSummaryvalue) {
            currentSummaryvalue['value'] = value || '';
  
            console.log("Question Details:", currentSummaryvalue);
          } else {
            console.warn(`No matching entry found for ${key} in profiledetails`);
          }
          result.push({
            question_id: key,
            text_answer: value
          });
        }
      }
      return result;
    }, []);

    console.warn(screenId, dataToSend);
    this.saveAnswerValue(screenId, dataToSend);

  }

  isLastQuestion(): boolean {
    return this.currentQuestionIndex === this.questions.length - 1;
  }
}