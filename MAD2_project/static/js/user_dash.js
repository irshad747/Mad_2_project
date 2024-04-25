//user_dashboard component
const user_dashComponent = {
    props:["user_id"],
    template: `
    <!--<div v-if="error">
  <p>Error: {{ error }}</p>
   </div>
    <div v-else>
    <h1>Show Buzz</h1>
    <h2> For user {{user_id}}</h2>
    <Navbar :user_id="user_id"></Navbar>
    <div class="container">
      <h2>Current and Upcoming Movies from {{ specific_date }}</h2>
      <div v-for="show in shows"><br><br><br>
              <h5 >{{ show["name"] }}</h5>
              <p >{{ show["Description"] }}</p>
              <p >{{ show["Synopsis"] }}</p>
              <p ><strong>Rating: </strong>{{ show["rating"] }}</p>
              <p ><strong>Tags: </strong>{{ show["tag"] }}</p>
              <button @click="Booktick(show['id'])">Book</button>
            </div>
  
      
      </div></div>-->
      <div class="container">
        <div v-if="error" class="alert alert-danger">
            <p>Error: {{ error }}</p>
        </div>
        <div v-else>
            <h1 class="text-primary">Show Buzz</h1>
            <Navbar :user_id="user_id"></Navbar>
            <h2 class="text-primary">Current and Upcoming Movies from {{ specific_date }}</h2>
            <div v-for="show in shows" class="card mb-3">
                <div class="card-body">
                    <h5 class="card-title">{{ show["name"] }}</h5>
                    <p class="card-text">{{ show["Description"] }}</p>
                    <p class="card-text">{{ show["Synopsis"] }}</p>
                    <p class="card-text"><strong>Rating: </strong>{{ show["rating"] }}</p>
                    <p class="card-text"><strong>Tags: </strong>{{ show["tag"] }}</p>
                    <button class="btn btn-primary" @click="Booktick(show['id'])">Book</button>
                </div>
            </div>
        </div>
    </div>
      
  
    `,
    components: {
      Navbar, // Include the Navbar component here
    },
    data() {
      return {
        specific_date: "2025-06-17",
        shows: [
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
        ],
        error:null,
      };
    },
    methods: {
      Booktick: function(showId){
        const userId = this.$route.params.user_id;
        this.$router.push(`/venues/${showId}/${userId}`);
      }
      
    },
    async created() {
      try {
        const response = await fetch(`http://localhost:5000/shows/${this.specific_date}`);
        if (!response.ok) {
          throw new Error('Failed to fetch shows');
        }
        const data = await response.json();
        this.shows = data.shows;
      } catch (error) {
        this.error = error.message;
      }
    }
  };
window.user_dashComponent = user_dashComponent;