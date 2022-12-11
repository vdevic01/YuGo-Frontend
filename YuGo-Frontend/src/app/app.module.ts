import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from '../infrastructure/app-routing.module';
import { AppComponent } from './app.component';

import {CoreModule} from "./modules/core/core.module";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {HistoryModule} from "./modules/feature/history/history.module";
import {HomeModule} from "./modules/feature/home/home.module";
import {SharedModule} from "./modules/shared/shared.module";
import {Interceptor} from "./modules/core/interceptors/interceptor.interceptor";
import {AccountComponent} from "./modules/feature/account/pages/account.component";
import {AccountModule} from "./modules/feature/account/account.module";


@NgModule({
  declarations: [
    AppComponent,
  ],
    imports: [
      BrowserModule,
      AppRoutingModule,
      CoreModule,
      HistoryModule,
      HomeModule,
      AccountModule,
      SharedModule,
    ],
  providers: [
    {
    provide: HTTP_INTERCEPTORS,
    useClass: Interceptor,
    multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
