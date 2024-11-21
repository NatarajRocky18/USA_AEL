import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment} from '../../environments/environment.dev'

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }


  //get section value api 
  sectionProgress(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/student-section-progress`);
  }


  // get question and option api 
  // questionsAndAnswer(): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}assistant/questions-and-answers/1`)
  // }

  questionsAndAnswer(section_id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/questions-and-answers/${section_id}`)
  }

  //post text, date, enail, phone answer value api 

  postTextAnswer(screenId: string, answers: any[]): Observable<any> {

    const url = `${this.apiUrl}/submit-answer/`;

    const body = answers;
    //const body = {
    //  screen_id: screenId,
    //  answers: answers
    //}

    return this.http.post<any>(url, body)
  }

  //open ai api call
  aiQuestionLoading(section_id: any) {
    const url = `${this.apiUrl}/initiate-help/`;
    const body = {
      section_id: section_id
    }
    return this.http.post<any>(url, body)
  }

}
