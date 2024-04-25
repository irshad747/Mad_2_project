const AAANavbar = window.ANavbar;
const AddVenue = {
  props:["admin_id"],
    template : `
    <div>
    <header class="header">
      <h1>Show buzz</h1>
    </header>
    <h2><AAANavbar :admin_id="admin_id"></AAANavbar></h2>
    <form @submit.prevent="addVenue">
      <div class="form-group">
        <label for="name">Name</label>
        <input type="text" class="form-control" id="name" placeholder="Name of the venue" v-model="venue.name" required>
      </div>
      <div class="form-group">
        <label for="location">Location</label>
        <input type="text" class="form-control" id="location" placeholder="Address" v-model="venue.location" required>
      </div>
      <div class="form-group">
        <label for="Capacity">Capacity</label>
        <input type="text" class="form-control" id="Capacity" placeholder="Capacity" v-model="venue.capacity" required>
      </div>
      <button type="submit" class="btn btn-primary">Add Venue</button>
    </form>
  </div>
    `,
    components: {
      AAANavbar// Include the Navbar component here
    },
    data() {
      return {
        venue: {
          name: '',
          location: '',
          capacity: '',
        }
      };
    },
    methods: {
      async addVenue() {
        const response = await fetch('http://localhost:5000/api/add/venues', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          },
          body: JSON.stringify({
            name: this.venue.name,
            location: this.venue.location,
            capacity: this.venue.capacity
          })
        });
    
        if (response.ok) {
          alert('Venue added successfully');
          const adminId = this.$route.params.admin_id;
          this.$router.push(`/Admin/${adminId}/dashboard`);
        } else {
          console.error('An error occurred while adding the venue:', await response.text());
        }
      }
    }
    
  
      
    

  };
window.AddVenue = AddVenue;