<template>
  <div id="app">
    <div class="header">BOOKER</div>
    <nav class='navbar navbar-light bg-none'>
      <div class='container center'>
        <router-link to='/' class='nav-link-home'>HOME</router-link>
			  <ul class='nav justify-content-end'>
				  <li v-if="!isAuthenticated && !authLoading">
            <router-link to='/login' class='nav-link-sn'>SIGN IN</router-link>
          </li>
          <li class='nav-item'>
            <a href="#" class='nav-link-sn' v-if="isAuthenticated" @click="logout">LOG OUT</a>
          </li>
        </ul>
      </div>
		</nav>
    <router-view class='container shadow'></router-view>
    <div class="admin-crids">
      <p>Enter as Admin:</p>
      <p>Username: Vladimir</p>
      <p>Password: 777</p>
    </div>
    <div class="user-crids">
      <p>Enter as User:</p>
      <p>Username: Ann</p>
      <p>Password: 777</p>
    </div>
    <div class="footer"><span class="left">Created by Vladimir Ponomarenko </span><span class="center"> 2018 </span><span class="right"> GFL</span></div>
  </div>
</template>

<style>
#app {
  font-family: 'Times New Roman', Times;
  text-align: center;
  color: #09f;
  background-color: #222;
  background-size: cover;
  height: 100vh;
  position: relative;
}
.header {
  width: 100%;
  padding: 15px 0;
  background-color: #0099cc;
  color: #003300;
  font-weight: 600;
  font-style: italic;
  font-size: 22px;
  position: relative;
  text-shadow: 8px 9px 10px #000;
  box-shadow: 
   inset rgba(0,0,0,.6) 0 -3px 8px,
   inset rgba(252,255,255,.7) 0 3px 8px,
   rgba(0,0,0,.8) 0 3px 8px -3px;
}
.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 20px 0;
  background-color: #0099cc;
  color: #003300;
  font-weight: 600;
  font-style: italic;
  box-shadow:
   inset rgba(0,0,0,.6) 0 -3px 8px,
   inset rgba(252,255,255,.7) 0 3px 8px,
   rgba(0,0,0,.8) 0 3px 8px -3px;
}
.nav-link-home {
  font-size: 18px;
  border: 2px solid orange;
  border-radius: 7px;
  background-color: #333;
  position: absolute;
  top: -54px;
  left: 5px;
  padding: 5px 20px;
  color: lightskyblue;
  box-shadow:
   inset rgba(0,0,0,.6) 0 -3px 8px,
   inset rgba(252,255,255,.7) 0 3px 8px,
   rgba(0,0,0,.8) 0 3px 8px -3px;
}
.nav-link-sn {
  font-size: 18px;
  border: 2px solid orange;
  border-radius: 7px;
  background-color: #333;
  position: absolute;
  top: -54px;
  right: 5px;
  padding: 5px 20px;
  color: lightskyblue;
  box-shadow:
   inset rgba(0,0,0,.6) 0 -3px 8px,
   inset rgba(252,255,255,.7) 0 3px 8px,
   rgba(0,0,0,.8) 0 3px 8px -3px;
}
.container.shadow{
	color: #fff;
	padding: 20px;
	background: lightslategray;
	border: 5px solid #000;
	border-right: 5px solid #353535;
	border-bottom: 5px solid #353535;
	-webkit-border-radius: 5px;
	-moz-border-radius: 5px;
	border-radius: 10px;
  width: 50%;
  margin-top: 10%;
}
.container.shadow h2 {
    color: #000;
    font-weight: 600;
    font-family: monospace;
    font-style: italic;
    font-size: 25px;
    margin-bottom: 50px;
}
.admin-crids {
  position: absolute;
  bottom: 65px;
  left: -70px;
  width: 300px;
  color: orange;
  font-style: italic;
  font-family: monospace;
  font-size: 14px;
}
.user-crids {
  position: absolute;
  bottom: 65px;
  right: 0;
  width: 300px;
  color: orange;
  font-style: italic;
  font-family: monospace;
  font-size: 14px;
}
.admin-crids p {
  margin-bottom: 0;
  text-align: left;
  width: 50%;
  margin: 0 auto;
  padding-left: 3px;
}
.user-crids p {
  margin-bottom: 0;
  text-align: left;
  width: 50%;
  margin: 0 auto;
  padding-left: 3px;
  padding-right: 10px;
  width: 100%;
  text-align: right;
}
</style>

<script>
import { USER_REQUEST } from './store/actions/user'
import { AUTH_LOGOUT } from './store/actions/auth'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'App',
  data: function () {
    return {
      msg: null
    }
  },
  created: function () {
    if (this.$store.getters.isAuthenticated) {
      this.$store.dispatch(USER_REQUEST)
    }
  },
  methods: {
      logout: function () {
        this.$store.dispatch(AUTH_LOGOUT).then(() => this.$router.push('/login'))
      }
    },
    computed: {
      ...mapGetters(['getProfile', 'isAuthenticated', 'isProfileLoaded']),
      ...mapState({
        authLoading: state => state.auth.status === 'loading',
        name: state => `${state.user.profile.fullname}`,
      })
    },
}
</script>
