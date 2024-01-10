import { Component, ViewChild } from '@angular/core';

import { Router } from '@angular/router';

import { NavController, Platform, isPlatform, ToastController, AlertController } from '@ionic/angular';
import { SessionService } from './../services/session.service';
import { EventService } from './../services/event.service';
import { ExtraService } from './../services/extra.service';
import { HttpCapService } from '../services/http-cap.service';
import { UserProfileService } from '../services/user-profile.service';

import { ModalController } from '@ionic/angular';
import { MusicJourneyPage } from '../modals/music-journey/music-journey.page';

import { IonicSlides, IonSlides, IonSlide } from '@ionic/angular';




@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  @ViewChild('slides', { static: true }) slider: IonSlides;  


  isLoggedIn: boolean = false;
  userData: any;
    user_token: any;
    userPlan: any;

  base_url: string;
  intro: any;
  nextData: any;
  prevData: any;
  levelData: any;

  userWishlistData: any;

  segmentLevel: any = [];
  selectedSegLevel: number = 0;


  slideConfig = {
    centeredSlides: true,
    autoHeight: true
  };
  isReadMore = true


  

  constructor(private navCtrl: NavController, private router: Router, public modalCtrl: ModalController,
    public toastController: ToastController, private platform: Platform,
    public checkStr: SessionService, 
    public eventServ: EventService,
    public extraServ: ExtraService,
    public capHttp: HttpCapService,
    public userPS: UserProfileService) 
    
    { this.eventPublish_subs(); }


  // subscribe to event 
  eventPublish_subs(){
    this.eventServ.subs_Event.subscribe((data: any) => {
      console.log("Tab1 Subs: " + data);
      if(data.subs){
        this.checkLogin();
      }else{ }
      //  console.log('user#:   '+ this.user_role +'   '+ this.isLoggedIn);    
    }); 
  } 




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
            this.getUser_DashboardData(this.user_token);
            this.getUser_WishlistData(this.user_token)
            this.getUserData();
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
      this.capHttp.getData('/user-profile', this.user_token).then((res:any) => { //  console.log(res);
        // console.log(res.data);
        if(res.success === true){
           this.userData = res.data.userData;
           this.userPlan = res.data.plan;
           console.log(this.userPlan);
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




  getUser_DashboardData(userToken){
      this.capHttp.getData('/dashboard', userToken).then((res:any) => {  // console.log(res);
        console.log(res.data);
        if(res.success === true){
          this.base_url = res.data.base_url;
          this.intro  = res.data.intro1.file;
          this.nextData = res.data.next;
          this.prevData = res.data.prev;
          this.levelData = res.data.levelData;

          this.segmentLevel = this.levelData;
        }else{
           this.presentToast(res.message);
        }
      }).catch( err => {
        // alert(JSON.stringify(err));
      });
  }



  getUser_WishlistData(userToken){
    this.capHttp.getData('/getFavourite', userToken).then((res:any) => {  // console.log(res);
      console.log(res.data);
      if(res.success === true){
        this.base_url = res.base_url;
        this.userWishlistData = res.data;
      }else{
         this.presentToast(res.message);
      }
    }).catch( err => {
      // alert(JSON.stringify(err));
    });
  }




  



  addTo_Wishlist(track_id){
    this.capHttp.postData('/addFavourite', {"journey_level_id": track_id, "action": "add"}, this.user_token).then((res:any) => {   console.log(res);
      // console.log(res.data);
      if(res.success === true){
        this.getUser_DashboardData(this.user_token);
        this.getUser_WishlistData(this.user_token);
      }else{
         this.presentToast(res.message);
      }
    }).catch( err => {
      // alert(JSON.stringify(err));
    });
  }





  removeFrom_Wishlist(track_id){
    this.capHttp.postData('/addFavourite', {"journey_level_id": track_id, "action": "remove"}, this.user_token).then((res:any) => {   console.log(res);
      // console.log(res.data);
      if(res.success === true){
         this.getUser_DashboardData(this.user_token);
         this.getUser_WishlistData(this.user_token);
      }else{
         this.presentToast(res.message);
      }
    }).catch( err => {
      // alert(JSON.stringify(err));
    });
  }





  onSegmentChanged(event: any) {
    // console.log("Segment changed to", event.detail.value);
    // const selectedIndex = this.segmentBlog.findIndex((slide) => {
    //   console.log(slide.id)
    //   return slide.id === event.detail.value;
    // });
    // console.log(event.detail.value);
    // console.log(selectedIndex)
    // this.slider.slideTo(selectedIndex);
    this.slider.slideTo(this.selectedSegLevel);  
    console.log(this.selectedSegLevel);
  }



  onSlideChanged() {
    this.slider.getActiveIndex().then(
      (index)=>{
         this.selectedSegLevel = index;
     });
    document.getElementById("segment-" + this.selectedSegLevel).scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center'
    });


    // const currentSlide = this.segmentBlog[slider.getActiveIndex()];
    // this.selectedSegBlog = currentSlide.id;
  }







  goto_journeyDetailPage(level_i, level_text, lvl_id, jrn_id, jrn_type){
    console.log(level_i, level_text, lvl_id, jrn_id, jrn_type);
    // this.router.navigate(['level-details'], { });
    if(lvl_id  && jrn_id){
      if(jrn_type == 'free'){
         this.router.navigate(['journey-details'], { queryParams : {"level_text": 'Level '+level_i+'.  '+level_text, "level_id": lvl_id, "journey_id": jrn_id} });
      }else if(jrn_type == 'paid'){
        if(this.userPlan && this.userPlan.type){        
           if('completedPrevious'){
              this.router.navigate(['journey-details'], { queryParams : {"level_text": 'Level '+level_i+'.  '+level_text, "level_id": lvl_id, "journey_id": jrn_id} });
           }else{
            this.songStatusToast('Please complete your previous journey to listen this track.');
           }
        }else{          
          this.subsToast('Please take Subscription Plan!');
        }
      }else{
         this.presentToast('Level or Journey type is missing!');
      }
    }else{
       this.presentToast('Level or Journey id is missing!');
    }
  }



  goto_journeyDetailPage2(lvl_id, jrn_id){
    this.router.navigate(['journey-details2'], {queryParams : {"level_id": lvl_id, "journey_id": jrn_id} });
  }

  

  goto_subsriptionPlan(){
    this.router.navigate(['subscription']);
  }



  async playJourney_Music(bg_img, song_id, song_tilte, song_durr, song_fav, song_name, song_download){
    // console.log(bg_img, song_id, song_tilte, song_durr, song_fav, song_name, song_download);
    const modal = await this.modalCtrl.create({
      component: MusicJourneyPage,
      animated: true,  
      cssClass: 'song-modal',
      mode: 'md', 
      initialBreakpoint: 1,
      breakpoints: [0, 1, 1],
      backdropDismiss:false,
      componentProps: { user_token: this.user_token, bg_img: bg_img, song_id: song_id, song_tilte: song_tilte, 
                        song_durr: song_durr, song_fav: song_fav, song_name: song_name, song_download: song_download }
      });

      modal.onDidDismiss().then((data) => {
        console.log(data.data);
        // {"sort" : "relevance"}
      });
      return await modal.present();
  }




  async songStatusToast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      mode: 'md',
      icon: 'lock-closed',
      position: 'bottom',
    });
    toast.present();
  }




  async subsToast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 5000,
      mode: 'md',
      icon: 'lock-closed',
      position: 'bottom',
      cssClass: 'toast-subs',
      buttons: [
        {
          side: 'end',
          text: 'Go Subscription',
          handler: () => {
            console.log('Subscription clicked');
            this.goto_subsriptionPlan();
          }
        }
      ]
    });
    toast.present();
  }



  async presentToast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

}


