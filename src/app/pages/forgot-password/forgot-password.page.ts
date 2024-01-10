import { Component, OnInit } from '@angular/core';


import { Router } from '@angular/router';

import { ToastController } from '@ionic/angular';
import { UserAuthService } from '../../services/user-auth.service';
import { FormControl, FormBuilder, FormGroup, Validators, AbstractControl } from "@angular/forms";
import { HttpCapService } from '../../services/http-cap.service';
import { SessionService } from '../../services/session.service';
import { ExtraService } from '../../services/extra.service';

import { LoaderService } from 'src/app/services/loader.service';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  forgotForm: FormGroup;
  submitted: boolean = false;

  constructor(private router: Router, public userAuth: UserAuthService, private ls: LoaderService,
              public toastController: ToastController, private formBuilder: FormBuilder, public capHttp: HttpCapService,
              public extra : ExtraService, public checkStr: SessionService) { }

  ngOnInit(): void {
    this.forgotForm = this.formBuilder.group({
      email: ["", [Validators.email, Validators.required]]
    });
  }
  
  
  get f() {
    return this.forgotForm.controls;
  }




  forgot_password(){
    this.submitted = true;
    console.log(this.forgotForm.value)
    if(this.forgotForm.status === "VALID"){
      this.ls.showLoader();
      this.capHttp.postData('/forgot-password', this.forgotForm.value).then((res:any) => {  // console.log(res);
        console.log(res);
        this.ls.hideLoader();
        if(res.success === true){ 
            this.extra.alert(res.message);
        }else{
          if(res.message){
            this.extra.alert(res.message);
          }
        }    
      }).catch( err => {
      });
    }else{
      // this.presentToast('Please fill form correctlly!');
    }
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
