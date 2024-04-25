const Navbar = {
    props:["user_id"],
    template: `
    <!--<nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container">
        <a class="navbar-brand" href="#">{{user_id}}</a>
        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
  
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item active">
            <router-link class="nav-link hover-effect" :to="{ name: 'user_dashboard', params: { user_id: user_id } }">Home</router-link>
            </li>
            <li class="nav-item">
            <router-link class="nav-link hover-effect" :to="{ name: 'list_ven', params: { user_id: user_id } }">Cinemas</router-link> 
            </li>
            <li class="nav-item">
            <router-link class="nav-link hover-effect" :to="{ name: 'user_profile', params: { user_id: user_id } }">Orders</router-link>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Contact</a>
            </li>
          </ul>
          <form class="form-inline my-2 my-lg-0">
            <input
              class="form-control mr-sm-2"
              type="search"
              placeholder="Search Tags"
              aria-label="Search Tags"
              v-model="searchShowTags"
            >
            <input
              class="form-control mr-sm-2"
              type="search"
              placeholder="Search Shows"
              aria-label="Search Shows"
              v-model="searchShowQuery"
            >
            <input
              class="form-control mr-sm-2"
              type="search"
              placeholder="Search Location"
              aria-label="Search Location"
              v-model="searchVenueLocation"
            >
            <button class="btn btn-outline-success my-2 my-sm-0" @click.prevent="submitSearch">Search</button>
          </form>
          <button class="btn btn-outline-danger my-2 my-sm-0" @click="logout">Logout</button>
        </div>
      </div>
    </nav>-->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        
        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
  
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item active">
            <router-link class="nav-link" :to="{ name: 'user_dashboard', params: { user_id: user_id } }">Home</router-link>
            </li>
            <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'list_ven', params: { user_id: user_id } }">Cinemas</router-link> 
            </li>
            <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'user_profile', params: { user_id: user_id } }">Orders</router-link>
            </li>
          </ul>
          <form class="form-inline my-2 my-lg-0">
            <input
              class="form-control mr-sm-2"
              type="search"
              placeholder="Search Tags"
              aria-label="Search Tags"
              v-model="searchShowTags"
            >
            <input
              class="form-control mr-sm-2"
              type="search"
              placeholder="Search Shows"
              aria-label="Search Shows"
              v-model="searchShowQuery"
            >
            <input
              class="form-control mr-sm-2"
              type="search"
              placeholder="Search Location"
              aria-label="Search Location"
              v-model="searchVenueLocation"
            >
            <button class="btn btn-outline-light my-2 my-sm-0 hover-effect" @click.prevent="submitSearch">Search</button>
          </form>
          <button class="btn btn-outline-danger my-2 my-sm-0 hover-effect" @click="logout">Logout</button>
        </div>
      </div>
    </nav>
    `,
    data() {
      return {
        searchShowTags: "",
        searchVenueLocation: "",
        searchShowQuery:""
      };
    },
    methods: {
      submitSearch() {
        this.$router.push({
          name: 'searchResult',
          params: {
            showQuery: this.searchShowQuery || 'defaultShowQuery',
            venueLocation: this.searchVenueLocation || 'defaultShowQuery',
            ShowTags: this.searchShowTags || 'defaultShowQuery',
            user_id: this.user_id

          },
        });
      },
      logout: function() {
        // Remove the token from localStorage
        localStorage.removeItem('token');
        // Redirect the user to the login page, or somewhere else
        this.$router.push('/User');
      },
      navigateToOrders() {
        if (localStorage.getItem('token')) {
          this.$router.push({ name: 'user_profile', params: { user_id: user_id } });
        } else {
          alert('Please log in first.');
        }
      },
    },
    
  };
  window.Navbar = Navbar;