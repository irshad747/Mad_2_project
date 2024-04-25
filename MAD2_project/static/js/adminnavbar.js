// Admin Side Navbar
const ANavbar = {
    props:["admin_id"],
    template: `
    <!--<nav class="navbar navbar-expand-lg navbar-light bg-light">
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
            <router-link class="nav-link" to="/Admin">Home</router-link>
            </li>
            <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'add_venue', params: { admin_id: admin_id } }">Add Venue</router-link>
            </li>
            <li class="nav-item">
            <router-link class="nav-link" to="/orders">Show Statistics</router-link>
            </li>
          </ul>
          
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
          <router-link class="nav-link" :to="{ name: 'admin_dashComponent', params: { admin_id: admin_id } }">Home</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" :to="{ name: 'add_venue', params: { admin_id: admin_id } }">Add Venue</router-link>
        </li>
        <li class="nav-item">
          <!--<router-link class="nav-link" to="/orders">Show Statistics</router-link>-->
        </li>
        
        <button class="btn btn-outline-danger my-2 my-sm-0 hover-effect" @click="logout">Logout</button>
      </ul>
    </div>
  </div>
</nav>

    `,
    methods:{
      logout: function() {
        // Remove the token from localStorage
        localStorage.removeItem('token');
        // Redirect the user to the login page, or somewhere else
        this.$router.push('/Admin');
      },
    }
  };
window.ANavbar =  ANavbar;