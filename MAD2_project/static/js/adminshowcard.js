// Admin dashboard showcard
const showcard = {
    props: ['show',"admin_id"],
    template : `<div class="card mb-2">
    <div class="card-body">
      <h6 class="card-title">Show Name: {{ show.name }}</h6>
      <p class="card-text">Show Time: {{ show.time }}</p>
      <p class="card-text">Show Date: {{ show.Date }}</p>
      <p class="card-text">Alloted Seats: {{ show.available_seats }}</p>
      <!-- Add other properties if needed -->
      <router-link :to="{name: 'edit_show', params: {show_id: show.id, admin_id: admin_id}}" class="btn btn-primary">Edit</router-link>
      <!--<router-link :to="{name: 'delete_show_confirmation', params: {show_id: show.id}}" class="btn btn-danger">Delete</router-link>-->
      <button @click="deleteShow" class="btn btn-danger">Delete</button>
    </div>
  </div>
    `,
    methods: {
      async deleteShow() {
        if (confirm('Are you sure you want to delete this show?')) {
          const token = localStorage.getItem('token');
          const response = await fetch(`http://localhost:5000/api/show/delete/${this.show.id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            alert('Show deleted successfully');
            // Notify the parent component to remove this show from its list.
            this.$emit('show-deleted', this.show.id);
          } else {
            console.error('An error occurred while deleting the show:', await response.text());
          }
        }
      },
    }

  };
window.showcard = showcard;