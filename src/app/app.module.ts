import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { StickyDirective } from './directives/sticky.directive';
import { HideHeaderDirective } from './directives/hide-header.directive';


// Angular HTTP
import { HttpClientModule } from '@angular/common/http';

import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { Stripe } from '@awesome-cordova-plugins/stripe/ngx';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
import { Device } from '@awesome-cordova-plugins/device/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';

import { Media, MediaObject } from '@awesome-cordova-plugins/media/ngx';

import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';



// https://enappd.com/blog/play-music-in-ionic-capacitor-apps/112/



@NgModule({
  declarations: [AppComponent, StickyDirective, HideHeaderDirective],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
            HttpClientModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, 
                Camera, Stripe, Media, Vibration, Device, File, ScreenOrientation], 
  bootstrap: [AppComponent],
})
export class AppModule {}
