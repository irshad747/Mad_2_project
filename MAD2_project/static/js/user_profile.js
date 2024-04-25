// User Profile / orders component
const user_profile = {
    // Add props if any
    props:["user_id"],
    template:`
    <!--<div class="container">
    <h1>Welcome to Your User Profile!</h1>
    <h2>User Info</h2>
    <ul>
      <li><strong>Name:</strong> {{ user.name }}</li>
      <li><strong>Email:</strong> {{ user.email }}</li>
    </ul>
  
    <h2>Booking History</h2>
    <table>
      <thead>
        <tr>
          <th>Show Name</th>
          <th>Theater</th>
          <th>Show Time</th>
          <th>Number of Tickets</th>
          <th>Total Price</th>
          <th>Ratings</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="booking in bookings" :key="booking.id">
          <td>{{booking.show.name}}</td>
          <td>{{booking.show.venue.name}}</td>
          <td>{{booking.show.time}}</td>
          <td>{{booking.num_tickets}}</td>
          <td>{{booking.num_tickets * booking.show.price}}RS</td>
          <td>
            <form @submit.prevent="rate(booking.show.id)">
              <select v-model="booking.rating">
                <option v-for="rating in 10" :key="rating" :value="rating">{{ rating }}</option>
              </select>
              <button type="submit">Rate</button>
            </form>
          </td>
        </tr>
      </tbody>
    </table>
  
    <h2>Update Profile</h2>
    <form @submit.prevent="updateProfile">
      <label for="name">Name:</label>
      <input type="text" id="name" name="name" v-model="user.name">
      <br>
      <label for="email">Email:</label>
      <input type="email" id="email" name="email" v-model="user.email">
      <br>
      <label for="phone">Phone:</label>
      <input type="tel" id="phone" name="phone" v-model="user.phone">
      <br>
      <label for="address">Address:</label>
      <textarea id="address" name="address" v-model="user.address"></textarea>
      <br>
      <button type="submit">Update Profile</button>
    </form>
  </div>-->

  <div class="container my-4">
  <h1 class="text-center">Welcome to Your User Profile!</h1>
  <Navbar :user_id="user_id"></Navbar>


  <h2 class="my-4">User Info</h2>
  <ul class="list-group mb-4">
    <li class="list-group-item"><strong>Name:</strong> {{ user.name }}</li>
    <li class="list-group-item"><strong>Email:</strong> {{ user.email }}</li>
  </ul>

  <h2 class="my-4">Booking History</h2>
  <table class="table table-striped">
    <thead class="thead-dark">
      <tr>
        <th>Show Name</th>
        <th>Theater</th>
        <th>Show Time</th>
        <th>Number of Tickets</th>
        <th>Total Price</th>
        <th>Ratings</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="booking in bookings" :key="booking.id">
        <td>{{booking.show.name}}</td>
        <td>{{booking.show.venue.name}}</td>
       <td>{{booking.show.time}}</td>
        <td>{{booking.num_tickets}}</td>
        <td>{{booking.num_tickets * booking.show.price}}RS</td>
        <td>
          <form @submit.prevent="rate(booking.show.id)">
            <select v-model="booking.rating" class="form-control">
              <option v-for="rating in 10" :key="rating" :value="rating">{{ rating }}</option>
            </select>
            <button type="submit" class="btn btn-primary mt-2">Rate</button>
          </form>
        </td>
      </tr>
    </tbody>
  </table>

  <h2 class="my-4">Update Profile</h2>
  <form @submit.prevent="updateProfile" class="mb-4">
    <div class="form-group">
      <label for="name">Name:</label>
      <input type="text" id="name" name="name" v-model="user.name" class="form-control">
    </div>
    <div class="form-group">
      <label for="email">Email:</label>
      <input type="email" id="email" name="email" v-model="user.email" class="form-control">
    </div>
    <div class="form-group">
      <label for="phone">Phone:</label>
      <input type="tel" id="phone" name="phone" v-model="user.phone" class="form-control">
    </div>
    <div class="form-group">
      <label for="address">Address:</label>
      <textarea id="address" name="address" v-model="user.address" class="form-control"></textarea>
    </div>
    <button type="submit" class="btn btn-primary">Update Profile</button>
  </form>
</div>
    `,
    components: {
      Navbar, // Include the Navbar component here
    },
    data() {
      return {
        // Enter data here
        user: {
        
        },
        user_id: this.$route.params.user_id,
        bookings: [],
      }
    },
    computed: {
      userId() {
        return this.user.id;
      }
    },
    methods: {
      async updateProfile() {
          const response = await fetch(`http://localhost:5000/update/user/${this.user_id}`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(this.user)
          });
          
          if (response.ok) {
              alert('Profile updated successfully');
          } else {
              console.error('An error occurred while updating the profile:', await response.text());
          }
      },
      async rate(showId) {
          const rating = this.bookings.find(booking => booking.show.id === showId).rating;
          const response = await fetch('http://localhost:5000/api/ratings', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  user_id: this.user_id,
                  show_id: showId,
                  rating: rating
              })
          });
          
          if (response.ok) {
              alert('Rating submitted successfully');
          } else {
              console.error('An error occurred while submitting the rating:', await response.text());
          }
      }
  },
    async mounted() {
      // Fetch user data from the API when the component is mounted
      const userResponse = await fetch(`http://localhost:5000/api/get/user/${this.user_id}`);
      if (userResponse.ok) {
        const userData = await userResponse.json();
        this.user = userData;  // Update the user data
      } else {
        console.log('An error occurred while fetching the user data');
      }
  
      // Fetch bookings data from the API
      const bookingsResponse = await fetch(`http://localhost:5000/api/get/bookings/${this.user_id}`);
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        this.bookings = bookingsData.bookings;  // Update the bookings data
      } else {
        console.log('An error occurred while fetching the bookings data');
      }
    },
    
  };
window.user_profile = user_profile;