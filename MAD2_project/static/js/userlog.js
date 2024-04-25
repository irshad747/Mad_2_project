const UserComponent = {
    template: `
    <!--<div style="justify-content:center ; text-align:center">
    <h1> User Login Page </h1>
    </div>
  
          <div>
            <label>Email:</label>
            <input type="email"  v-model="email" required /><br><br><br><br>
          </div>
          <div>
            <label>Password:</label>
            <input type="password"  v-model="pass" required /><br><br><br><br>
          </div>
          
          <div style="justify-content:center">
            <button @click="userlog"> Login </button>
          </div>
        
          <router-link to="/user/register" class="button">New User?</router-link>-->
          <div class="d-flex justify-content-center align-items-center vh-100">
        <div class="card text-center" style="width: 25rem;">
            <div class="card-body">
                <h1 class="card-title text-primary"> User Login Page </h1>
                <div class="mb-3">
                    <label class="form-label">Email:</label>
                    <input type="email" class="form-control" v-model="email" required />
                </div>
                <div class="mb-3">
                    <label class="form-label">Password:</label>
                    <input type="password" class="form-control" v-model="pass" required />
                </div>
                <div class="d-grid mb-3">
                    <button class="btn btn-primary" @click="userlog"> Login </button>
                </div>
                <router-link to="/user/register" class="btn btn-outline-primary">New User?</router-link>
                <router-link to="/Admin" class="btn btn-outline-primary">Begin as an admin</router-link>
            </div>
        </div>
    </div>

    `,
    data() {
      return {
        email:"",
        pass:"",
        cred:false
      }
    },

    methods:{
      userlog:function(){
        fetch('http://localhost:5000/user/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: this.email,
            password: this.pass
          })
        })
        .then(response => {
          if (!response.ok) throw new Error('Network response was not ok');
          return response.json();
        })
        .then(data => {
          localStorage.setItem('token', data.access_token);
          this.cred = true;
          this.user_dash_comp(data.userId);
        })
        .catch(error => {
          console.log(error);
          alert("credentials are incorrect");
        });
      },
      user_dash_comp:function(user_id){
        if (this.cred){
          this.$router.push(`/User/${user_id}/dashboard`);
        }
      }
    },
   
    
    /*methods:{
      userlog:function(){
        
        if(this.email=="irshadsareshwala@gmail.com" && this.pass=="aaliyaabrar"){
          this.cred=true;
          this.user_dash_comp(1)
        }
        else{
         alert("credentials are incorrect")
        }
      },
      user_dash_comp:function(user_id){
        if (this.cred){
          this.$router.push(`/User/${user_id}/dashboard`);
  
        }
        
      }
  
    },*/
   
  };
window.UserComponent = UserComponent;
