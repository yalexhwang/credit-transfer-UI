import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AdminModule } from './admin/admin.module';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module'
import { RequestsModule } from './requests/requests.module';

import { AppComponent } from './app.component';
import { FaqComponent } from './faq/faq.component';
import { HeaderComponent } from './core/header/header.component';
import { HomeComponent } from './core/home/home.component';
import { LandingComponent } from './landing/landing.component';

@NgModule({
  imports: [
    BrowserModule,
    AdminModule,
    AppRoutingModule,
    CoreModule,
    RequestsModule
  ],
  declarations: [
    AppComponent,
    FaqComponent,
    HeaderComponent,
    HomeComponent,
    LandingComponent
  ],
  exports: [
    AppComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
