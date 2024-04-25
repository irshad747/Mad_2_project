const AdminComponent = {
    template: `
    <!--<div style="justify-content:center ; text-align:center">
      <h1> Admin Login Page </h1>
      </div>
    
            <div>
              <label>Username:</label>
              <input type="text" name="Admin" v-model="username" required /><br><br><br><br>
            </div>
            <div>
              <label>Password:</label>
              <input type="text" name="passcode" v-model="password" required /><br><br><br><br>
            </div>
            <div style="justify-content:center">
            <button @click="adminlog"> Login </button>
          </div>
            
            </div>-->
            <div class="d-flex justify-content-center align-items-center vh-100">
            <div class="card text-center" style="width: 25rem;">
                <div class="card-body">
                    <h1 class="card-title text-primary">Admin Login Page</h1>
                    <div class="mb-3">
                        <label class="form-label">Username:</label>
                        <input type="text" class="form-control" v-model="username" required />
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Password:</label>
                        <input type="password" class="form-control" v-model="password" required />
                    </div>
                    <div class="d-grid mb-3">
                        <button class="btn btn-primary" @click="adminlog"> Login </button>
                    </div>
                    <router-link to="/User" class="btn btn-outline-primary">User Login</router-link>
                </div>
                
            </div>
        </div>
        

        
    `,
    data() {
      return {
        username:"",
        password:"",
      }
    },
    methods:{
      adminlog: function(){
        /*if(this.username=="Irshad" && this.password=="aaliyaabrar"){
          this.cred=true;
          this.admin_dash_comp(1)
        }
        else{
          alert("credentials are incorrect")
        }*/
        fetch('http://localhost:5000/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: this.username,
          password: this.password
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.access_token) {
          localStorage.setItem('token', data.access_token);
          this.cred = true;
          this.admin_dash_comp(1);
        } else {
          alert("credentials are incorrect")
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
      },
      admin_dash_comp:function(admin_id){
        if (this.cred){
          this.$router.push(`/Admin/${admin_id}/dashboard`);
  
        }
        
      }
  
    }
  };
window.AdminComponent = AdminComponent