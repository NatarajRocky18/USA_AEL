import { Component, Input, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { SharedService } from '../../services/shared.service';
import * as _ from 'lodash'

interface OptionData {
  option_text?: string;
  selected?: string;
};
interface Question {
  question_type?: string;
  question_prompt?: string;
  field_prompt?: string;
  question_help?: string;
  text_answer?: string;
  optional?: boolean;
  questions?: {[key: string]: Question};
  options?: {[key: number]: OptionData};
};
// Add these interfaces first
interface AnswerPayload {
  section_id: string;
  answers: {
    [key: string]: {
      [key: string]: any;
    };
  };
}
// Add this interface if you don't already have it
interface QuestionData {
  screen_id: string;
  question_id: string;
  question_type: string;
  // add other properties as needed
}

interface AnswerValue {
  text_answer?: string;
  selected_option_id?: number;
  selected_option_ids?: number[];
}
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
  NextScreenSectionId: any = null;
  section_number: number = 1;

  // Add this helper method to format dates
  formatDate(dateValue: any): string {
    try {
      if (!dateValue) return '';
      
      let date: Date;
      if (dateValue instanceof Date) {
        date = dateValue;
      } else if (typeof dateValue === 'string') {
        date = new Date(dateValue);
      } else {
        return String(dateValue);
      }
  
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return String(dateValue);
    }
  }
  
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
  flattenOptions(options: {[optionId: number]: OptionData}) : any[] {
    const option_data: any[] = [];
    Object.entries(options).forEach (([optionId, option_details]) => {
      option_data.push ( {
        option_id: optionId,
        option_text: option_details.option_text,
        selected: option_details.selected
      });
    })
    return option_data;
  }
  questionloaded = false;

  // Transform nested questions into flat array with screen_ids
  flattenQuestions(questions: {[key: string]: Question}): any[] {
    const flatQuestions: any[] = [];
      
    Object.entries(questions).forEach(([parentKey, question]) => {
      if (question.questions) {
        // For questions with sub-questions, use the parent key as screen_id
        Object.entries(question.questions).forEach(([subKey, subQuestion]) => {
          var option_data: any[] = [];
          if (subQuestion.options) {
            option_data = this.flattenOptions(subQuestion.options);
          }
          flatQuestions.push({
            question_id: subKey,
            screen_id: parentKey, // Using parent key as screen_id
            question_type: subQuestion.question_type,
            'Question prompt': question.question_prompt,
            'field prompt': subQuestion.question_prompt,
            question_help: question.question_help,
            text_answer: subQuestion.text_answer,
            optional: subQuestion.optional,
            options: option_data
          });
        });
      } else {
        // For direct questions, use their own key as both screen_id and question_id
        var option_data: any[] = [];
        if (question.options) {
          option_data = this.flattenOptions(question.options);
        }
        flatQuestions.push({
          question_id: parentKey,
          screen_id: parentKey,
          question_type: question.question_type,
          'Question prompt': question.question_prompt,
          'field prompt': question.question_prompt,
          question_help: question.question_help,
          text_answer: question.text_answer,
          optional: question.optional,
          options: option_data
        });
      }
    });
    return flatQuestions;
  }
  
  processQuestionsAndAnswerResponse(data:any): void {
    const hasSummary = this.showSummaryScreenAdd;
    const summaryScreen = hasSummary ? this.questions[this.questions.length - 1] : null;
    
    this.options = this.formBuilder.group({});
    // Clear previous profile details to prevent duplicates
    this.profileDetails = [];
    // Transform the nested structure into flat array
    const flatQuestions = this.flattenQuestions(data.questions);

    const objvalue = _.groupBy(flatQuestions, 'screen_id')
    this.questions = Object.values(objvalue)

    // Create a Set to track processed question IDs and prevent duplicates
    const processedQuestionIds = new Set<string>();

      // Restore summary screen if it existed
    if (hasSummary && summaryScreen) {
      this.questions.push(summaryScreen);
    }

    flatQuestions.forEach((field: any) => {
      if (processedQuestionIds.has(field.question_id)) {
        return;
      }
      processedQuestionIds.add(field.question_id);
  
      let value: any = {}
      value['key'] = field.question_id
      value['label'] = field?.['field prompt']
      value['value'] = field.text_answer
      value['optionsKeys'] = false

      if ((field.question_type === 'radioGroup')) {
        value['type'] = field?.question_type
        value['field'] = field
        value['optionsKeys'] = true
        value['value'] = field.selected_option_id

      } else if (field.question_type === 'checkboxGroup') {

        value['type'] = field?.question_type
        value['field'] = field
        value['optionsKeys'] = true
        const checkboxArray = this.formBuilder.array(
          field.options?.map((option: any) => new FormControl(option["selected"] == "yes")) || []
        );

        const selectedOptions: any = [];

        checkboxArray.value.forEach((isSelected: any, index: any) => {

          if (isSelected) {
            const option = field.options[index];
            if (option) {
              selectedOptions.push(option.option_text);
            }
          }
        });
      
        value['selectedoptions'] = selectedOptions

      }

      this.profileDetails.push(value)
      if (field.question_type === 'checkboxGroup') {
        const checkboxArray = this.formBuilder.array(
          field.options.map((option: any) => new FormControl(option["selected"] == "yes"))
        );
        this.options.addControl(field?.question_id?.toString(), checkboxArray);
      } else if (field.question_type === 'radioGroup') {
        const selected = (field.options.find((res: any) => res["selected"] == "yes"))?.['option_id'] || ''
        this.options.addControl(field?.question_id?.toString(), new FormControl(selected));
      } else {
        this.options.addControl(field?.question_id?.toString(), new FormControl(field?.['text_answer']));
      }
    });

    console.warn(data.section_id);
    console.warn('Questions', this.questions);
    console.warn('Form controls:',this.options);
    this.questionloaded = true
  }  

  //get question api function
  getQuestionsAndAnswer(): void {

    this.dataService.questionsAndAnswer(this.section_number).subscribe((data) => {

      if (data && data.questions) {
        this.processQuestionsAndAnswerResponse(data)
      } else {
        console.error('No questions found in the response:', data);
        this.questions = [];
      }
    }, (error) => {
      console.error('Error fetching questions:', error);
    })
  }

  //post api function for save form values

  saveAnswerValue(screenId: string, payload: any) {
    this.dataService.postTextAnswer(screenId, payload).subscribe((response) => {
      console.log('Save response:', response);
      this.NextScreenSectionId = response?.['section_info']['next_section'] || null
      console.log(response?.['section_info']['next_section']);
      console.log(this.NextScreenSectionId);
      if (response.questions_and_answers) {
        if (!this.showSummaryScreenAdd) {
          this.processQuestionsAndAnswerResponse(response.questions_and_answers);
        }  
      }
      if (response.section_info.current_section_status === 'finished' &&
        !this.showSummaryScreenAdd && 
        this.questions[this.questions.length - 1]?.[0]?.question_type !== 'summary') {
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

  private updateQuestionIndex(): void {
    if (this.currentQuestionIndex < this.questions.length) {
      this.currentQuestionIndex++;
    }
    
    const currentQuestion = this.questions[this.currentQuestionIndex]?.[0];
    const currentQuestionHelp = currentQuestion?.question_help;
    this.sharedService.questionHelpUpdate(currentQuestionHelp);
  }
  
  private prepareAnswerValue(question: any, value: any): AnswerValue {
    const answerValue: AnswerValue = {};
  
    switch (question.question_type) {
      case 'checkboxGroup':
        if (Array.isArray(value)) {
          answerValue.selected_option_ids = question.options
            .map((option: any, index: number) => (value[index] ? parseInt(option.option_id) : null))
            .filter((id: any) => id !== null);
        }
        break;
  
      case 'radioGroup':
        answerValue.selected_option_id = parseInt(value);
        break;
  
      case 'date':
        answerValue.text_answer = value instanceof Date
          ? `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`
          : value;
        break;
  
      default:
        answerValue.text_answer = value;
    }
  
    return answerValue;
  }
  
  private updateSummaryValue(question: any, value: any, currentSummaryValue: any): void {
    if (question.question_type === 'date') {
      currentSummaryValue['value'] = this.formatDate(value);
    } else {
      currentSummaryValue['value'] = value || '';
    }
  }
  
  private processFormValue(
    key: string, 
    value: any, 
    questions: QuestionData[], 
    objvalueSet: Set<string>, 
    answersPayload: AnswerPayload
  ): void {
    if (value === null || value === '' || value === undefined) {
      return;
    }
  
    if (!_.isEmpty(objvalueSet) && !objvalueSet.has(key)) {
      return;
    }
  
    const question = questions.find((q: any) => q.question_id.toString() === key);
    if (!question) {
      return;
    }
  
    const currentSummaryvalue = this.profileDetails.find((res: any) => res.key === key);
    if (!currentSummaryvalue) {
      return;
    }
  
    // Update summary value
    this.updateSummaryValue(question, value, currentSummaryvalue);
  
    // Get the screen_id for this question
    const questionScreenId = question.screen_id;
  
    // Initialize the screen group if it doesn't exist
    if (!answersPayload.answers[questionScreenId]) {
      answersPayload.answers[questionScreenId] = {};
    }
  
    // Prepare and add the answer
    const answerValue = this.prepareAnswerValue(question, value);
    if (questionScreenId != question.question_id) {
      answersPayload.answers[questionScreenId][question.question_id] = answerValue;
    } else {
      answersPayload.answers[question.question_id] = answerValue;
    }
  }
  

  nextQuestion(): void {
    this.updateQuestionIndex();
  
    const screenId = this.questions[this.currentQuestionIndex - 1]?.[0].screen_id;
    const questions = this.questions.flat() as QuestionData[];
  
    const objvalueSet = new Set<string>(
      questions
        .filter((res) => res.screen_id === screenId)
        .map((res) => res.question_id.toString())
    );
  
    const answersPayload: AnswerPayload = {
      section_id: this.section_number.toString(),
      answers: {}
    };
  
    // Process each form value
    Object.entries(this.options.value).forEach(([key, value]) => {
      this.processFormValue(key, value, questions, objvalueSet, answersPayload);
    });
  
    console.log('Restructured payload:', JSON.stringify(answersPayload, null, 2));
    this.saveAnswerValue(screenId, answersPayload);
  }
  
  // isLastQuestion(): boolean {
  //   return this.currentQuestionIndex === this.questions.length;
  // }

  moveToNextSection() {
    this.section_number = this.NextScreenSectionId
    this.currentQuestionIndex = 0;
    this.getQuestionsAndAnswer()
    this.sharedService.sectionValueUpdate({ current_section_id: this.NextScreenSectionId });

  }
}