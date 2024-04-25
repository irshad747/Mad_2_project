const Edit_ShowNavbar = window.ANavbar;
const EditShowComponent= {
  props:["admin_id","show_id"],
    template : `
    <div>
    <h1>Show buzz Hello</h1>
    <h2><Edit_ShowNavbar :admin_id="admin_id"></Edit_ShowNavbar></h2>
    <form @submit.prevent="editShow">
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" class="form-control" id="name" v-model="showN" required>
        </div>
        <div class="form-group">
          <label for="Time">Time</label>
          <input type="text" class="form-control" id="Time" v-model="showT" required>
        </div>
        <div class="form-group">
          <label for="venue id">Venue ID</label>
          <input type="text" class="form-control" id="venue ID" v-model="venueI" disabled>
        </div>
        <div class="form-group">
          <label for="Venue_name">Venue Name</label>
          <input type="text" class="form-control" id="venue_name" v-model="venueN" required>
        </div>
        <div class="form-group">
          <label for="Available_seats">Available Seats</label>
          <input type="text" class="form-control" id="Available_seats" v-model="showAS" required>
        </div>
        <div class="form-group">
          <label for="Ratings">Ratings</label>
          <input type="text" class="form-control" id="Ratings" v-model="showR" required>
        </div>
        <div class="form-group">
          <label for="Tags">Tags</label>
          <input type="text" class="form-control" id="Tags" v-model="showTag" required>
        </div>
        <div class="form-group">
          <label for="price">Price (in Rs)</label>
          <input type="text" class="form-control" id="price" v-model="showP" required>
        </div>
        <div class="form-group">
          <label for="Date">Date</label>
          <input type="date" class="form-control" id="Date" v-model="showD" required>
        </div>
        <div class="form-group">
          <label for="Synopsis">Synopsis</label>
          <input type="text" class="form-control" id="Synopsis" v-model="showS" required>
        </div>
        <div class="form-group">
          <label for="Description">Description</label>
          <input type="text" class="form-control" id="Description" v-model="showDesc" required>
        </div>
        
        <button type="submit" class="btn btn-primary">Edit Show</button>
      </form>

    </div>
    `,
    components: {
      Edit_ShowNavbar// Include the Navbar component here
    },
    data(){
      return {
        showN: "",
        showT: "",
        venueN: "",
        showAS: "",
        showR: "",
        showTag: "",
        showP: "",
        showD: "",
        showS: "",
        showDesc: "",
        venueI: "",
        show_id: this.$route.params.show_id,
      }
    },
    methods: {
      async editShow() {
        const response = await fetch(`http://localhost:5000/api/show/update/${this.show_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          },
          body: JSON.stringify({
            name: this.showN,
            Time: this.showT,
            venue_id: this.venueI,  
            Available_seats: this.showAS,
            Ratings: this.showR,
            Tags: this.showTag,
            price: this.showP,
            Date: this.showD,
            Synopsis: this.showS,
            Description: this.showDesc
          })
        });

        // Check if the request was successful
        if (response.ok) {
          alert('Show updated successfully');
        } else {
          console.error('An error occurred while updating the show:', await response.text());
        }
      }
    },
    created() {
      fetch(`http://localhost:5000/shows/${this.show_id}`)
          .then(response => {
              if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
          })
          .then(json => {
              let showData = json.show;
              this.showN = showData.name;
              this.showT = showData.time;
              this.venueN = showData.venue.name;
              this.showAS = showData.available_seats;
              this.showR = showData.rating;
              this.showTag = showData.tag;
              this.showP = showData.price;
              this.showD = showData.Date;
              this.showS = showData.Synopsis;
              this.showDesc = showData.Description;
              this.venueI = showData.venue_id
          })
          .catch(e => {
              console.error('There was a problem with the fetch operation: ' + e.message);
          });
  }
  };
window.EditShowComponent = EditShowComponent;