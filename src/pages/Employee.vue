<template>
  <div>
	<div class='row'>
     			<div class="col-md-11 employee-section mt-4">
				<div class="row"  v-for='user in users' :key='user.id'>
				<a class="col-6 employee-link" v-bind:href='`mailto:${user.email}`'>{{user.fullname}}</a>
				<a href='#' class="col-3 crud-link" v-bind:id='user.id' @click='removeEmployee($event)'>remove</a>
				<a href='#' class="col-3 crud-link" v-bind:id='user.id' @click='editEmployee($event)'>edit</a>
				</div>
				<button v-if='userIsAdmin' type='submit' @click.prevent='goToAddNewEmployee' class='btn btn-info col-6 offset-3 mt-2'>New employee</button>
			</div>
		</div>
  </div>
</template>
<style>
.employee-section {
	text-align: left;
	background-color: lightblue;
	border-radius: 7px;
	margin: 0 15px;
	padding: 15px;
}
.employee-link {
	flex: 0 0 50%;
	max-width: 50%;
	color: #000;
	font-style: italic;
	font-weight: 600;
	font-family: monospace;
	font-size: 17px;
	border-bottom: 1px solid #000;
	margin-bottom: 3px;
}
.crud-link {
    flex: 0 0 25%;
    max-width: 25%;
    text-transform: uppercase;
    font-size: 13px;
    font-style: italic;
    font-weight: 600;
    font-family: monospace;
    color: orange;
    border: 1px solid #fff;
    text-align: center;
    padding: 0;
    background-color: #333;
    border-radius: 7px;
    padding-top: 3px;
    box-shadow: 
    inset rgba(0,0,0,.6) 0 -3px 8px,
    inset rgba(252,255,255,.7) 0 3px 8px,
    rgba(0,0,0,.8) 0 3px 8px -3px;
}
</style>
<script>
import axios from 'axios'
export default {
  name: 'employee',
  data: function () {
		return {
			users: [],
		}
	},
	computed: {
		userIsAdmin: function () {
			return this.$store.state.user.profile.admin
		}
	},
	created: function () {
		if(this.userIsAdmin) {
			this.getAllUsers()
		}
	},
	methods: {
		removeEmployee: function (event) {
			let id = event.target.id
			let headers = {
				'Content-Type': 'application/json',
				'Authorization': this.$store.state.auth.token
			}
			for (let i = 0; i < this.users.length; i++) {
				let item = this.users[i]
				if (item.id + '' === id) {
					this.users.splice(i, 1)
				}
			}
			axios.delete('/api/users/' + id, { headers: headers })
				.then(res => {
					console.log(res)
				})
				.catch(err => {
					console.log(err)
				})
		},
		editEmployee: function (event) {
			let id = event.target.id
			this.$router.push('/edit-employee/'+id)
		},
		goToAddNewEmployee: function () {
			this.$router.push('new-employee')
		},
		getAllUsers: function () {
			fetch('/api/users/', {
				method: 'get',
				headers: new Headers({
					'Authorization': this.$store.state.auth.token,
					'Content-Type': 'application/json'
				})
			})
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
						admin: item.admin
					})
				})
			})
			.catch(error => {
				console.log(error)
			})
		}
	}
}
</script>
