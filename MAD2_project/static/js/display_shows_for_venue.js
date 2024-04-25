const newnavbar = window.Navbar;
const shows_for_ven = {
    // space for props
    props:["user_id","venue_id"],
    template : `
    <div class="container" >
    <h1 class="text-center" v-if="shows.length">Shows at {{ shows[0].venue.name }}</h1>
    <h2>
      <nnavbar :user_id = "user_id"></nnavbar></h2>
    <p class="text-center" v-if="shows.length">Location: {{ shows[0].venue.location }}</p>
    <div class="card" v-for="(show, index) in shows" :key="index">
      <h5>Show Name: {{ show.name }}</h5>
      <p>Date: {{ show.Date }}</p>
      <p>Time: {{ show.time }}</p>
      <p>Price: {{ show.price }}</p>
      <p>Available Seats: {{ show.available_seats }}</p>
      <router-link :to="{ name: 'BookingForm', params: { showId: show.id, venueId: venue_id, date: show.Date, time: show.time, userId: user_id}}">Book</router-link>
    </div>
    <p v-else>No shows for this venue.</p>
  </div>
        `,
        components: {
            nnavbar,
          },
          data(){
            return {
                /*venue: {
                    id: 1,
                    name: 'ABC Cinema',
                    location: '123 Street, City, State'
                  }*/
                  venue_id: this.$route.params.venue_id,
                  shows: [
                    {
                      id: 101,
                      name: 'Movie Title 1',
                      date: '2023-08-01',
                      time: '16:00',
                      price: 15,
                      availableSeats: 100
                    },
                    {
                      id: 102,
                      name: 'Movie Title 2',
                      date: '2023-08-01',
                      time: '18:00',
                      price: 20,
                      availableSeats: 80
                    },
                    {
                      id: 103,
                      name: 'Movie Title 3',
                      date: '2023-08-02',
                      time: '16:00',
                      price: 15,
                      availableSeats: 75
                    },
                  ],
            }
          },
          async created() {
            // Fetch shows from the API when the component is mounted
            const response = await fetch(`http://localhost:5000/api/shows/byvenue/${this.venue_id}`);
            if (response.ok) {
              const data = await response.json();
              this.shows = data.shows;  // Update the shows data
            } else {
              console.log('An error occurred while fetching the shows');
            }
          },
          
};
window.shows_for_ven = shows_for_ven;