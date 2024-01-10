import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // {
  //   path: '',
  //   loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  // },

  {
    path: 'maintabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'subscription',
    loadChildren: () => import('./pages/subscription/subscription.module').then( m => m.SubscriptionPageModule)
  },
  {
    path: 'privacy',
    loadChildren: () => import('./pages/privacy/privacy.module').then( m => m.PrivacyPageModule)
  },
  {
    path: 'terms',
    loadChildren: () => import('./pages/terms/terms.module').then( m => m.TermsPageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./pages/about/about.module').then( m => m.AboutPageModule)
  },
  {
    path: 'phistory',
    loadChildren: () => import('./pages/phistory/phistory.module').then( m => m.PhistoryPageModule)
  },
  {
    path: 'app-lang',
    loadChildren: () => import('./modals/app-lang/app-lang.module').then( m => m.AppLangPageModule)
  },
  {
    path: 'blog-details',
    loadChildren: () => import('./pages/blog-details/blog-details.module').then( m => m.BlogDetailsPageModule)
  },
  {
    path: 'ac-gift-card',
    loadChildren: () => import('./modals/ac-gift-card/ac-gift-card.module').then( m => m.AcGiftCardPageModule)
  },
  {
    path: 'send-gift-card',
    loadChildren: () => import('./modals/send-gift-card/send-gift-card.module').then( m => m.SendGiftCardPageModule)
  },
  {
    path: 'rate-review',
    loadChildren: () => import('./modals/rate-review/rate-review.module').then( m => m.RateReviewPageModule)
  },
  {
    path: 'subscribe-plan',
    loadChildren: () => import('./modals/subscribe-plan/subscribe-plan.module').then( m => m.SubscribePlanPageModule)
  },
  {
    path: 'contact',
    loadChildren: () => import('./pages/contact/contact.module').then( m => m.ContactPageModule)
  },
  {
    path: 'site-review',
    loadChildren: () => import('./pages/site-review/site-review.module').then( m => m.SiteReviewPageModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./pages/notifications/notifications.module').then( m => m.NotificationsPageModule)
  },
  {
    path: 'wishlist',
    loadChildren: () => import('./pages/wishlist/wishlist.module').then( m => m.WishlistPageModule)
  },
  {
    path: 'most-played',
    loadChildren: () => import('./pages/most-played/most-played.module').then( m => m.MostPlayedPageModule)
  },
  {
    path: 'update-profile',
    loadChildren: () => import('./pages/update-profile/update-profile.module').then( m => m.UpdateProfilePageModule)
  },
  {
    path: 'update-password',
    loadChildren: () => import('./pages/update-password/update-password.module').then( m => m.UpdatePasswordPageModule)
  },
  {
    path: 'date-select',
    loadChildren: () => import('./modals/date-select/date-select.module').then( m => m.DateSelectPageModule)
  },
  {
    path: 'journey-details',
    loadChildren: () => import('./pages/journey-details/journey-details.module').then( m => m.JourneyDetailsPageModule)
  },
  {
    path: 'journey-details2',
    loadChildren: () => import('./pages/journey-details2/journey-details2.module').then( m => m.JourneyDetails2PageModule)
  },
  {
    path: 'payment-method',
    loadChildren: () => import('./pages/payment-method/payment-method.module').then( m => m.PaymentMethodPageModule)
  },
  {
    path: 'month-year',
    loadChildren: () => import('./modals/month-year/month-year.module').then( m => m.MonthYearPageModule)
  },
  {
    path: 'date-month-year',
    loadChildren: () => import('./modals/date-month-year/date-month-year.module').then( m => m.DateMonthYearPageModule)
  },
  {
    path: 'music-journey',
    loadChildren: () => import('./modals/music-journey/music-journey.module').then( m => m.MusicJourneyPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
