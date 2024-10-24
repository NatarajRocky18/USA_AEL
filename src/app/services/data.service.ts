import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private apiUrl = 'http://127.0.0.1:8000/';

  constructor(private http: HttpClient) { }


  //get section value api 
  sectionProgress(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}assistant/student-section-progress`);
  }


  // get question and option api 
  // questionsAndAnswer(): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}assistant/questions-and-answers/1`)
  // }

  questionsAndAnswer(section_id :number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}assistant/questions-and-answers/${section_id}`)
  }

  //post text, date, enail, phone answer value api 

  postTextAnswer(screenId: string, answers: any[]): Observable<any> {

    const url = `${this.apiUrl}assistant/submit-answer/`;

    const body = {
      screen_id: screenId,
      answers: answers
    }

    return this.http.post<any>(url, body)
  }


}
