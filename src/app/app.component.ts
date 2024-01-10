import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { NavController, Platform, isPlatform, ToastController, AlertController } from '@ionic/angular';


import { Http, HttpResponse } from '@capacitor-community/http';

import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';

import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';


// import services

import { HttpCapService } from './services/http-cap.service';
import { SessionService } from './services/session.service';
import { EventService } from './services/event.service';
import { ExtraService } from './services/extra.service';




@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  isLoggedIn: boolean = false;
  userData: any;
    user_token: any;

    device_id: string;
    fcm_token: string;


  constructor(public alertController: AlertController, private navCtrl: NavController, private router: Router,              
              public toastController: ToastController, private platform: Platform,  private screenOrientation: ScreenOrientation,
              public capHttp: HttpCapService, 
              public extra : ExtraService, 
              public checkStr: SessionService, 
              public eventServ: EventService) 
  
  {
    SplashScreen.show({
      showDuration: 3000,
      autoHide: true,
    });
    SplashScreen.hide();
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    this.initializeApp();
  }



  initializeApp() {
    this.platform.ready().then(() => {
    
      // StatusBar.setOverlaysWebView({ overlay: true });
      // StatusBar.setOverlaysWebView({ overlay: true });
      StatusBar.setStyle({ style: Style.Light });
      StatusBar.setBackgroundColor({color: '#ffffff'});  
      
      this.checkLogin();
    });
  }





  checkLogin(){
    this.checkStr.getStore('userData').then((data:any) => {   
      console.log(data);
      // {
      //   "login_type": "email",
      //   "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvcmVsYXhhdGlvbmVyLmNvbVwvYXBpXC9sb2dpbiIsImlhdCI6MTY1Nzg2OTY4NiwiZXhwIjoxNjc5NDY5Njg2LCJuYmYiOjE2NTc4Njk2ODYsImp0aSI6ImlSRkVPRzZEOW9iejlrNEEiLCJzdWIiOjQ5LCJwcnYiOiI4N2UwYWYxZWY5ZmQxNTgxMmZkZWM5NzE1M2ExNGUwYjA0NzU0NmFhIn0.ePm4-IvrYYoEYjcV0Z-C0lfb_D1pW2Cl3vpT9bvRTVI"
      // }
      if(data != null || data != '' || typeof(data) != 'undefined'){
        if(data.token){          
            this.isLoggedIn = true;
            this.user_token = data.token;
            this.router.navigate(['/maintabs/tabs/tab1']);
        }else{ 
          this.isLoggedIn = false; 
          this.router.navigate(['/login']); 
        }
      }else{ 
        this.isLoggedIn = false; 
        this.router.navigate(['/login']);
      }
    }).catch( err => {
        this.isLoggedIn = false;
        this.router.navigate(['/login']);
    });
  }
 
}
