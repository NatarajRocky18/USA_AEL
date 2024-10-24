import { Component, EventEmitter, Output, output } from '@angular/core';
import { DataService } from '../../services/data.service';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-side-navbar',
  templateUrl: './side-navbar.component.html',
  styleUrl: './side-navbar.component.scss'
})
export class SideNavbarComponent {
 
  constructor(private dataService: DataService , private sharedService: SharedService) { }
  @Output() SideNavData = new EventEmitter();
  ngOnInit(): void {
    // this.sectionId 
    this.getSectionProgress();

  }

  sectionProgressData: any[] = [];

  getSectionProgress(): void {
    this.dataService.sectionProgress().subscribe((data) => {
      this.sectionProgressData = data;
      console.log(this.sectionProgressData);
      
      // let obj = {"section_id":section_id}
      // this.SideNavData.emit(obj);
      console.warn(this.sectionProgressData);

    }, (error) => {
      console.error('Error fetching section progress:', error);

    })
  }
  
  questionAndOptionsData:any =[]
  getSectionQuestionAndOptions(section_id:number): void {
    // this.sectionId =section_id 

    let obj = {"section_id":section_id, "tgh": this}
    this.SideNavData.emit(obj);
    console.log(section_id);

     this.sharedService.sectionValueUpdate(section_id);
     
     
    
     this.dataService.questionsAndAnswer(section_id).subscribe((data=>{
        this.questionAndOptionsData = data;
        console.log(this.questionAndOptionsData);
        
     }))
  }
  

}
