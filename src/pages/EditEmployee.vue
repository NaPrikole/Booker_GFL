<template>
  <div class='container'>
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
          <button type='submit' class='btn btn-info col-12' style='margin-top:30px;'>Save</button>
        </form>
      </div>
    </div>
  </div>
</template>
<style>
select {
  margin-right: 5px;
}
</style>

<script>
import axios from 'axios'
export default {
  name: 'editEmployee',
  data () {
    return {
      msg: '',
      id: null,
      username: '',
      fullname: '',
      email: '',
      password: '',
      selectedAdminRights: null,
      users: [],
      errors: [],
    }
  },
  created: function () {
    this.getEmployee(this.$route.params.id)
  },
  methods: {
    getEmployee: function (id) {
      fetch('/api/users/' + id)
        .then(response => {
          if (response.ok) {
            return response.json()
          }
          throw new Error('Network response was not ok')
        })
        .then(json => {
          json.forEach(item => {
            this.users.push({
              id: item.id,
              username: item.username,
              fullname: item.fullname,
              email: item.email,
              password: item.password,
              admin: item.admin
            })
          })
        this.fillInInputs()
        })
        .catch(error => {
          this.message = error
        })
    },
    fillInInputs: function () {
      this.users.forEach(item => {
        this.id = item.id,
        this.username = item.username,
        this.fullname = item.fullname,
        this.email = item.email,
        this.selectedAdminRights = item.admin
      })
    },
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
      axios.put('/api/users/' + this.id, data, { headers: headers })
        .then(res => {
          this.$router.push({name: 'loginError', params: {msg: 'User edited'}})
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
