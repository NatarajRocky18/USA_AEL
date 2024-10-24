import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-default-layout',
  // standalone:true,
  templateUrl: './default-layout.component.html',
  styleUrl: './default-layout.component.scss',
  // imports: [RouterModule]
})
export class DefaultLayoutComponent {

  sidenavData: any
  GetSideNavData(event: any) {
    this.sidenavData = event
    console.log(event);

  }
}
