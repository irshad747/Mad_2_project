const AAAANavbar = window.ANavbar;
const AddShow = {
  props:["venue_id", "venue_name", "current_capacity","admin_id"],
    template : `
    <div>
      <header class="header">
        <h1>Show buzz</h1>
      </header>
      <AAAANavbar :admin_id="admin_id"></AAAANavbar>
      <form @submit.prevent="addShow">
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" class="form-control" id="name" placeholder="Enter name of the show" v-model="show.name" required>
        </div>
        <div class="form-group">
          <label for="Time">Time</label>
          <input type="text" class="form-control" id="Time" placeholder="Enter Time of the show" v-model="show.time" required>
        </div>
        <div class="form-group">
          <label for="Seats' Availability">Available Seats out of {{current_capacity}}</label>
          <input type="text" class="form-control" id="Seats" placeholder="Enter Number of seats available" v-model="show.available_seats" required>
        </div>
        <div class="form-group">
          <label for="Price">Price</label>
          <input type="text" class="form-control" id="price" placeholder="Enter price of the show" v-model="show.price" required>
        </div>
        <div class="form-group">
          <label for="Rating">Rating</label>
          <input type="text" class="form-control" id="Rating" placeholder="Enter ratings for the show" v-model="show.ratings" required>
        </div>
        <div class="form-group">
          <label for="Tag">Tag</label>
          <input type="text" class="form-control" id="Tag" placeholder="Enter Tag of the show" v-model="show.tags" required>
        </div>
        <div class="form-group">
          <label for="Date">Date</label>
          <input type="date" class="form-control" id="date" placeholder="Enter date of the show" v-model="show.date" required>
        </div>
        <div class="form-group">
          <label for="Description">Description</label>
          <input type="text" class="form-control" id="Tag" placeholder="Enter Description of the show" v-model="show.description" required>
        </div>
        <div class="form-group">
          <label for="name">Snopsis</label>
          <input type="text" class="form-control" id="name" placeholder="Enter Synopsis of the show" v-model="show.synopsis" required>
        </div>
        
        <button type="submit" class="btn btn-primary">Add Show</button>
      </form>
    </div>
    
    `,
    components: {
      AAAANavbar
    },
    data() {
      return {
        show: {
          name: '',
          time: '',
          venue_name: this.venue_name,
          available_seats: '',
          ratings: '',
          tags: '',
          price: '',
          date: '',
          synopsis: '',
          description: '',
          seats_left: this.$route.params.seats_left,
          venue_id: this.$route.params.venue_id
        },
      };
    },
    methods: {
      async addShow() {
        const response = await fetch('http://localhost:5000/api/add/show', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')

          },
          body: JSON.stringify(this.show)
        });
    
        if (response.ok) {
          alert('Show added successfully');
        } else {
          console.error('An error occurred while adding the show:', await response.text());
        }
      }
    }
  };
window.AddShow = AddShow;