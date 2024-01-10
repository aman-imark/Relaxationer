import { Component, ViewChild } from '@angular/core';

import { Router } from '@angular/router';

import { NavController, Platform, isPlatform, ToastController, AlertController } from '@ionic/angular';
import { SessionService } from './../services/session.service';
import { EventService } from './../services/event.service';
import { ExtraService } from './../services/extra.service';
import { HttpCapService } from '../services/http-cap.service';

import { IonicSlides, IonSlides, IonSlide } from '@ionic/angular';



@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  @ViewChild('slides', { static: true }) slider: IonSlides;  


  isLoggedIn: boolean = false;
  userData: any;
    user_token: any;

  base_url: string;
  all_blog: any;
  blog_byCat: any;


  segmentBlog: any = [];
  selectedSegBlog: number;


  slideConfig = {
    centeredSlides: true,
    autoHeight: true
  };
  isReadMore = true

  constructor(private navCtrl: NavController, private router: Router,
    public toastController: ToastController, private platform: Platform,
    public checkStr: SessionService, 
    public eventServ: EventService,
    public extraServ: ExtraService,
    public capHttp: HttpCapService) 
    
    {  }


  ionViewWillEnter() {
    this.checkLogin();
  }

  ionViewWillLeave() {
    this.checkLogin();
  }

  doRefresh(event: any) {
    setTimeout(() => {
      this.checkLogin();
      event.target.complete();
    }, 2000);
  }



  checkLogin(){
    this.checkStr.getStore('userData').then((data:any) => {   
      // console.log(data);
      if(data != null || data != '' || typeof(data) != 'undefined'){
        if(data.token){          
          this.isLoggedIn = true;
            this.user_token = data.token;
            this.getBlogData();
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



  getUserData(){
      this.capHttp.getData('/user-profile', this.user_token).then((res:any) => {   console.log(res);
        console.log(res.data);
        if(res.success === true){
           this.userData = res.userData;
        }else{
          this.presentToast(res.message);
        }
      }).catch( err => {
        // alert(JSON.stringify(err));
      });
  }




  showText() {
    this.isReadMore = !this.isReadMore
  }



  getBlogData(){
      this.capHttp.getData('/blog-by-types').then((res:any) => {  // console.log(res);
        console.log(res.data);
        if(res.success === true){
          this.base_url = res.data.base_url;
          this.all_blog = res.data.all;
          this.blog_byCat = res.data.blog;

            const tt = {
              "id": 0,
              "name": "All",
              "created_at": "",
              "updated_at": "",
              "deleted_at": null,
              "blog": this.all_blog 
            }
          this.segmentBlog = this.blog_byCat;
          this.segmentBlog.unshift(tt);
           this.selectedSegBlog = this.segmentBlog[0].id;          

        }else{
           this.presentToast(res.message);
        }
      }).catch( err => {
        // alert(JSON.stringify(err));
      });
  }





  onSegmentChanged(event: any) {
    console.log("Segment changed to", event.detail.value);
    // const selectedIndex = this.segmentBlog.findIndex((slide) => {
    //   console.log(slide.id)
    //   return slide.id === event.detail.value;
    // });
    // console.log(event.detail.value);
    // console.log(selectedIndex)
    // this.slider.slideTo(selectedIndex);
    this.slider.slideTo(this.selectedSegBlog);  
  }



  onSlideChanged() {
    this.slider.getActiveIndex().then(
      (index)=>{
         this.selectedSegBlog = index;
     });
     document.getElementById("segmentBlog-" + this.selectedSegBlog).scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center'
     });
    // const currentSlide = this.segmentBlog[slider.getActiveIndex()];
    // this.selectedSegBlog = currentSlide.id;
  }



  goto_blogDetails(blog_id: any){
    console.log(blog_id)
    this.router.navigate(['blog-details'], { queryParams : {"blog_id": blog_id} });
  }


  async presentToast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }



}
