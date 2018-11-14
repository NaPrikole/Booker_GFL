<template>
  <div class='container'>
    <div class='title'>
      <h1>{{msg}}</h1>
    </div>
    <div class='row top-buffer' style='align: center'>
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
            <input type='username' class='form-control' placeholder='Enter username' id='usernameInput' v-model='username'>
          </div>
          <div class='form-group'>
            <label for='pass'>Password</label>
            <input type='password' class='form-control' id='pass' placeholder='Password' v-model='password'>
          </div>
          <button type='submit' class='btn btn-info col-6'>Enter</button>
        </form>
      </div>
    </div>
  </div>
</template>
<style>
  .ul {
  box-shadow: 
   inset rgba(0,0,0,.6) 0 -3px 8px,
   inset rgba(252,255,255,.7) 0 3px 8px,
   rgba(0,0,0,.8) 0 3px 8px -3px;
  border-radius: 7px;
  list-style-type: none;
  padding: 5px 0;
  color: #000;
  font-weight: 600;
  font-style: italic;
  }
  .italic {
    font-style: italic;
    color: #990000;
    font-family: monospace;
    font-style: italic;
    font-size: 15px;
  }
  .form-group {
    box-shadow: 
      inset rgba(0,0,0,.6) 0 -3px 8px,
      inset rgba(252,255,255,.7) 0 3px 8px,
      rgba(0,0,0,.8) 0 3px 8px -3px;
    border-radius: 7px;
    padding-top: 4px;
    background-color: lightblue;
    color: #000;
    font-weight: 600;
    font-family: monospace;
    font-style: italic;
    font-size: 15px;
  }
  .form-group input {
    border: 2px solid #0099cc;
  }
  .btn-info {
    border-radius: 7px;
    border: 2px solid color #0099cc;
    background-color: lightseagreen;
    box-shadow: 
      inset rgba(0,0,0,.6) 0 -3px 8px,
      inset rgba(252,255,255,.7) 0 3px 8px,
      rgba(0,0,0,.8) 0 3px 8px -3px;
    color: #000;
    font-weight: 600;
    font-family: monospace;
    font-style: italic;
    font-size: 15px;
  }
</style>
<script>
import VueButtonSpinner from 'vue-button-spinner';
import {AUTH_REQUEST} from '../store/actions/auth'
export default {
  name: 'login',
  data () {
    return {
      msg: '',
      password: null,
      username: null,
      errors: [],
    }
  },
  methods: {
    checkForm: function () {
      if (this.username && this.password) {
        this.login()
      }
      this.errors = []
      if (!this.username) {
        this.errors.push('Username is required.')
      }
      if (!this.password) {
        this.errors.push('Password is required.')
      }
    },
    login: function () {
      const { username, password } = this
      this.$store.dispatch(AUTH_REQUEST, { username, password })
        .then(() => {
          this.$router.push('/')
        })
        .catch((err) => {
          this.$router.push({
              name: 'loginError', 
              params: { msg: 'Something went wrong :)' } 
          })
        })
    },
  }
}
</script>
