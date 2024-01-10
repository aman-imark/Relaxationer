import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { NavController, Platform, isPlatform, ToastController, AlertController, ActionSheetController } from '@ionic/angular';
import { SessionService } from '../../services/session.service';
import { EventService } from '../../services/event.service';
import { ExtraService } from '../../services/extra.service';
import { HttpCapService } from '../../services/http-cap.service';
import { LoaderService } from 'src/app/services/loader.service';
import { FormControl, FormBuilder, FormGroup, Validators, AbstractControl } from "@angular/forms";

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.page.html',
  styleUrls: ['./update-password.page.scss'],
})
export class UpdatePasswordPage implements OnInit {

  isLoggedIn: boolean = false;
  userData: any;
    user_token: any;

    
  updatePWDForm: FormGroup;
  submitted: boolean = false;

   successCard: boolean = false;

  constructor(public toastController: ToastController, private router: Router,
    private alertCtrl: AlertController, public acSheetCtrl: ActionSheetController,
    public checkStr: SessionService, 
    public eventServ: EventService,
    public extraServ: ExtraService, private ls: LoaderService,
    public capHttp: HttpCapService, private formBuilder: FormBuilder) { }




  ngOnInit(): void {
    this.updatePWDForm = this.formBuilder.group({
      old_password: ["", [Validators.required, Validators.minLength(8)]],
      password: ["", [Validators.required, Validators.minLength(8)
        // Validators.pattern("(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@$!#^~%*?&,.<>\"'\\;:{\\}\\[\\]\\|\\+\\-\\=\\_\\)\\(\\)\\`\\/\\\\\\]])[A-Za-z0-9d$@].{7,}")
      ]],
      password_confirmation: ["", [Validators.required]]}, 
      {
        validator: this.ConfirmPasswordValidator("password", "password_confirmation")
      }
    );
  }





  ionViewWillEnter(){
    this.checkLogin();
  }



  checkLogin(){
    this.checkStr.getStore('userData').then((data:any) => { 
      if(data != null || data != '' || typeof(data) != 'undefined'){
        this.userData = data;
        if(this.userData.token){
          this.isLoggedIn = true;
          this.user_token = this.userData.token;
        }else{ this.isLoggedIn = false; }
      }else{ this.isLoggedIn = false; }
    },(reason) => {
        this.isLoggedIn = false;
        this.router.navigate(['/login']);
    }
    ).catch( err => {
        this.isLoggedIn = false;
        this.router.navigate(['/login']);
    });
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

  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        // if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        //     // return if another validator has already found an error on the matchingControl
        //     return;
        // }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
  }



  async passwordMatchValidator(frm: FormGroup) {
    return frm.controls['password'].value === frm.controls['password_confirmation'].value ? null : {'mismatch': true};
  }


  get f() {
    return this.updatePWDForm.controls;
  }




  updatePassword(){
      this.submitted = true;
      console.log(this.updatePWDForm.value)
      if(this.updatePWDForm.status === "INVALID"){
        //  this.presentToast('INVALID, please fill form correctlly!');
      }else if(this.updatePWDForm.status === "VALID"){
        this.ls.showLoader();
        this.capHttp.postData('/change-password', this.updatePWDForm.value, this.user_token).then((res:any) => {  // console.log(res);
          console.log(res);
          this.ls.hideLoader();
          if(res.success === true){ 
              this.successCard = true;
              // this.presentToast(res.message);
          }else{
            if(res.message){
              this.extraServ.alert(res.message);
            }
          }    
        }).catch( err => {
        });
      }else{
        // this.presentToast('Please fill form correctlly!');
      }
  }



  
  async presentToast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }




}
