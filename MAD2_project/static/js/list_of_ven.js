// List of Cinemas component
const navbar = window.Navbar;
const list_ven = {
  props:["user_id"],// leaving space for props if any
    template:`
    <div class="container">
      <h1 class="header">Venues List</h1>
      <h2>
      <navbar :user_id = "user_id"></navbar></h2>
      <div class="venue-container" v-for="venue in venues" :key="venue.id">
        <h2>{{ venue.name }}</h2>
        <p>{{ venue.location }}</p>
        <!-- handle booking in a method and pass venue.id as an argument -->
        <button @click="book(venue.id)" class="btn btn-success">Book</button>
      </div>
    </div>
    `,
    components: {
      navbar,
    },
    data() {
      return {
        // Enter data values
        venues : [
          
        ]
      }
    },
    methods: {
      //performSearch() {
        // Your search logic here
      //},
      book(venueId) {
        // Your booking logic here
        // When book is clicked display shows for venue
        this.$router.push({ 
          name: 'ShowsForVen', 
          params: { user_id: this.user_id, venue_id: venueId } 
        })
      }
    },
    async created() {
      const response = await fetch("http://localhost:5000/api/venues");
      if (!response.ok) {
        console.error("An error occurred:", response.status);
        return;
      }
      const data = await response.json();
      this.venues = data.venues;
    },
  };
window.list_ven = list_ven;