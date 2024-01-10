import { Component, OnInit, ViewChild } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';

import { HttpCapService } from '../../services/http-cap.service';
import { SessionService } from '../../services/session.service';
import { ExtraService } from '../../services/extra.service';
import { LoaderService } from 'src/app/services/loader.service';

import { ToastController, IonContent, Platform } from '@ionic/angular';
import { Location } from "@angular/common";


@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.page.html',
  styleUrls: ['./blog-details.page.scss'],
})
export class BlogDetailsPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;

   blog_id: number;

   base_url: string;

   blogData: any;
   related_blog: any[];
   latest_blog: any;

 

  constructor(public toastController: ToastController,private location: Location, public alertController: AlertController, 
              private router: Router, public capHttp: HttpCapService,
              public extra : ExtraService, public checkStr: SessionService,
              public activatedRoute : ActivatedRoute, private ls: LoaderService,
              private navCtrl: NavController, private platform: Platform)

  
  {
    this.activatedRoute.queryParams.subscribe((res: any)=>{
      this.blog_id = res.blog_id;    
      this.getBlog_Details(this.blog_id);
     });
  }




  getBlog_Details(id){
    this.capHttp.getData('/blog-details/'+id).then((res:any) => {  // console.log(res);
      console.log(res);
      if(res.success === true){
        this.base_url = res.data.base_url;
        this.blogData = res.data.blog;
        this.related_blog = res.data.related;
        this.latest_blog = res.data.latest
      }else{
         this.presentToast(res.message);
      }
    }).catch( err => {
      // alert(JSON.stringify(err));
    });
  }



  goto_blogDetails(blog_id: any){
    console.log(blog_id)
    this.ls.showLoader();
    setTimeout( () => {
      this.ls.hideLoader();
    }, 500)
    this.router.navigate(['/blog-details'], { queryParams : {"blog_id": blog_id} });
    this.content.scrollToTop(1000);
  }



  async presentToast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }


  ngOnInit() {
  }

}
