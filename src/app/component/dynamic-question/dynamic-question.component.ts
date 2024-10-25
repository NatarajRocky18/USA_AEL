import { Component, Input, SimpleChanges } from '@angular/core';
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
  NextScreenSectionId :any=null;
  section_number: number = 1;

  ngOnInit(): void {
    this.getQuestionsAndAnswer();
    this.sharedService.sectionValue$.subscribe((sections: any) => {
      console.log("SECTION DETAILS:", sections);
      this.section_number = sections.current_section_id;
      this.NextScreenSectionId = null
      this.getQuestionsAndAnswer();
      this.profileDetails = [];
      this.showSummaryScreenAdd = false;

    }); 

  } 


  questionloaded = false;
  //get question api function
  getQuestionsAndAnswer(): void {

    this.dataService.questionsAndAnswer(this.section_number).subscribe((data) => {

      if (data && data.questions) {
        // this.options = new FormGroup({});
        this.options = this.formBuilder.group({});
        const objvalue = _.groupBy(data.questions, 'screen_id')
        this.questions = Object.values(objvalue)
        data.questions.forEach((field: any) => {
          let value: any = {}
          value['key'] = field.question_id
          value['label'] = field?.['field prompt']
          value['value'] = ""
          this.profileDetails.push(value)
          // this.options.addControl(field?.['question_id'], new FormControl())
          if (field.question_type === 'checkboxGroup') {
            const checkboxArray = this.formBuilder.array(
              field.options.map((option: any) => new FormControl())
            );
            this.options.addControl(field.question_id.toString(), checkboxArray);
          } else {

            this.options.addControl(field.question_id.toString(), new FormControl());
          }
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
      this.NextScreenSectionId =response?.['section_info']['next_section'] || null
      console.log(response?.['section_info']['next_section']);
      console.log(this.NextScreenSectionId);
      if(response.questions_changed=="yes"){
        this.showSummaryScreenAdd = false;
        this.getQuestionsAndAnswer()
      }
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

          // handle the different payload types based on the question type

          let answerData: { [key: string]: any } = { question_id: key }

          const question = questions.find((q: any) => q.question_id.toString() === key)

          if (question) {

            if (question.question_type === 'text' || question.question_type === 'email' || question.question_type === 'phone') {
              answerData['text_answer'] = value;
            } else if (question.question_type === 'date') {

              answerData['text_answer'] = value instanceof Date
                ? `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`
                : value;
            }
            else if (question.question_type === 'radioGroup') {
              answerData['selected_option_id'] = value;
            } else if (question.question_type === 'checkboxGroup') {
              if (Array.isArray(value)) {
                answerData['selected_option_ids'] = value.filter((v: any) => v);
              } else {
                console.warn(`Expected array for checkboxGroup question but got ${typeof value}`)
              }
            } else {
              answerData['text_answer'] = value;
            }

            result.push(answerData)

          }

          // result.push({
          //   question_id: key,
          //   text_answer: value
          // });
        }
      }
      return result;
    }, []);

    console.warn(screenId, dataToSend);
    this.saveAnswerValue(screenId, dataToSend);

  }

  isLastQuestion(): boolean {
    return this.currentQuestionIndex === this.questions.length;
  }

  moveToNextSection() {
    this.section_number = this.NextScreenSectionId
    this.currentQuestionIndex =0;
    this.getQuestionsAndAnswer()
    this.sharedService.sectionValueUpdate({current_section_id:this.NextScreenSectionId});
 
  }
}