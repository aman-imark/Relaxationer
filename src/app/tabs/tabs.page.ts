import { Component } from '@angular/core';

import { Router } from '@angular/router';

import { SessionService } from './../services/session.service';
import { EventService } from './../services/event.service';


@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  isLoggedIn: boolean = false;
  userData: any;
    user_token: any;

    constructor(public checkStr: SessionService, private router: Router) 

    {
      this.checkLogin();
    }



  checkLogin(){
    this.checkStr.getStore('userData').then((data:any) => {   
      // console.log(data);
      if(data != null || data != '' || typeof(data) != 'undefined'){
        if(data.token){          
          this.isLoggedIn = true;
            this.user_token = data.token;

        }else{ this.isLoggedIn = false; this.router.navigate(['/login']); }
      }else{ this.isLoggedIn = false; this.router.navigate(['/login']); }
    }, (reason) => {
        this.isLoggedIn = false;
        this.router.navigate(['/login']);
    }).catch( err => {
        this.isLoggedIn = false;
        this.router.navigate(['/login']);
    });
  }


}
