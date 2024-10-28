import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { AppFooterComponent } from './component/app-layout/app-footer/app-footer.component';
import { AppHeaderComponent } from './component/app-layout/app-header/app-header.component';
import { SideNavbarComponent } from './component/side-navbar/side-navbar.component';
import { DynamicQuestionComponent } from './component/dynamic-question/dynamic-question.component';
import { HelpsComponent } from './component/helps/helps.component';
import { DefaultLayoutComponent } from './component/app-layout/default-layout/default-layout.component';
import { RouterModule } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {MatMenuModule} from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { InitialLayoutComponent } from './component/app-layout/initial-layout/initial-layout.component';






@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    AppFooterComponent,
    AppHeaderComponent,
    SideNavbarComponent,
    DynamicQuestionComponent,
    HelpsComponent,
    DefaultLayoutComponent,
    InitialLayoutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    RouterModule.forRoot([]),
    MatIconModule,
    HttpClientModule,
    MatMenuModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatRadioModule,
    MatCheckboxModule,
    FormsModule

  ],
  exports: [RouterModule],
  providers: [
    provideAnimationsAsync(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true 
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
