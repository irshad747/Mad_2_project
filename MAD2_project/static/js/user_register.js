const UserRegister= {
    template: `
    <!--<div style="justify-content:center ; text-align:center">
        <h1> User Registration Page </h1>
        <div>
            <label>Email:</label>
            <input type="email"  v-model="email" required /><br><br><br><br>
        </div>
        <div>
            <label>Password:</label>
            <input type="password"  v-model="password" required /><br><br><br><br>
        </div>
        <div style="justify-content:center">
            <button @click="registerUser"> Register </button>
        </div>
    </div>-->
    <div class="d-flex justify-content-center align-items-center vh-100">
        <div class="card text-center" style="width: 25rem;">
            <div class="card-body">
                <h1 class="card-title text-primary"> User Registration Page </h1>
                <div class="mb-3">
                    <label class="form-label">Email:</label>
                    <input type="email" class="form-control" v-model="email" required />
                </div>
                <div class="mb-3">
                    <label class="form-label">Password:</label>
                    <input type="password" class="form-control" v-model="password" required />
                </div>
                <div class="d-grid">
                    <button class="btn btn-primary" @click="registerUser"> Register </button>
                </div>
            </div>
        </div>
    </div>
    `,
    data() {
      return {
        email:"",
        password:"",
      }
    },
    methods: {
        registerUser: function() {
            fetch('http://localhost:5000/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: this.email,
                    password: this.password
                }),
            })
            .then(response => response.json())
            .then(data => {
                if(data.msg === "User created") {
                    alert("User registered successfully");
                    // Here you can redirect to login page or any other page you want
                    this.$router.push('/User');
                }
                else {
                    alert(data.msg);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }
    }
};
window.UserRegister = UserRegister;
