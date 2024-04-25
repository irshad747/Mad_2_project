// Venuecard
const venuecard = {
  props: ['venue','admin_id'],
    template :`<!--<div class="col-md-4">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">{{ venue.name }}</h5>
        <p class="card-text">{{ venue.location }}</p>
        <h6 class="card-subtitle mb-2 text-muted">Shows:</h6>
        <showcard v-for="show in venue.shows" :key="show.id" :show="show" :admin_id="admin_id" @show-deleted="emitShowDeletion" />
        <router-link :to="{name: 'add_show', params: {venue_id: venue.id, admin_id: admin_id}}" class="btn btn-secondary">Add Show</router-link>
        <router-link :to="{name: 'edit_venue', params: {venue_id: venue.id, admin_id: admin_id}}" class="btn btn-primary">Edit_v</router-link>
        <router-link :to="{name: 'delete_venue_confirmation', params: {venue_id: venue.id, admin_id: admin_id}}" class="btn btn-danger">Delete_v</router-link>
        <button @click="deleteVenue">Delete Venue</button>
        <button @click="exportVenue">Export Venue</button>

      </div>
    </div>
  </div>-->
  <div class="card mb-4" style="background-color: #E0DEFF; color: #6C63FF;">
  <div class="card-body">
    <h5 class="card-title">{{ venue.name }}</h5>
    <p class="card-text">{{ venue.location }}</p>
    <h6 class="card-subtitle mb-2">Shows:</h6>
    <showcard v-for="show in venue.shows" :key="show.id" :show="show" :admin_id="admin_id" @show-deleted="emitShowDeletion" />
    <div class="d-flex justify-content-between mt-3">
      <router-link :to="{name: 'add_show', params: {venue_id: venue.id, admin_id: admin_id, current_capacity:venue.current_capacity}}" class="btn btn-secondary" style="background-color: #A28FD0; border-color: #A28FD0;">Add Show</router-link>
      <router-link :to="{name: 'edit_venue', params: {venue_id: venue.id, admin_id: admin_id}}" class="btn btn-primary" style="background-color: #6C63FF; border-color: #6C63FF;">Edit Venue</router-link>
      <button @click="deleteVenue" class="btn btn-danger" style="background-color: #6C63FF; border-color: #6C63FF;">Delete Venue</button>
      <button @click="exportVenue" class="btn btn-info" style="background-color: #6C63FF; border-color: #6C63FF;">Export Venue</button>
    </div>
  </div>
</div>

    `,

    components: {
      showcard
    },
    methods: {
      async deleteVenue() {
        if (confirm('Are you sure you want to delete this venue? This will also delete all shows associated with this venue.')) {
          const token = localStorage.getItem('token');
          const response = await fetch(`http://localhost:5000/api/venue/${this.venue.id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
    
          if (response.ok) {
            alert('Venue deleted successfully');
            this.$emit('venue-deleted', this.venue.id);
            // Refresh the page or redirect the user here
          } else {
            console.error('An error occurred while deleting the venue:', await response.text());
          }
        }
      },
      emitShowDeletion(showId) {
        this.$emit('show-deleted', { venueId: this.venue.id, showId });
      },
      async exportVenue() {
        const response = await fetch(`http://localhost:5000/api/venue/${this.venue.id}/export`, {
          method: 'POST',
        });
  
        if (response.ok) {
          alert('Export task started successfully');
        } else {
          console.error('An error occurred while starting the export task:', await response.text());
        }
      },
    }
    
  };
window.venuecard = venuecard;