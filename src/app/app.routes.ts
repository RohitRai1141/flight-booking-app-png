import { Routes } from '@angular/router';

// #region authentication
import { LoginComponent } from './authentication/components/login/login.component';
import { RegisterComponent } from './authentication/components/register/register.component';
import { HomeComponent } from './authentication/components/home/home.component';
import { authGuard } from './authentication/services/auth.guard';
import { ForgotPasswordComponent } from './authentication/components/forgotpassword/forgotpassword.component';
import { AdminDashboardComponent } from './authentication/components/admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './authentication/components/user-dashboard/user-dashboard.component';
// #endregion

// #region Cabs
import { CabSearchComponent } from './cab/components/cab-search/cab-search.component';
import { CabDetailsComponent } from './cab/components/cab-details/cab-details.component';
import { CabBookingComponent } from './cab/components/cab-booking/cab-booking.component';
import { CabHomeComponent } from './cab/components/cab-home/cab-home.component';
import { CabManageComponent } from './cab/components/cab-manage/cab-manage.component';
import { BookingHistoryComponent } from './cab/components/cab-history/cab-history.component';
import { AdminDriverCommunicationComponent } from './cab/components/admin-driver-communication/admin-driver-communication.component';
import { AdminManageBookingsComponent } from './cab/components/admin-manage-bookings/admin-manage-bookings.component';
import { CabAdminDashboardComponent } from './cab/components/admin-dashboard/admin-dashboard.component';
import{CabServiceProviderComponent}from './cab/components/cab-service-provider/cab-service-provider.component'
// #endregion

//#region Hotels
import { SearchHotelComponent } from './hotels/components/search-hotel/search-hotel.component';
import { HotelResultsComponent } from './hotels/components/hotel-results/hotel-results.component';
import { HotelDetailsComponent } from './hotels/components/hotel-details/hotel-details.component';
import { HotelBookingComponent } from './hotels/components/hotel-booking/hotel-booking.component';
import { MyBookings_Component } from './hotels/components/my-bookings/my-bookings.component';
import { AdminHotelsComponent } from './hotels/components/admin-hotels/admin-hotels.component';
import { AdminDashboard_Component } from './hotels/components/admin-dashboard/admin-dashboard.component';
import { AdminBookingsComponent } from './hotels/components/admin-bookings/admin-bookings.component';
import { ServiceProviderHotelComponent } from './hotels/components/service-provider-hotel/service-provider-hotel.component';
import { ServiceProviderDashboardComponent } from './hotels/components/service-provider-dashboard/service-provider-dashboard.component';
import { Hotels_DemopageComponent } from './hotels/components/demopage/demopage.component';
//#endregion

// #region Flight
import { FlightComponent } from './flight/components/flight/flight.component';
import { BookingComponent } from './flight/components/booking/booking.component';
import { SeatComponent } from './flight/components/seat/seat.component';
import { HistoryComponent } from './flight/components/history/history.component';
// import { DemopageForFlightComponent } from './flight/components/demopage-for-flight/demopage-for-flight.component';
import { AdminPanelComponent } from './flight/components/admin-panel/admin-panel.component';
import { AdminHistoryComponent } from './flight/components/admin-history/admin-history.component';
import { FlightAdminDashboardComponent } from './flight/components/flight-admin-dashboard/flight-admin-dashboard.component';
import { TicketComponent } from './flight/components/ticket/ticket.component';
//#endregion

// #region Tours
import { HomepageComponent } from './tour/components/homepage/homepage.component';
import { TourInfoComponent } from './tour/components/tour-info/tour-info.component';
import { BookingFormComponent } from './tour/components/tour-booking/tour-booking.component';
import { MyBookingsComponent } from './tour/components/my-bookings/my-bookings.component';
import { SuperAdminDashboardComponent } from './tour/components/super-admin-dashboard/super-admin-dashboard.component';
import { SuperAdminAgencyManagementComponent } from './tour/components/super-admin-agency-management/super-admin-agency-management.component';
import { AgencyAdminManagementComponent } from './tour/components/agency-admin-management/agency-admin-management.component';
import { AgencyAdminDashboardComponent } from "./tour/components/agency-admin-dashboard/agency-admin-dashboard.component";
import { DemopageComponent } from './tour/components/demopage/demopage.component';
import { Cab_Demo_Component } from './cab/components/demo/demo.component';
import { DemopageForFlightComponent } from './flight/components/demopage-for-flight/demopage-for-flight.component';
import { FlightServiceProviderDashboardComponent } from './flight/components/flight-service-provider/flight-service-provider.component';
//#endregion

export const routes: Routes = [
  // authentication
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'forgotpassword', component: ForgotPasswordComponent },
  { path: 'user-dashboard', component: UserDashboardComponent },
  { path: 'cab-service-provider', component: HomeComponent, canActivate: [authGuard] },
  { path: 'hotel-service-provider', component: HomeComponent, canActivate: [authGuard] },
  { path: 'flight-service-provider', component: HomeComponent, canActivate: [authGuard] },
  { path: 'tour-service-provider', component: HomeComponent, canActivate: [authGuard] },

  { path: '', redirectTo: '/login', pathMatch: 'full' },
//   { path: '**', redirectTo: '/login' },

  // cabs
  {
    path: 'cab',
    children: [
      {
        path: 'load',
        component: Cab_Demo_Component,
      },
      {
        path: 'home',
        component: CabHomeComponent,
      },
      {
        path: 'cab-search',
        component: CabSearchComponent,
      },
      {
        path: 'cab-details/:id',
        component: CabDetailsComponent,
      },
      {
        path: 'manage-bookings/:id',
        component: CabManageComponent,
      },
      {
        path: 'booking-history',
        component: BookingHistoryComponent,
      },
      {
        path: 'cab-booking/:id',
        component: CabBookingComponent,
      },
    ],
  },
  {
    path: 'admin',
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: CabAdminDashboardComponent,
      },
      {
        path: 'communication',
        component: AdminDriverCommunicationComponent,
      },
      {
        path: 'admin-manage',
        component: AdminManageBookingsComponent,
      },
    ],
  },
  {
    path: 'service',
    children: [
      {
        path: 'cab-service',
        component: CabServiceProviderComponent
      }
      ]
    },

  // hotels
  // { path: '', component: LoginPageComponent },
  { path: 'hotel', component: Hotels_DemopageComponent },
  {
    path: 'hotels',
    children: [
      { path: 'search', component: SearchHotelComponent },
      { path: 'search-results', component: HotelResultsComponent },
      { path: 'hotel-details/:id', component: HotelDetailsComponent },
      { path: 'hotel-booking', component: HotelBookingComponent },
      { path: 'my-bookings', component: MyBookings_Component },
      {
        path: 'admin',
        children: [
          { path: 'hotels', component: AdminHotelsComponent },
          { path: 'dashboard', component: AdminDashboard_Component },
          { path: 'bookings', component: AdminBookingsComponent },
        ],
      },
      { path: 'service-provider',
        children: [
          { path: 'hotels', component: ServiceProviderHotelComponent },
          { path: 'dashboard', component: ServiceProviderDashboardComponent },
        ]
      },
    ],
  },

  // Flight Routes
  { path: 'flights', component: DemopageForFlightComponent },
  {
    path: 'flight',
    children: [
      { path: 'search', component: FlightComponent },
      { path: 'booking/:id', component: BookingComponent },
      { path: 'seat/:id', component: SeatComponent },
      { path: 'flight-ticket', component:TicketComponent },
      { path: 'history', component: HistoryComponent },
      { path: 'service-provider', component: FlightServiceProviderDashboardComponent },
    ],
  },
  {
    path: 'flight-admin',
    children: [
      { path: 'panel', component: AdminPanelComponent },
      {
        path: 'Flight-admin-dashboard',
        component: FlightAdminDashboardComponent,
      },
      { path: 'adminHistory', component: AdminHistoryComponent },
    ],
  },

  // tours
  { path: 'tour', component: DemopageComponent },
  {
    path: 'tours',
    children: [
      {
        path: 'home',
        component: HomepageComponent,
      },
      {
        path: 'package/:id',
        component: TourInfoComponent,
      },
      {
        path: 'package/:id/reserve',
        component: BookingFormComponent,
      },
      {
        path: 'my-bookings',
        component: MyBookingsComponent,
      },
      {
        path: 'superadmin',
        children: [
          {
            path: 'dashboard',
            component: SuperAdminDashboardComponent,
          },
          {
            path: 'dashboard/agencies',
            component: SuperAdminAgencyManagementComponent,
          },
        ],
      },
      {
        path: 'agencyadmin',
        children: [
          {
            path: ':agencyId/dashboard',
            component: AgencyAdminDashboardComponent,
          },
          {
            path: ':agencyId/dashboard/packages',
            component: AgencyAdminManagementComponent,
          },
        ],
      },
    ],
  },
];
