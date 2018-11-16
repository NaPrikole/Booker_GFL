<template>
  <div>
    <div class='title'>
      <h1>{{msg}}</h1>
    </div>
    <div class='row top-buffer'>
      <div class='col-sm-3'></div>
      <div class='col-sm-6'>
        <form v-on:submit.prevent='checkForm' method='post'>
          <p v-if="errors.length">
            <b class="italic">Please fill the fields below:</b>
            <ul class="ul">
              <li v-for="error in errors" v-bind:key='error.id'>{{ error }}</li>
            </ul>
          </p>
          <div class='form-group'>
            <label for='usernameInput'>Username</label>
            <input type='username' class='form-control' placeholder='Enter username'
              id='usernameInput' v-model='username'>
          </div>
          <div class='form-group'>
            <label for='fullnameInput'>Full Name</label>
            <input type='text' class='form-control' placeholder='Enter full name' id='fullnameInput'
              v-model='fullname'>
          </div>
          <div class='form-group'>
            <label for='email'>Email</label>
            <input type='email' class='form-control' id='email' placeholder='Email' v-model='email'>
          </div>
          <div class='form-group'>
            <label for='pass'>Password</label>
            <input type='password' class='form-control' id='pass' placeholder='Password' v-model='password'>
          </div>
          <button type='submit' class='btn btn-info col-6'>Add Employee</button>
        </form>
      </div>
    </div>
  </div>
</template>
<style>
  .form-group {
    text-align: center;
  }
  .ul {
    text-align: center;
  }
</style>

<script>
import {AUTH_REQUEST} from '../store/actions/auth'
import axios from 'axios'
export default {
  name: 'newEmployee',
  data () {
    return {
      msg: '',
      username: '',
      fullname: '',
      email: '',
      password: '',
      selectedAdminRights: null,
      errors: [],
    }
  },
  created: function () {
  },
  methods: {
    checkForm: function () {
      if (this.fullname && this.email && this.username && this.password) {
        this.submitForm()
      }
      this.errors = []
      if (!this.fullname) {
        this.errors.push('Full Name is required.')
      }
      if (!this.email) {
        this.errors.push('Email is required.')
      }
      if (!this.username) {
        this.errors.push('Username is required.')
      }
      if (!this.password) {
        this.errors.push('Password is required.')
      }
    },
    submitForm: function () {
      let data = { fullname: this.fullname, email: this.email, username: this.username, password: this.password, admin: this.selectedAdminRights || false }
      let headers = {
            'Content-Type': 'application/json',
            'Authorization': this.$store.state.auth.token
        }
      axios.post('/api/users/register', data, { headers: headers })
          .then(res => {
			this.$router.push({name: 'employee'})
        })
         
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
