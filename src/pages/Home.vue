<template>
    <div>
		<div class='row' style='margin-top: 20px;'>
			<div class="col col-md-3" style='text-align: center; padding: 0px;'>
				<button v-if='userIsAdmin' type='submit' @click.prevent='employeeList' class='btn btn-info' style='margin:-15px 0 17px 2px;'>Employee List</button>
				<button type='submit' @click.prevent='bookit' class='btn btn-info' style='margin:-15px 0 0 2px;'>Book event</button>
				<eventDetails v-if='eventDetailsClicked' v-bind:detailsProps="detailsProps"></eventDetails>
			</div>
			<div class='col col-md-9'>
				<div class='row'>
					<div class='col-sm-12 col-md-6'>
						<div class='buttons'>
							<button class="btn btn-info col-2 r-b" v-on:click='prevMonth()'><span><</span></button>
								<span class="curr-m">{{currentMonth}}</span>
							<button class="btn btn-info col-2 l-b" v-on:click='nextMonth()'><span>></span></button>
						</div>
					</div>
					<div class='col-sm-12 col-md-4'>
						<span class='date'>{{prettyDate}}</span>
					</div>
				</div>
				<br>
				<div>
					<a href='#' class='rooms' v-for='room of rooms' v-bind:id='room.id' :ref='"room" + room.id' v-bind:key='room.id' @click.prevent='selectRoom($event)'>{{room.name}}</a>
				</div>
				<div id='calendar'>
					<div class='dayName' v-for='weekDay in daysInWeek' v-bind:key='weekDay.id'>
						{{weekDay}}
					</div>
					<div class='day' v-for='day in days' v-bind:key='day.id' 
						v-bind:class='{bordered: day, active: currentDate.getMonth() == today.getMonth() && day.index == today.getUTCDate()}'>
						<span style='font-size:14px;'>{{day.index}}</span>
						<ul style='margin: 16px 0 0 -8px; padding:0; font-size:12px; list-style: none;'>
							<li v-for='event in day.events' :key='event'><a href="#" v-bind:id='day.idevent' @click.prevent='clickEventToViewDetails($event)'>{{event}}</a></li>
						</ul>
					</div>
				</div>
			</div>
		</div>
  </div>
</template>
<style>
.buttons {
	margin-top: -15px;
}
.buttons span {
	font-weight: 600;
	color: #000;
	font-size: 20px;
}
.buttons .curr-m {
	font-style: italic;
	font-weight: 600;
	font-size: 20px;
	fon-family: monospace;
	color: #ffffbb;
}
.r-b, .l-b {
	margin: 0 10px;
	background-color: orange !important;
	color: #000;
	font-size: 20px;
	border: 1 px solid #3399ff;
}
	.rooms {
		padding: 0 10px;
		color: #ffffbb;
		font-style: italic;
		font-family: monospace;
	}
	.rooms:hover {
		text-decoration: none;
	}
	.room-active {
		font-weight: 600;
		font-size: 20px;
	}
  #calendar {
	margin: 0 auto;
	padding-left: 5px;
    border: 2px solid #3399ff;
    border-radius: 7px;
    width: 672px;
    min-height: 472px;
    display: flex;
    flex-wrap: wrap;
    padding-top: 10px;
    background-color: #222;
  }
  #list{
    text-align: left;
    padding-left: 20px;
  }
  .dayName {
    color: orange;
    font-family: monospace;
    font-style: italic;
	font-size: 16px;
    width: 90px;
    height: 20px;
    margin: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
  }
  .day {
    color: orange;
    font-family: monospace;
    font-style: italic;
	padding-left: 2px;
    width: 90px;
    height: 70px;
    margin: 2px;
    display: flex;
    justify-content: top;
    align-items: top;
    cursor: pointer;
	overflow: hidden;
	font-weight: 600;
	background-color: #555;
	border-radius: 7px;
	border: 1px solid #000;
  }
.day ul li a {
	font-size: 14px;
	color: #ffffbb;
	font-family: monospace;
	font-style: italic;
}
  .bordered {
    border: 1px solid #3399ff;
    border-radius: 7px;
  }
  .active {
    background: #999;
  }
.btn-info {
	width: 100%;
}
.container.shadow {
	width: 76% !important;
	position: relative;
}
.date {
	position: absolute;
	top: -15px;
	right: -117px;
	color: #ffffbb; 
	font-family: monospace;
	font-weight: 600;
	font-style: italic;
	font-size: 22px;
}
</style>
<script>
import EventDetails from '../components/EventDetails'
// @ is an alias to /src
export default {
	name: 'home',
	components: {
		EventDetails
	},
	data: function () {
		return {
			detailsProps: null,
			lastEvent: false,
			eventDetailsClicked: false,
			rooms: [],
			checkedRoomId: 1,
			eventsByRoom: [],
			eventsByRoomByMonth: [],
			currentDate: {},
			tasks: [],
			tasksToShow: [],
			daysInWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
			months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
			days: []
		}
	},
	created: function () {
		this.getAllRooms()
		this.selectRoom()
		this.build(this.today)
	},
	computed: {
		userIsAdmin: function () {
			return this.$store.state.user.profile.admin
		},
		today: function () {
			return new Date()
		},
		currentMonth: function () {
			return this.months[this.currentDate.getMonth()]
		},
		prettyDate: function () {
			var month = this.months[this.today.getMonth()]
			var day = this.today.getUTCDate()
			var year = this.today.getUTCFullYear()
			return day + ' ' + month + ' ' + year
		}
	},
	mounted: function (){
		this.$on('closeEventDetails', this.closeEventDetails)
	},
	methods: {
		clickEventToViewDetails: function (event) {
			if (this.lastEvent !== event.target) {
				this.closeEventDetails()
				this.detailsProps = event.target.id
				this.eventDetailsClicked = true
			} else {
				this.eventDetailsClicked = !this.eventDetailsClicked
			}
			this.lastEvent = event.target
		},
		closeEventDetails: function () {
			this.eventDetailsClicked = false
		},
		bookit: function () {
			this.$router.push({ name: 'booking', params: { idroom: this.checkedRoomId }})
		},
		employeeList: function () {
			this.$router.push({ name: 'employee', params: { idroom: this.checkedRoomId }})
		},
		getAllRooms: function () {
			fetch('/api/rooms/', { 
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
					this.rooms.push({
						id: item.id,
						name: item.name
					})
				})
			})
			.catch(error => {
				console.log(error)
			})
		},
		selectRoom: function (event) {
			if (event) {
				let target = event.target
				this.checkedRoomId = target.id
				let list = target.parentElement.children
				for(let i = 0; i <= list.length; i++){
					let item = list[i]
					if (item !== undefined) {
						item.classList.remove('room-active')
					}
				} 
				event.target.classList.add('room-active')
				this.getAllEventsByRoomByMonth(this.checkedRoomId, this.today.getMonth())
			} else {
				setTimeout(() => {
					this.$refs['room1'][0].classList.add('room-active')
					this.getAllEventsByRoomByMonth(this.checkedRoomId, this.today.getMonth())
				}, 150);
			}
		},
		getAllEventsByRoomByMonth: function (idroom, month) {
			fetch('/api/events/?room=' + idroom + '&month=' + month, { 
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
				this.eventsByRoomByMonth = []
				json.forEach(item => {
					this.eventsByRoomByMonth.push({
						id: item.id,
						idrec: item.idrec, 
						description: item.description,
						iduser: item.iduser,
						idroom: item.idroom,
						starttime: item.starttime,
						endtime: item.endtime,
						created: item.created
					})
				})
			})
			.catch(error => {
				console.log(error)
			})
			this.build(this.today)
			this.addEventsToDays()
		},
		addEventsToDays: function () {
			setTimeout(() => {
				if (this.eventsByRoomByMonth.length > 0) {
					for (let i = 0; i < this.days.length; i++) {
						for (let j = 0; j < this.eventsByRoomByMonth.length; j++) {
							let item = this.eventsByRoomByMonth[j]
							let idevent = item.id
							let starttime = item.starttime
							let tmp = starttime.split(',')
							let date = tmp[0]
							let time = tmp[1]
							time = time.split(":00 ")
							let eventStartTime = time[0]

							let endtime = item.endtime
							let tmp2 = endtime.split(',')
							let date2 = tmp2[0]
							let time2 = tmp2[1]
							time2 = time2.split(":00 ")
							let eventEndtTime = time2[0].trim()

							let dateParts = date.split('/')
							let month = dateParts[0]
							let day = dateParts[1]
							if (this.days[i].index+'' === day) {
								this.days[i].events.push(`${eventStartTime}-${eventEndtTime}`)
								this.days[i].idevent = idevent
							}
						}
					}
				}
			}, 150);
			
		},
		buildNewDays: function (year, month) {
			let numDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
			let daysIndex = { 'Mon': 0, 'Tue': 1, 'Wed': 2, 'Thu': 3, 'Fri': 4, 'Sat': 5, 'Sun': 6 }
			let index = daysIndex[(new Date(year, month, 1)).toString().split(' ')[0]]
			this.days = []
			for (var day of this.daysInWeek) {
				if (day != this.daysInWeek[index]) {
					this.days.push('')
				} else {
					break
				}
			}
			for (let i = 1, l = numDaysInMonth[month]; i <= l; i++) {
				this.days.push({index: i, idevent: null, events: []})
			}
		},
		build: function (date) {
			this.currentDate = date
			this.buildNewDays(date.getFullYear(), date.getMonth())
		},
		prevMonth: function () {
			if (this.currentDate.getMonth() == 0) {
				var date = new Date(this.currentDate.getFullYear() - 1, 11, 1)
			} else {
				var date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1)
			}
			this.build(date)
			this.addEventsToDays()
		},
		nextMonth: function () {
			if (this.currentDate.getMonth() == 11) {
				var date = new Date(this.currentDate.getFullYear() + 1, 0, 1)
			} else {
				var date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1)
			}
			this.build(date)
			this.addEventsToDays()
		}
	}
}
</script>
