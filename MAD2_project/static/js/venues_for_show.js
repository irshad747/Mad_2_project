// display venues for show
const venues_for_show = {
  props: ['showId','userId'],
  template: `
  <div class="container mt-5">
    <Navbar :user_id="userId"></Navbar>
  <div class="card p-5 mb-3" style="border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2); background-color: #f3e5f5;">
      <h2 class="text-center">Venues showing {{ the_show.show.name }}</h2>
        <hr>
        <p class="lead">{{ the_show.Synopsis }}</p>
        <hr>
        <p>{{ the_show.show.Description }}</p>
      </div>
    
   
  <div v-for="show in shows" :key="show.venue.id" class="card mb-3" style="border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2); background-color: #e1bee7;">
    <div class="card-body">
      <h5 class="card-title">Venue Name: {{ show.venue.name }}</h5>
      <p class="card-text">Location: {{ show.venue.location }}</p>
      <p class="card-text">Capacity: {{ show.venue.capacity }}</p>
      <p class="card-text">Show Dates and Timings and seats:</p>
      <ul class="list-unstyled">
      <li>
        <p>Seats available: {{ show.available_seats }}</p>
        <!--<a v-if="show.name === 'Tarzan'">{{ show.Date }} - {{ show.time }}</a>-->
        <router-link :to="{ name: 'BookingForm', params: { showId: show.id, venueId: show.venue.id, date: show.Date, time: show.time, userId: userId}}" class="btn btn-primary">
        {{ show.Date }} - {{ show.time }}
        </router-link>
        </li>
      </ul>
    </div>
  </div>
</div> 
  `,
  components:{
    Navbar,
  },
  data(){
    return {
      /*the_show: [
        {
          poster: null,
          name: "Tarzan",
          Description: "Man in the jungle",
          Synopsis: "love in the wild",
          rating: 5,
          tag: "action",
          id:1
        },
        {
          poster: null,
          name: "Tarzan",
          Description: "Man in the jungle",
          Synopsis: "love in the wild",
          rating: 5,
          tag: "action",
          id:"2"
        },
        {
          poster: null,
          name: "Tarzan",
          Description: "Man in the jungle",
          Synopsis: "love in the wild",
          rating: 5,
          tag: "action",
          id : 3
        }
      ],*/
      the_show :{"name":"Oppenheimer","Synopsis":"Man in the jungle","Description":"Irshad"},
      shows: [
        {
            "id": 3,
            "name": "Barbie",
            "time": "2:00 Pm",
            "venue_id": 4,
            "available_seats": 240,
            "price": 700,
            "rating": "7",
            "tag": "drama",
            "Date": "2027-06-18",
            "poster": null,
            "Synopsis": "Matrix 4",
            "Description": "Margot Robbie",
            "venue": {
                "id": 4,
                "name": "Gulbarg",
                "location": "Rajasthan",
                "capacity": 100,
                "current_capacity": 50
            }
        }
    ]

      /*venues : [
        {
          id: 1,
          name: 'Cinema 1',
          location: 'New York',
          capacity: 200,
          shows: [
            {
              id: 1,
              name: 'Tarzan',
              available_seats: 100,
              venue_id: 1,
              Date: '2023-07-10',
              time: '19:00:00'
            },
            {
              id: 2,
              name: 'Tarzan',
              available_seats: 50,
              venue_id: 1,
              Date: '2023-07-11',
              time: '14:00:00'
            }
          ]
        },
        {
          id: 2,
          name: 'Cinema 2',
          location: 'Los Angeles',
          capacity: 150,
          shows: [
            {
              id: 3,
              name: 'Tarzan',
              available_seats: 75,
              venue_id: 2,
              Date: '2023-07-10',
              time: '20:00:00'
            },
            {
              id: 4,
              name: 'Tarzan',
              available_seats: 100,
              venue_id: 2,
              Date: '2023-07-12',
              time: '16:00:00'
            }
          ]
        }
      ]*/

    }
  },
  async created() {  // Or replace "created" with "mounted" if you prefer
   // Fetch the specific show details
  const showResponse = await fetch(`http://localhost:5000/shows/${this.showId}`);
  if (showResponse.ok) {
    const showData = await showResponse.json();
    this.the_show = showData;  // Update the_show with the data from the API
  } else {
    console.log('An error occurred while fetching the specific show');
  }



    const response = await fetch(`http://localhost:5000/shows/byname/${this.the_show.show.name}`);
    if (response.ok) {
      const data = await response.json();
      this.shows = data.shows
      //this.shows = data.shows.map(show => show.show_info); 
      //console.log(this.shows) // Update shows with the data from the API
    } else {
      console.log('An error occurred while fetching the shows');
    }
  },

   
};
window.venues_for_show = venues_for_show;