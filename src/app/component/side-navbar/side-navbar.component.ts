import { Component, EventEmitter, Output, output } from '@angular/core';
import { DataService } from '../../services/data.service';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-side-navbar',
  templateUrl: './side-navbar.component.html',
  styleUrl: './side-navbar.component.scss'
})
export class SideNavbarComponent {

  constructor(private dataService: DataService, private sharedService: SharedService) { }
  ngOnInit(): void {
    this.getSectionProgress();
    this.sharedService.sideNavDataShare$.subscribe((res)=>
      this.sectionProgressData = res 
    )
  }

   sectionProgressData: any[] = [];

  getSectionProgress(): void {
    this.dataService.sectionProgress().subscribe((data) => {
    this.sharedService.sideNaveShareDataValue(data)
      
      console.warn(this.sectionProgressData);

    }, (error) => {
      console.error('Error fetching section progress:', error);

    })
  }

  questionAndOptionsData: any = []
  getSectionQuestionAndOptions(section: any, index: number): void {
    console.log(section);

    let nextIndex: number = index + 1
    let nextScreenSectionId: any = this.sectionProgressData[nextIndex]?.section_id ?? "no index"
    console.log("Next Screen Section Id ", nextScreenSectionId);

    let obj = { "current_section_id": section.section_id, "next_sectionId": nextScreenSectionId }
    this.sharedService.sectionValueUpdate(obj);


    this.dataService.questionsAndAnswer(section.section_id).subscribe((data => {
      this.questionAndOptionsData = data;
      console.log(this.questionAndOptionsData);

    }))
  }


}