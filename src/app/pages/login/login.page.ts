import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { isPlatform } from '@ionic/angular';
import { NavController, Platform, ToastController, AlertController, LoadingController } from '@ionic/angular';

import { FormControl, FormBuilder, FormGroup, Validators, AbstractControl } from "@angular/forms";
import { HttpCapService } from '../../services/http-cap.service';
import { SessionService } from '../../services/session.service';
import { EventService } from '../../services/event.service';
import { ExtraService } from '../../services/extra.service';
import { LoaderService } from 'src/app/services/loader.service';

import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
// import { FacebookLogin } from '@capacitor-community/facebook-login'


import { Http, HttpResponse, HttpOptions } from '@capacitor-community/http';



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {


  loginForm: FormGroup;
  submitted: boolean = false;


      constructor(private navCtrl: NavController, private router: Router, private formBuilder: FormBuilder,
                    public toastController: ToastController, private platform: Platform, public loadCtrl: LoadingController,
                    public alrtCtrl: AlertController, 
                    public capHttp: HttpCapService, 
                    public extra : ExtraService, 
                    public checkStr: SessionService, 
                    public eventServ: EventService,
                    private ls: LoaderService) { }
    



  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      // email: ["sandeep.gour@imarkinfotech.com", [Validators.email, Validators.required]],
      // password: ["12345678", [Validators.required, 

      email: ["", [Validators.email, Validators.required]],
      password: ["", [Validators.required, Validators.minLength(6)
        // Validators.pattern("(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@$!#^~%*?&,.<>\"'\\;:{\\}\\[\\]\\|\\+\\-\\=\\_\\)\\(\\)\\`\\/\\\\\\]])[A-Za-z0-9d$@].{7,}")
      ]]      
    });
  }


  
  ionViewWillEnter(){
    GoogleAuth.initialize();
    // FacebookLogin.initialize({appId: '712431867087017'});
  }
  



  get f() {
    return this.loginForm.controls;
  }



  // login through email
  user_login(){
      this.submitted = true;
      console.log(this.loginForm.value)
      if(this.loginForm.status === "INVALID"){
        // this.presentToast('Invalid, Please fill form correctlly!');
      }else if(this.loginForm.status === "VALID"){
        this.ls.showLoader();
        this.capHttp.postData('/login', this.loginForm.value).then((res:any) => {  // console.log(res);
          console.log(res);
          this.ls.hideLoader();
          if(res.success === true){ 
              // this.eventServ.publishUser(res.data);
              let userData = {
                "login_type": "email",
                "token": res.data.token
              }
              this.checkStr.setStore('userData', userData);
              this.router.navigate(['/maintabs/tabs/tab1']);
              this.presentToast(res.message);
              // {
              //   "success": true,
              //   "message": "User loggedIn successfully",
              //   "data": {
              //       "id": 47,
              //       "name": "sandeep gour",
              //       "email": "sandeep.gour124653@gmail.com",
              //       "email_verified": false,
              //       "plan_id": 0,
              //       "plan_type": "basic",
              //       "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvcmVsYXhhdGlvbmVyLmNvbVwvYXBpXC9sb2dpbiIsImlhdCI6MTY1NjA3MjIzNywiZXhwIjoxNjU2MDc1ODM3LCJuYmYiOjE2NTYwNzIyMzcsImp0aSI6IlpTNGNSSzUxcTM3Y3oxbTQiLCJzdWIiOjQ3LCJwcnYiOiI4N2UwYWYxZWY5ZmQxNTgxMmZkZWM5NzE1M2ExNGUwYjA0NzU0NmFhIn0.AcJtFXdUHJbMOblah9AOzKUHvVH2DRUTF2LhYWzuBDk",
              //       "token_type": "bearer"
              //   }
              // }
          }else{
            if(res.message){
              this.extra.alert(res.message);
            }
          }      
        }).catch( err => {
        });
      }
  }

 

  // login through social media(Google)
  async googleLogin(){
    this.ls.showLoader();
    GoogleAuth.signIn().then( (res: any) => {
       console.log(res);
       this.ls.hideLoader();
       if(res.authentication.idToken){;
          this.socailLogin('google', res.name, res.email);
       }else{
          this.presentToast('google token not_found!');
       }
    }).catch( (err) => {
        console.log(err);
        setTimeout( () => {
          this.ls.hideLoader();
        }, 2000);
    })
  }



  // login through social media(Facebook)
  // async fbLogin_(): Promise<void> {
  //   this.ls.showLoader();    
  //   const FACEBOOK_PERMISSIONS = [
  //     'email',
  //     'user_birthday',
  //     'user_photos',
  //     'user_gender',
  //   ];

  //   const result = await FacebookLogin.login({
  //     permissions: FACEBOOK_PERMISSIONS,
  //   });
  //   console.log(result);
  //   console.log(typeof(result));
  //   if(result.accessToken && result.accessToken.userId && result.accessToken.token){
  //     console.log(result.accessToken.userId);
  //     console.log(result.accessToken.token);

  //     let fb_url = `https://graph.facebook.com/${result.accessToken.userId}?fields=id,name,picture.width(720),birthday,email&access_token=${result.accessToken.token}`;
      
  //     Http.request({url: fb_url,  method: 'GET' }).then(res => {
  //         console.log(res);
  //         if(res.status == 200 && res.data){
  //           // let fb_data = JSON.parse(res.data);
  //           let fb_data = res.data;
  //           let fb_name = fb_data.name;
  //           let fb_email = fb_data.email;
  //           this.socailLogin('facebook', fb_name, fb_email);
  //         }else{
  //           this.presentToast('Failed: Facebook login request failed!');
  //         }
  //         this.ls.hideLoader();
  //         // {
  //         //   "status": 200,
  //         //   "url": "https://graph.facebook.com/904746000675101?fields=id,name,picture.width(720),birthday,email&access_token=EAAKH8ZChdSKkBAJqFTCupU5ezCglZCUO9JAjPOpdUUESZCTbUD4x4TZBarD0z0WWqWxMOmyp43cWdY22wVGXW4xkUMkh7NS2vZCPnos2uqHyhpZBZC7R563cnsIgoxfiP8DZC5OmCvnIMxOSNOcSEtpknYykCjfUCsajaKDZAmZBZBUYbo8Gl3UeqLe44izbDUeT8zZAhLLKFhkvt0NzuccdisnYgxJKcFQhIGa742ya83CQC9WWoRuctEngcZCQEz19ZCvWIZD",
  //         //   "data": "{\"id\":\"904746000675101\",\"name\":\"Imark Infotech\",\"picture\":{\"data\":{\"height\":662,\"is_silhouette\":false,\"url\":\"https:\\/\\/platform-lookaside.fbsbx.com\\/platform\\/profilepic\\/?asid=904746000675101&width=720&ext=1678603318&hash=AeT49H_MdIfNhbVm084\",\"width\":720}},\"birthday\":\"01\\/01\\/1994\",\"email\":\"mobile.dev\\u0040imarkinfotech.com\"}"
  //         // }
  //         // if(res.data.email){;
  //         //    this.socailLogin('facebook', res.data.name, res.data.email);
  //         // }else{
  //         //    this.presentToast('facebook token not_found!')
  //         // }
  //     }).catch(error => {
  //         this.ls.hideLoader();
  //         console.log(error);
  //         this.presentToast('Failed: Facebook login request failed!');
  //     });
  //     this.ls.hideLoader();
  //   }else{
  //     setTimeout( () => {
  //       this.presentToast('Failed: Facebook login request failed!');
  //       this.ls.hideLoader();
  //     }, 2000);
  //   }
  //   // {
  //   //   "accessToken": {
  //   //       "applicationId": "712431867087017",
  //   //       "declinedPermissions": [],
  //   //       "expires": "2023-04-10T17:32:25.215+05:30",
  //   //       "lastRefresh": "2023-02-09T17:32:25.216+05:30",
  //   //       "permissions": [
  //   //           "user_photos",
  //   //           "user_birthday",
  //   //           "openid",
  //   //           "public_profile",
  //   //           "user_gender",
  //   //           "email"
  //   //       ],
  //   //       "token": "EAAKH8ZChdSKkBANkhFUyumxPgCaPk49BrBdF74562KLLcQOZAoy7sv6xjKHzpWI4DByH6mbu0sqhzKjwWaejrDXZBQpZA5QATrMufuZAP2tgiFsIjOhchwZCCwPLjZAm8jIhSAhdlVQnOqNb7DJFfcC6dIsVx4GfgEeugZAku10gfy3xjm7tAFiFdZA6pLC1AWZBzls2BBgih8I80uBVCJRK34FXS0x08tPS9tQ4oWFXY5owr0quZBxp9vwp44QMyZCPyXUZD",
  //   //       "userId": "904746000675101",
  //   //       "isExpired": false
  //   //   },
  //   //   "recentlyGrantedPermissions": [
  //   //       "user_photos",
  //   //       "user_birthday",
  //   //       "openid",
  //   //       "public_profile",
  //   //       "user_gender",
  //   //       "email"
  //   //   ],
  //   //   "recentlyDeniedPermissions": []
  //   // }
  
  //   // console.log(result.accessToken);
  //   // {
  //   //     "applicationId": "712431867087017",
  //   //     "declinedPermissions": [],
  //   //     "expires": "2023-04-10T17:32:25.215+05:30",
  //   //     "lastRefresh": "2023-02-09T17:32:25.216+05:30",
  //   //     "permissions": [
  //   //         "user_photos",
  //   //         "user_birthday",
  //   //         "openid",
  //   //         "public_profile",
  //   //         "user_gender",
  //   //         "email"
  //   //     ],
  //   //     "token": "EAAKH8ZChdSKkBANkhFUyumxPgCaPk49BrBdF74562KLLcQOZAoy7sv6xjKHzpWI4DByH6mbu0sqhzKjwWaejrDXZBQpZA5QATrMufuZAP2tgiFsIjOhchwZCCwPLjZAm8jIhSAhdlVQnOqNb7DJFfcC6dIsVx4GfgEeugZAku10gfy3xjm7tAFiFdZA6pLC1AWZBzls2BBgih8I80uBVCJRK34FXS0x08tPS9tQ4oWFXY5owr0quZBxp9vwp44QMyZCPyXUZD",
  //   //     "userId": "904746000675101",
  //   //     "isExpired": false
  //   // }
  // }




  socailLogin(type, name, email){
    let socialData = {
      "name": name,
      "email": email
    };
    this.ls.showLoader();
    this.capHttp.postData('/socialLogin', socialData).then((res:any) => {  // console.log(res);
      console.log(res);
      this.ls.hideLoader();
      if(res.success === true){ 
          let userData = {
            "login_type": type,
            "token": res.data.token
          }
          this.checkStr.setStore('userData', userData);
          this.router.navigate(['/maintabs/tabs/tab1']);
          this.presentToast(res.message);
      }else{
        if(res.message){
          this.extra.alert(res.message);
        }
      }     
    }).catch( err => {
    });
  }



  goto_forgotPWD(){
    this.router.navigate(['/forgot-password']);  
  }

  goto_signup(){
    this.router.navigate(['/signup']);  
  }

  async presentAlert(data) {
    const alert = await this.alrtCtrl.create({
      cssClass: 'my-custom-class',
      subHeader: 'Alert',
      message: data,
      buttons: ['OK']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }



  async presentToast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }


}
