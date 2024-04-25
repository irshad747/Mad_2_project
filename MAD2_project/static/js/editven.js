const Edit_venNavbar = window.ANavbar;
const EditVenue = {
  props : ["venue_id","admin_id"],
    template : `
    <div>
    <h1>Show buzz</h1>
    <h2><Edit_venNavbar :admin_id="admin_id"></Edit_venNavbar></h2>
    <form @submit.prevent="editVenue">
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" class="form-control" id="name" v-model="venueN" required>
        </div>
        <div class="form-group">
          <label for="Location">Location</label>
          <input type="text" class="form-control" id="Location" v-model="venueL" required>
        </div>
        <div class="form-group">
          <label for="Capacity">Capacity</label>
          <input type="text" class="form-control" id="Capacity" v-model="venueC" required>
        </div>
        
        <button type="submit" class="btn btn-primary">Edit Venue</button>
      </form>
  </div>
    `,
    components: {
      Edit_venNavbar// Include the Navbar component here
    },
    data(){
      return {
        venueN:"",
        venueL:"",
        venueC:"",
        venue_id: this.$route.params.venue_id
      }
    },
    methods: {
      async editVenue() {
        const response = await fetch(`http://localhost:5000/api/update/venues/${this.venue_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          },
          body: JSON.stringify({
            name: this.venueN,
            location: this.venueL,
            capacity: this.venueC
          })
        });
    
        if (response.ok) {
          alert('Venue updated successfully');
        } else {
          console.error('An error occurred while updating the venue:', await response.text());
        }
      }
    },
    
    
    
    created() {
      fetch(`http://localhost:5000/venues/${this.venue_id}`)
        .then(response => {
          if (!response.ok) throw new Error("Network response was not ok");
          return response.json();
        })
        .then(data => {
          this.venueN = data.venue.name;
          this.venueL = data.venue.location;
          this.venueC = data.venue.current_capacity;
        })
        .catch(error => {
          console.error("There has been a problem with your fetch operation:", error);
        });
    }

  };
window.EditVenue = EditVenue;