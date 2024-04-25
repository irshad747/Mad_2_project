const searchResult = {
    props: ['showQuery', 'venueLocation', 'ShowTags', 'user_id'],
    template: `
      <div class="container">
    <h1 class="text-center my-4">Search Results</h1>
    <li class="nav-item active">
      <router-link class="nav-link btn btn-info" :to="{ name: 'user_dashboard', params: { user_id: user_id } }">Home</router-link>
    </li>
    <div v-if="showResults.length > 0">
      <h2 class="text-center my-4">Shows</h2>
      <div v-for="show in showResults" class="card mb-3">
        <div class="card-body">
          <h5 class="card-title">{{ show["name"] }}</h5>
          <p class="card-text">{{ show["Description"] }}</p>
          <p class="card-text">{{ show["Synopsis"] }}</p>
          <p class="card-text"><strong>Rating: </strong>{{ show["rating"] }}</p>
          <p class="card-text"><strong>Tags: </strong>{{ show["tag"] }}</p>
          <button @click="Booktick(show.id)" class="btn btn-primary">Book</button>
        </div>
      </div>
    </div>

    <div v-if="venueResults.length > 0">
      <h2 class="text-center my-4">Venues</h2>
      <div v-for="venue in venueResults" class="card mb-3">
        <div class="card-body">
          <h2 class="card-title">{{ venue.name }}</h2>
          <p class="card-text">{{ venue.location }}</p>
          <button @click="book(venue.id)" class="btn btn-success">Book</button>
        </div>
      </div>
    </div>

    <div v-if="showResults.length === 0 && venueResults.length === 0">
      <p class="text-center my-4">No results found.</p>
    </div>
  </div>

    `,
    components: {
      Navbar,
    },
    data() {
      return {
        showResults: [],
        venueResults: [],
        // any other necessary data
      };
    },
    methods: {
      Booktick(showId){
        const userId = this.$route.params.user_id;
        this.$router.push(`/venues/${showId}/${userId}`);
        // Your show booking logic here
      },
      book(venueId) {
        // Your venue booking logic here
        this.$router.push({ 
            name: 'ShowsForVen', 
            params: { user_id: this.user_id, venue_id: venueId } 
          })
      }
    },
    async created() {
        // Make an API call to search for shows
        if (this.showQuery || this.ShowTags) {
          const response = await fetch(`http://localhost:5000/api/search/shows?query=${this.showQuery}&tags=${this.ShowTags}`);
          if (response.ok) {
            const data = await response.json();
            this.showResults = data.shows; // Update the shows data
          } else {
            console.error('An error occurred while fetching the shows data');
          }
        }
      
        // Make an API call to search for venues
        if (this.venueLocation) {
          const response = await fetch(`http://localhost:5000/api/search/venues?location=${this.venueLocation}`);
          if (response.ok) {
            const data = await response.json();
            this.venueResults = data.venues; // Update the venues data
          } else {
            console.error('An error occurred while fetching the venues data');
          }
        }
      }
      
  };
window.searchResult = searchResult;
  