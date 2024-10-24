import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-side-navbar',
  templateUrl: './side-navbar.component.html',
  styleUrl: './side-navbar.component.scss'
})
export class SideNavbarComponent {

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.getSectionProgress();

  }

  sectionProgressData: any[] = [];

  getSectionProgress(): void {
    this.dataService.sectionProgress().subscribe((data) => {
      this.sectionProgressData = data;
      console.warn(this.sectionProgressData);

    }, (error) => {
      console.error('Error fetching section progress:', error);

    })


  }

}
