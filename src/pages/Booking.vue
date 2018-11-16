<template>
  <div>
    <div class='title'>
      <h3>{{msg}}</h3>
      <b class="boardroom">Boardroom {{idroom}}</b>
    </div>
    <div class='row top-buffer'>
      <!-- <div class='col-sm-3'></div> -->
      <div class='col-sm-8 offset-2'>
        <form v-on:submit.prevent='checkForm' method='post'>
          <p v-if='errors.length'>
            <b class="italic">Please fill the fields below:</b>
            <ul class="ul">
              <li v-for='error in errors' v-bind:key='error.id'>{{ error }}</li>
            </ul>
          </p>
          <div class='form-row'>
            <div class='form-group choose'>
              <label for='employeeSelect'>1. Choose an employee: </label>
              <br>
              <select class='form-control' v-model='selectedEmployee' id='employeeSelect'>
                <option  v-for='user in users' v-bind:key='user.id' v-bind:value='user.id'>{{user.fullname}}</option>
              </select>
            </div>
          </div>
          <div class="title-n">2. Booking-date:</div>
          <div class='form-row'>
            <div class='form-group mb-3 mr-1'>
              <select class='form-control' v-model='selectedMonth' v-on:change='getDays()'>
                <option  v-for='month in months' v-bind:key='month'>{{month}}</option>
              </select>
            </div>
            <div class='form-group mb-3 mr-1'>
              <select class='form-control' v-model='selectedDay'>
                <option  v-for='day in days' v-bind:key='day'>{{day}}</option>
              </select>
            </div>
            <div class='form-group mb-3'>
              <select class='form-control' v-model='selectedYear' v-on:change='getDays()'>
                <option  v-for='year in years' v-bind:key='year'>{{year}}</option>
              </select>
            </div>
          </div>
          <div class="title-n">3. Start-end time:</div>
          <div class='form-row display-inline-block'>
            <div class='form-group mb-3 mr-1'>
              <select class='form-control' v-model='selectedStartHours'>
                <option  v-for='hour in hours' v-bind:key='hour'>{{hour}}</option>
              </select>
            </div>: 
            <div class='form-group mb-3 mr-1 ml-1'>
              <select class='form-control' v-model='selectedStartMinutes'>
                <option  v-for='minute in minutes' v-bind:key='minute'>{{minute}}</option>
              </select>
            </div> -
            <div class='form-group mb-3 mr-1 ml-1'>
              <select class='form-control' v-model='selectedEndHours'>
                <option  v-for='hour in hours' v-bind:key='hour'>{{hour}}</option>
              </select>
            </div>: 
            <div class='form-group mb-3 ml-1'>
              <select class='form-control' v-model='selectedEndMinutes'>
                <option  v-for='minute in minutes' v-bind:key='minute'>{{minute}}</option>
              </select>
            </div>
          </div>
          <div class="form-group text-ar">
            <label for="specificTextArea">4. Description.</label>
            <textarea class="form-control" id="specificTextArea" rows="1" v-model='selectedDescription'></textarea>
          </div>
          <div class="title-n">5. Recurring event?</div>
          <div class="form-check">
            <input class="form-check-input" type="radio" v-model='selectedRecurring' name="recurring" value='false' id="norecurring">
            <label class="form-check-label mr-5" for="norecurring">no</label>
            <input class="form-check-input" type="radio" name="recurring" id="yesrecurring" value='true' v-model='selectedRecurring'>
            <label class="form-check-label" for="yesrecurring">yes</label>
          </div>
          <div v-if='selectedRecurring === "true"'>
            <div class="title-n">6. Choose period:</div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="selectedRecurringSpecify" id="weekly" value="weekly" v-model='selectedRecurringSpecify'>
              <label class="form-check-label mr-5" for="weekly">weekly</label>
              <input class="form-check-input" type="radio" name="selectedRecurringSpecify" id="beweekly" value="beweekly" v-model='selectedRecurringSpecify'>
              <label class="form-check-label mr-5" for="beweekly">be-weekly</label>
              <input class="form-check-input" type="radio" name="selectedRecurringSpecify" id="monthly" value="monthly" v-model='selectedRecurringSpecify'>
              <label class="form-check-label" for="monthly">monthly</label>
            </div>
          </div>
          <div v-if='selectedRecurring === "true"'>
            <div class='form-group'>
              <input type='text' class='form-control' id='duration' v-model='selectedDuration'>
            </div>
          </div>
          <button type='submit' class='btn btn-info mt-1 col-12'>Submit</button>
        </form>
      </div>
    </div>
  </div>
</template>
<style>
  .boardroom {
    font-style: italic;
    font-family: monospace;
    text-transform: uppercase;
    font-size: 20px;
    color: greenyellow;
  }
  .container.shadow {
    margin-top: -10px;
    padding-top: 0;
  }
  .choose {
    width: 100%;
  }
  .title-n {
    font-style: italic;
    font-family: monospace;
    font-size: 14px;
    color: #000;
    font-weight: 600;
  }
  select {
    height: 20px !important;
    padding: 1px !important;
  }
  .text-ar {
    margin-left: -5px;
  }
  /* .form-row.display-inline-block {
    display: inline-block;
  } */
</style>

<script>
import {AUTH_REQUEST} from '../store/actions/auth'
import axios from 'axios'
export default {
  name: 'booking',
  data () {
    return {
      msg: '',
      selectedEmployee: null,
      selectedDay: null,
      selectedMonth: null,
      selectedYear: null,
      selectedStartHours: '',
      selectedStartMinutes: '',
      selectedStartMode: '',
      selectedEndHours: '',
      selectedEndMinutes: '',
      selectedEndMode: '',
      selectedRecurring: null,
      selectedRecurringSpecify: null,
      selectedDuration: null,
      selectedDescription: '',
      errors: [],
      users: [],
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      years: [2018],
      days: [],
      lastIdrecCounter: null
    }
  },
  computed: {
    idroom: function () {
      return this.$route.params.idroom
    },
    selectedMonthNumber: function () {
      return this.months.indexOf(this.selectedMonth);
    },
    hours: function () {
      let h = []
      for(let i = 0; i < 24; i++) {
        h.push(i)
      }
      return h
    },
    minutes: function () {
      let m = []
      for(let i = 0; i <= 60; i++) {
        m.push(i)
      }
      return m
    }
  },
  created: function () {
    this.getAllUsers()
    this.getDays()
    this.getIdrecCounter()
  },
  methods: {
    getIdrecCounter: function () {
      fetch('/api/events/?idrecCounter=1', {
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
					this.lastIdrecCounter = item.lastIdrecCounter
        })
			})
			.catch(error => {
				console.log(error)
			})
    },
    getDays: function () {
      let d = new Date(this.selectedYear || 2018, this.selectedMonthNumber || 9, 0).getDate();
      this.days = []
      for (let i = 1; i <= d; i++) {
        this.days.push(i);
      }
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
						fullname: item.fullname
					})
				})
			})
			.catch(error => {
				console.log(error)
			})
		},
    checkForm: function () {
      if (this.selectedEmployee && this.selectedDay && this.selectedMonth && this.selectedYear && 
        this.selectedStartHours && this.selectedStartMinutes && this.selectedEndHours && 
        this.selectedEndMinutes && this.selectedRecurring) {
        this.submitForm()
      }
      this.errors = []
      if (!this.selectedEmployee) {
        this.errors.push('Employee is required.')
      }
      if (!this.selectedDay) {
        this.errors.push('Day is required')
      }
      if (!this.selectedMonth) {
        this.errors.push('Month is required')
      }
      if (!this.selectedRecurring) {
        this.errors.push('Recurring is required')
      }
      if (!this.selectedYear) {
        this.errors.push('Year is required')
      }
      if (!this.selectedStartHours) {
        this.errors.push('Start Hours is required')
      }
      if (!this.selectedStartMinutes) {
        this.errors.push('Start Minutes is required')
      }
      if (!this.selectedEndHours) {
        this.errors.push('End Hours is required')
      }
      if (!this.selectedEndMinutes) {
        this.errors.push('End Minutes is required')
      }
    },
    submitForm: function () {
      let idrecCounter = this.lastIdrecCounter + 1
      if (this.selectedRecurring === 'true') {
        if (this.selectedRecurringSpecify === 'weekly') {
          let counter = 7;
          for (let i = 0; i < this.selectedDuration; i++) {
            if (i === 0) {
              let starttime = new Date(this.selectedYear, this.selectedMonthNumber, this.selectedDay, this.selectedStartHours, this.selectedStartMinutes)
              let endtime = new Date(this.selectedYear, this.selectedMonthNumber, this.selectedDay, this.selectedEndHours, this.selectedEndMinutes)
              this.sendData(idrecCounter, starttime, endtime)
            } else {
              let starttime = new Date(this.selectedYear, this.selectedMonthNumber, +this.selectedDay+(counter*i), this.selectedStartHours, this.selectedStartMinutes)
              let endtime = new Date(this.selectedYear, this.selectedMonthNumber, +this.selectedDay+(counter*i), this.selectedEndHours, this.selectedEndMinutes)
              this.sendData(idrecCounter, starttime, endtime)
            }
          }
        } else if (this.selectedRecurringSpecify === 'beweekly') {
          let counter = 14;
          for (let i = 0; i < this.selectedDuration; i++) {
            if (i === 0) {
              let starttime = new Date(this.selectedYear, this.selectedMonthNumber, this.selectedDay, this.selectedStartHours, this.selectedStartMinutes)
              let endtime = new Date(this.selectedYear, this.selectedMonthNumber, this.selectedDay, this.selectedEndHours, this.selectedEndMinutes)
              this.sendData(idrecCounter, starttime, endtime)
            } else {
              let starttime = new Date(this.selectedYear, this.selectedMonthNumber, +this.selectedDay+(counter*i), this.selectedStartHours, this.selectedStartMinutes)
              let endtime = new Date(this.selectedYear, this.selectedMonthNumber, +this.selectedDay+(counter*i), this.selectedEndHours, this.selectedEndMinutes)
              this.sendData(idrecCounter, starttime, endtime)
            }
          }
        } else if (this.selectedRecurringSpecify === 'monthly') {
          let counter = 1;
          for (let i = 0; i < this.selectedDuration; i++) {
            if (i === 0) {
              let starttime = new Date(this.selectedYear, this.selectedMonthNumber, this.selectedDay, this.selectedStartHours, this.selectedStartMinutes)
              let endtime = new Date(this.selectedYear, this.selectedMonthNumber, this.selectedDay, this.selectedEndHours, this.selectedEndMinutes)
              this.sendData(idrecCounter, starttime, endtime)
            } else {
              let starttime = new Date(this.selectedYear, +this.selectedMonthNumber+(counter*i), this.selectedDay, this.selectedStartHours, this.selectedStartMinutes)
              let endtime = new Date(this.selectedYear, +this.selectedMonthNumber+(counter*i), this.selectedDay, this.selectedEndHours, this.selectedEndMinutes)
              this.sendData(idrecCounter, starttime, endtime)
            }
          }
        }
      } else {
        let starttime = new Date(this.selectedYear, this.selectedMonthNumber, this.selectedDay, this.selectedStartHours, this.selectedStartMinutes)
        let endtime = new Date(this.selectedYear, this.selectedMonthNumber, this.selectedDay, this.selectedEndHours, this.selectedEndMinutes)
        this.sendData(idrecCounter, starttime, endtime)
      }
    },
    sendData: function (idrecCounter, starttime, endtime) {
      let created = new Date()
      let data = {idrec: idrecCounter, description: this.selectedDescription, iduser: this.selectedEmployee, 
        idroom: this.idroom, starttime: starttime.toLocaleString('en-US'), endtime: endtime.toLocaleString('en-US'), created: created.toLocaleString('en-US') }
      let headers = {
            'Content-Type': 'application/json',
            'Authorization': this.$store.state.auth.token
        }
      axios.post('/api/events/', data, { headers: headers })
        .then(res => {
          this.$router.push({name: 'loginError', params: {
            msg: `The event ${starttime.getHours()}:${starttime.getMinutes()} - ${endtime.getHours()}:${endtime.getMinutes()} has been added. The text for this event is "${this.selectedDescription}"`
          }})
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
