const nnavbar = window.Navbar;

const BookingForm = {
    props: ['showId', 'venueId', 'date', 'time','userId'],
    template: `
    <!--<div>
    <h2>Booking Form</h2>
    <nnavbar :user_id="userId"></nnavbar>
    <form @submit.prevent="bookTickets">
      <label for="show">Show:</label>
      <input type="text" id="show" v-model="showN" disabled>

      <label for="venue">Venue:</label>
      <input type="text" id="venue" v-model="venueN" disabled>

      <label for="date">Date:</label>
      <input type="text" id="date" v-model="date" disabled>

      <label for="time">Time:</label>
      <input type="text" id="time" v-model="time" disabled>

      <label for="tickets">Number of Tickets:</label>
      <input type="number" id="tickets" v-model="numberOfTickets">

      Use @click on the button to call the bookTickets method 
      <button >Book</button>
    </form>
  </div>-->
  <div class="container mt-5">
      <nnavbar :user_id="userId"></nnavbar>
      <div class="card p-5" style="height: auto; background-color: #E1BEE7; border-radius: 10px; padding: 20px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);">
        <h2 class="text-center">Booking Form</h2>
        <hr>
        <form @submit.prevent="bookTickets">
          <!--<div class="mb-3">
            <label for="show" class="form-label">Show:</label>
            <input type="text" id="show" class="form-control" v-model="showN" disabled>
          </div>-->
          <div class="mb-3">
          <label for="show" class="form-label" style="color: white;">Show:</label>
          <input type="text" id="show" class="form-control" v-model="showN" disabled style="color: white; background-color: black;">
           </div>

          <!--<div class="mb-3">
            <label for="venue" class="form-label">Venue:</label>
            <input type="text" id="venue" class="form-control" v-model="venueN" disabled>
          </div>-->
          <div class="mb-3">
          <label for="show" class="form-label" style="color: white;">Venue:</label>
          <input type="text" id="show" class="form-control" v-model="venueN" disabled style="color: white; background-color: black;">
           </div>

          <!--<div class="mb-3">
            <label for="date" class="form-label">Date:</label>
            <input type="text" id="date" class="form-control" v-model="date" disabled>
          </div>-->
          <div class="mb-3">
          <label for="show" class="form-label" style="color: white;">Date:</label>
          <input type="text" id="show" class="form-control" v-model="date" disabled style="color: white; background-color: black;">
           </div>

          <!--<div class="mb-3">
            <label for="time" class="form-label">Time:</label>
            <input type="text" id="time" class="form-control" v-model="time" disabled>
          </div>-->
          <div class="mb-3">
          <label for="show" class="form-label" style="color: white;">Time:</label>
          <input type="text" id="show" class="form-control" v-model="time" disabled style="color: white; background-color: black;">
           </div>

          <div class="mb-3">
            <label for="tickets" class="form-label">Number of Tickets:</label>
            <input type="number" id="tickets" class="form-control" v-model="numberOfTickets">
          </div>

          <button class="btn btn-primary">Book</button>
        </form>
      </div>
    </div>
    `,
    components: {
    nnavbar,
    },
    data() {
      return {
        numberOfTickets: 1,  // Default value of 1
        showId: this.$route.params.showId,
        venueId: this.$route.params.venueId,
        date: this.$route.params.date,
        time: this.$route.params.time,
        userId: this.$route.params.userId,
        the_show : {},
        showN: "",
        venueN: "",
        bookingSuccess: false,
      };
    },
    watch: {
      the_show(newVal) {
        this.showN = newVal.show.name;
        this.venueN = newVal.show.venue.name;
      },
      /*bookingSuccess(newVal) {
        if (newVal === true) {
          this.$router.push(`/User/${this.userId}/dashboard`);
        }
      },*/
    },
     /* methods: {
        bookTickets(){
          //this.$router.push(`/User/${this.userId}/dashboard`);
          alert(`Successfully booked ${this.numberOfTickets} ticket(s) for show ${this.showN} at venue ${this.venueN} on ${this.date} at ${this.time}`);
          this.$router.push(`/User/${this.userId}/dashboard`);
        }
      
    }*/
    methods: {
      async bookTickets() {
          // Make a POST request to the API
          const response = await fetch('http://localhost:5000/api/booking', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + localStorage.getItem('token') 
              },
              body: JSON.stringify({
                  venue_name: this.venueN,
                  show_name: this.showN,
                  date: this.date,
                  time: this.time,
                  num_tickets: this.numberOfTickets,
                  user_id: this.userId
              })
          });
          // Check if the request was successful
          if (response.ok) {
              // If the request was successful, redirect to the dashboard
              this.$router.push(`/User/${this.userId}/dashboard`);
              alert('done')
          } else {
              // If the request failed, log the error
              const errorData = await response.json();
              alert('An error occurred while booking tickets: ' + errorData.message);
              console.error('An error occurred while booking tickets:', await response.text());
          }
      }
  }
    
    
    
,
  
    async created() {  // Or replace "created" with "mounted" if you prefer
      // Fetch the specific show details
     const showResponse = await fetch(`http://localhost:5000/shows/${this.showId}`);
     if (showResponse.ok) {
       const showData = await showResponse.json();
       this.the_show = showData;  // Update the_show with the data from the API
     } else {
       console.log('An error occurred while fetching the specific show');
     }
    }
     




  };

window.BookingForm = BookingForm;  