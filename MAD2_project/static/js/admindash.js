const AANavbar = window.ANavbar;
const vvenuecard = window.venuecard;
// Admin dashboard Root 
const admin_dashComponent = {
    props:["admin_id"],
    template:`
    <!--<div class="container">
      <h1>Movies</h1>
      <AANavbar :admin_id="admin_id"></AANavbar>

      <div class="row" v-if="venues && venues.length">
        <vvenuecard v-for="venue in venues" :key="venue.id" :venue="venue" :admin_id="admin_id" @show-deleted="removeShow" />
      </div>
      <div class="col-md-12" v-else>
        <p>No Venues Found.</p>
        <router-link :to="{ name: 'add_venue', params: { admin_id: admin_id } }" class="btn btn-primary">Add Venue</router-link>
      </div>
    </div>-->
    <div class="container" style="background-color: #F3F0FF;">
  <h1 style="color: #6C63FF; text-align: center; padding: 20px;">Movies</h1>
  <AANavbar :admin_id="admin_id"></AANavbar>

  <div class="row" v-if="venues && venues.length">
    <div class="col-12 col-md-6 col-lg-4 mb-4" v-for="venue in venues" :key="venue.id">
      <vvenuecard :venue="venue" :admin_id="admin_id" @show-deleted="removeShow" @venue-deleted="removeVenue" class="card p-3" style="background-color: #E0DEFF; color: #6C63FF;" />
    </div>
  </div>

  <div class="col-md-12" v-else>
    <p style="color: #6C63FF;">No Venues Found.</p>
    <router-link :to="{ name: 'add_venue', params: { admin_id: admin_id } }" class="btn btn-primary" style="background-color: #6C63FF; border-color: #6C63FF;">Add Venue</router-link>
  </div>
</div>

    `,
    components: {
      AANavbar, vvenuecard// Include the Navbar component here
    },
    data() {
      return {
        venues : [
        ]
      }
    },
    methods: {
      removeShow({ venueId, showId }) {
        const venue = this.venues.find(venue => venue.id === venueId);
        venue.shows = venue.shows.filter(show => show.id !== showId);
      },
      removeVenue(venueId) {
        this.venues = this.venues.filter(venue => venue.id !== venueId);
      },
      
    },
    
    async created() {
      // Fetch venues data from the API when the component is mounted
      const venuesResponse = await fetch('http://localhost:5000/api/venues');
      if (venuesResponse.ok) {
        const venuesData = await venuesResponse.json();
        this.venues = venuesData.venues;  // Update the venues data
      } else {
        console.log('An error occurred while fetching the venues data');
      }
    }
  
  };
window.admin_dashComponent = admin_dashComponent;