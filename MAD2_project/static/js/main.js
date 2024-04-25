// Importing all the routes
const UUserComponent = window.UserComponent;
const AAdminComponent = window.AdminComponent;
const uuser_dashComponent = window.user_dashComponent;
const aadmin_dashComponent = window.admin_dashComponent;
const vvenues_for_show = window.venues_for_show;
const BBookingForm = window.BookingForm;
const llist_ven = window.list_ven;
const uuser_profile = window.user_profile;
const AAddShow = window.AddShow;
const EEditVenue = window.EditVenue;
const DDeleteVenueConfirmation = window.DeleteVenueConfirmation;
const AAddVenue = window.AddVenue;
const EEditShowComponent = window.EditShowComponent;
const DDeleteShowConfirmationComponent = window.DeleteShowConfirmationComponent;
const sshows_for_ven = window.shows_for_ven;
//const ANavbar = window.ANavbar;
const sshowcard = window.showcard;
const ssearchResult = window.searchResult;
const UUserRegister = window.UserRegister
//const venuecard = window.venuecard;















// Set up Vue Router
const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    mode:'hash',
    routes: [
      { path: '/User', component: UUserComponent,props:true },
      { path: '/Admin', component: AAdminComponent,props:true },
      { path: '/User/:user_id/dashboard', component: uuser_dashComponent,props:true,name:'user_dashboard' },
      { path: '/Admin/:admin_id/dashboard', component: aadmin_dashComponent,props:true,name: 'admin_dashComponent' },
      {
        path: '/venues/:showId/:userId',
        component: vvenues_for_show,
        props:true
      },
      {
        path: '/booking/:showId/:venueId/:date/:time/:userId',
        component: BBookingForm,
        props: true,
        name:'BookingForm'
      },
      {
        path: '/list_ven/:user_id',
        name: 'list_ven',
        component: llist_ven,
        props:true
      },
      {
        path: '/orders/:user_id',
        name: 'user_profile',
        component: uuser_profile,
      },
      {
        path: '/add-show/:venue_id/:admin_id/:current_capacity',
        component: AAddShow,
        props: true,
        name: 'add_show'
      },
      {
        path: '/edit-venue/:venue_id/:admin_id',
        component: EEditVenue,
        props: true,
        name : 'edit_venue'
      },
      {
        path: '/delete-venue-confirmation/:venue_id/:admin_id',
        component: DDeleteVenueConfirmation,
        props: true,
        name:'delete_venue_confirmation'
      },
      {
        path: '/add-venue/:admin_id',
        component: AAddVenue,
        props:true,
        name: 'add_venue'
      },
      { 
        path: '/edit-show/:show_id/:admin_id', 
        component: EEditShowComponent, 
        name : 'edit_show'
       
      },
      { 
        path: '/delete-show-confirmation/:show_id', 
        component: DDeleteShowConfirmationComponent, 
        name:'delete_show_confirmation'
        
      },
      {
        path: '/shows_for_ven/:user_id/:venue_id',
        name: 'ShowsForVen',
        component: sshows_for_ven,
        props: true
      },
      {
        path: '/search/:showQuery/:venueLocation/:ShowTags/:user_id',
        name: 'searchResult',
        component: ssearchResult,
        props: true
      },
      { path: '/user/register', component: UUserRegister },
  
      
      
     
  
    ]
  });
  
  
  
  
  
  var app = Vue.createApp({
    
    data() {
      return{
      Title: "Show Buzz",
      Options: "How would you like to begin?",
      names: [],
      showuser:true,
      buttonStyle:"btn btn-primary"};
    },
    methods: {
      sayHi: function (name) {
        this.message = " hi ";
        this.names.push(this.vistor_name);
        this.vistor_name = "";
        this.buttonStyle = "btn btn-success"
      },
      handleUserClick: function(){
        this.showuser=!this.showuser;
      }
    },
    computed : {
        count: function(){
            return this.names.length;
        }
    }    
  })
  app.use(router);
  app.mount('#app')
  