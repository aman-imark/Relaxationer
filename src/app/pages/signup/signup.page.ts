import { Component, OnInit, ViewChild } from '@angular/core';


import { Router } from '@angular/router';

import { ToastController } from '@ionic/angular';
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
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  @ViewChild("header") header: HTMLElement;

  signupForm: FormGroup;
  submitted: boolean = false;

  constructor(private router: Router, public toastController: ToastController, 
              private formBuilder: FormBuilder, 
              public capHttp: HttpCapService, 
              public extra : ExtraService, 
              public checkStr: SessionService, 
              public eventServ: EventService, private ls: LoaderService) { }



  
  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      name: ["", [Validators.required, Validators.minLength(4)]],
      email: ["", [Validators.email, Validators.required]],
      termsCheck: [false, []],
      password: ["", [Validators.required, Validators.minLength(8)
        // Validators.pattern("(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@$!#^~%*?&,.<>\"'\\;:{\\}\\[\\]\\|\\+\\-\\=\\_\\)\\(\\)\\`\\/\\\\\\]])[A-Za-z0-9d$@].{7,}")
      ]],
      password_confirmation: ["", [Validators.required]]},      
      {
        // validator: this.MustMatch('password', 'password_confirmation')  
        validator: this.ConfirmPasswordValidator("password", "password_confirmation")
      }
    );
  }


  
  ionViewWillEnter(){
    GoogleAuth.initialize(); 
    // FacebookLogin.initialize({appId: '712431867087017'});
  }
  

  get f() {
    return this.signupForm.controls;
  }


  ConfirmPasswordValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      let control = formGroup.controls[controlName];
      let matchingControl = formGroup.controls[matchingControlName]
      if (
        matchingControl.errors &&
        !matchingControl.errors?.['confirmPasswordValidator']
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmPasswordValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }


  user_signup(){
      this.submitted = true;
      console.log(this.signupForm.value);

      
      if(this.signupForm.status === "INVALID"){
        //  this.presentToast('Invalid, Please fill form correctlly!');
      }else if(this.signupForm.status === "VALID"){   
        if(this.signupForm.get('termsCheck').value === false){
           this.extra.alert('Please accept the Terms and Policy!');
        }
        else if(this.signupForm.get('termsCheck').value === true){
          this.ls.showLoader();
          let signupData = {
             name: this.signupForm.get('name').value,
             email: this.signupForm.get('email').value,
             password: this.signupForm.get('password').value,
             password_confirmation: this.signupForm.get('password_confirmation').value
          };
          // console.log(signupData);

          this.capHttp.postData('/register', signupData).then((res:any) => {  // console.log(res);
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
                //     "success": true,
                //     "message": "User created successfully",
                //     "data": {
                //         "id": 51,
                //         "name": "SAURABH",
                //         "email": "saurabh.chauhan@gmail.com",
                //         "plan_type": "basic",
                //         "plan_id": 0,
                //         "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvcmVsYXhhdGlvbmVyLmNvbVwvYXBpXC9yZWdpc3RlciIsImlhdCI6MTY1NTQ1MDQ4NCwiZXhwIjoxNjU1NDU0MDg0LCJuYmYiOjE2NTU0NTA0ODQsImp0aSI6Ik5OdnVyNkJEbmIxT0d5V04iLCJzdWIiOjUxLCJwcnYiOiI4N2UwYWYxZWY5ZmQxNTgxMmZkZWM5NzE1M2ExNGUwYjA0NzU0NmFhIn0.XrPWCbERa-JNhDUGiiiTd5z0YpbRmESUGBaV-wuOteU",
                //         "token_type": "bearer"
                //     }s
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
  //           let fb_data = JSON.parse(res.data);
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
  //         console.log(error);
  //         this.ls.hideLoader();
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




  goto_login(){
    this.router.navigate(['/login']);  
  }

  
  async presentToast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }



}
