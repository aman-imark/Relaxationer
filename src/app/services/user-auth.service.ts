import { Injectable } from '@angular/core';


import { Platform, ToastController } from '@ionic/angular';

import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { HttpCapService } from './http-cap.service';
import { SessionService } from './session.service';


export class User {
  userid: number;
  name: string;
  email: string;
  role_id: number;
  plan_id: number;
  plan_type: string;
  token?: string;
}




@Injectable({
  providedIn: 'root'
})
export class UserAuthService {


  // private dataObserved = new BehaviorSubject<any>('');
  // currentEvent = this.dataObserved.asObservable();
  
    // this.eventServ.publish(res.user);
  // this.checkStr.setStore('user_dataMW', res.user);


  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  currentUser: User;

  constructor(private platform: Platform, private caphttp: HttpCapService, 
              public checkStr: SessionService,  public toastController: ToastController) { }



  login(email: string, password: string) {
    // login() {
    // let user = {
    //   email : 'sandeep.gour124653@gmail.com',
    //   password : '12345678'
    // }
    let user = {
      email : email,
      password : password
    }
      this.caphttp.postData('/login', user).then((res:any) => {  
           console.log(res);
           if(res.success === true){
              this.checkStr.setStore('user   Data', res.user)
              this.presentToast(res.message);
              // this.eventServ.publish(res.user);
              // this.checkStr.setStore('user_dataMW', res.user);
           }else{
              this.presentToast(res.message);
           }
      }).catch( err => {
          console.log(err)
           // this.presentToast(JSON.stringify(err.message));
           // alert(JSON.stringify(err));
      });
   
      // {
      //   "success": true,
      //   "message": "User loggedIn successfully",
      //   "data": {
      //       "id": 47,
      //       "name": "sandeep gour",
      //       "email": "sandeep.gour124653@gmail.com",
      //       "plan_id": 0,
      //       "plan_type": "basic",
      //       "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvcmVsYXhhdGlvbmVyLmNvbVwvYXBpXC9sb2dpbiIsImlhdCI6MTY1NTIxMDAxNSwiZXhwIjoxNjU1MjEzNjE1LCJuYmYiOjE2NTUyMTAwMTUsImp0aSI6IjRLSklTbzdJZ1d1VzNhdE4iLCJzdWIiOjQ3LCJwcnYiOiI4N2UwYWYxZWY5ZmQxNTgxMmZkZWM5NzE1M2ExNGUwYjA0NzU0NmFhIn0.76WCSf0nO_EdrWX4xIK6WOnJhq1gCQB_ok4x24cTfxM",
      //       "token_type": "bearer"
      //   }
      // }
    
    // username == this.fakeUsername && password == this.fakePassword) {
    //   localStorage.setItem("token", "my-super-secret-token-from-server");
    //   return of(new HttpResponse({ status: 200 }));
    // } else {
    //   return of(new HttpResponse({ status: 401 }));
    // }
  }






  logout(): void {
    this.checkStr.removeStore("userData");
  }


  isLoggedIn(): boolean {
    let status = false;   
    this.checkStr.getStore('userData').then((data:any) => { 
      console.log(data)  
      if(data != null || data != '' || typeof(data) != 'undefined'){
        status = true;
      }else{ 
        status = false; 
      }
    }).catch( err => { status = false; })


    // if (this.userStr.getStore("userData") != null) {
    //   return true;
    // }
    // return false;

    return status;  
  }


  




  async presentToast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }



}
