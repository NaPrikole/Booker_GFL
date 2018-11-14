<template>
  <div>
	<div class='row' style='margin-top:40px;'>
      <div class="col-md-2"></div>
			<div class="col-md-8" style='text-align:left'>
				<div style='margin-bottom: 20px;' class="row"  v-for='user in users' :key='user.id'>
				<a class="col-6" v-bind:href='`mailto:${user.email}`'>{{user.fullname}}</a>
				<a href='#' class="col-3" style='font-size:14px;' v-bind:id='user.id' @click='removeEmployee($event)'>REMOVE</a>
				<a href='#' class="col-3" style='font-size:14px;' v-bind:id='user.id' @click='editEmployee($event)'>EDIT</a>
				</div>
				<button v-if='userIsAdmin' type='submit' @click.prevent='goToAddNewEmployee' class='btn btn-basic'>Add a new employee</button>
			</div>
		</div>
  </div>
</template>

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
