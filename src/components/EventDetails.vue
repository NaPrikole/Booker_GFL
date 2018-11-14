<template>
  <div>
    <div style='border: 1px solid black; max-width: 100%; padding: 0 5px 0 10px; position: relative;'>
      <h2>{{msg}}</h2>
      <div style='position: absolute; right: 10px; top: 10px;'>
        <a href="#" @click.prevent='closeEventDetails'>close</a>
      </div>
      <form v-on:submit.prevent='submitForm' method='post' style='padding-top:20px; text-align:left;'>
        <p v-if='errors.length' style='color:red'>
          <b>Please fix next errors:</b>
          <ul>
            <li v-for='error in errors' v-bind:key='error.id'>{{ error }}</li>
          </ul>
        </p>
        <b>When:</b>
        <br>
        {{starttime}}
        <div class='form-row'>
          <div class='form-group mb-3'>
            <select class='form-control' v-model='defaultStartHours'>
              <option  v-for='hour in hours' v-bind:key='hour'>{{hour}}</option>
            </select>
          </div>
          <div class='form-group mb-3'>
            <select class='form-control' v-model='defaultStartMinutes'>
              <option  v-for='minute in minutes' v-bind:key='minute'>{{minute}}</option>
            </select>
          </div>
        </div>
        {{endtime}}
        <div class='form-row'>
          <div class='form-group mb-3'>
            <select class='form-control' v-model='defaultEndHours'>
              <option  v-for='hour in hours' v-bind:key='hour'>{{hour}}</option>
            </select>
          </div>
          <div class='form-group mb-3'>
            <select class='form-control' v-model='defaultEndMinutes'>
              <option  v-for='minute in minutes' v-bind:key='minute'>{{minute}}</option>
            </select>
          </div>
        </div>  
        <div class='form-row'>
          <div class='form-group'>
            <b>Who:</b>
            <select class='form-control' v-model='defaultEmployeeId'>
              <option v-for='user in users' v-bind:key='user.id' v-bind:value='user.id'>{{user.fullname}}</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <b>Notes:</b>
          <textarea class="form-control" rows="1" v-model='defaultDescription'></textarea>
        </div>
        <div style='font-size:14px;'>
          Submitted: {{created}}
        </div>
        <div style='font-size:12px;'>Applied to all events in recurring?</div>
        <div class='form-row'>
          <div class="form-check">
            <input class="form-check-input" type="radio" v-model='selectedRecurring' name="recurring" value='false' id="norecurring">
            <label class="form-check-label" for="norecurring">
              no
            </label>
          </div>
          <div class="form-check" style='margin-left: 10px;'>
            <input class="form-check-input" type="radio" name="recurring" id="yesrecurring" value='true' v-model='selectedRecurring'>
            <label class="form-check-label" for="yesrecurring">
              yes
            </label>
          </div>
        </div>
        <button type='submit' class='btn btn-primary' style='margin:30px 10px;'>Update</button>
        <button @click.prevent='removeItem()' type='submit' class='btn btn-danger' style='margin:30px 0;'>Delete</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'eventDetails',
    data () {
        return {
            defaultEmployeeName: null,
            defaultMonth: null,
            defaultDay: null,
            defaultYear: null,

            defaultStartHours: null,
            defaultStartMinutes: null,
            defaultEndHours: null,
            defaultEndMinutes: null,
            defaultEmployeeId: null,
            defaultDescription: null,
            
            selectedRecurring: null,
            defaultRecurring: null,
            defaultRecurringSpecify: null,
            defaultDuration: null,
            defaultStartTime: null,
            defaultEndTime: null,
            msg: '',
            id: null,
            idrec: null,
            description: null,
            iduser: null,
            idroom: null,
            starttime: null,
            endtime: null,
            created: null,
            events: [],
            errors: [],
            users: [],
            months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            years: [2018, 2019, 2020],
            eventsByIdrec: []
        }
    },
    props: {
      detailsProps: String
    },
    created: function () {
      this.getUsers()
      this.getEventById(this.detailsProps)
    },
    computed: {
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
    methods: {
      closeEventDetails: function () {
        this.$parent.$emit('closeEventDetails')
      },
      getUsers: function () {
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
      getUserById: function (id) {
        fetch('/api/users/' + id, {
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
              this.defaultEmployeeName = item.fullname
            })
          })
          .catch(error => {
            console.log(error)
          })
      },
      getEventById: function (id) {
        fetch('/api/events/' + id,
          {
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
            let defaultEmployeeId
            let idrec
            json.forEach(item => {
              this.events.push({
                id: item.id,
                idrec: item.idrec,
                description: item.description,
                iduser: item.iduser,
                idroom: item.idroom,
                starttime: item.starttime,
                endtime: item.endtime,
                created: item.created
              })
              defaultEmployeeId = item.iduser
              idrec = item.idrec
              this.defaultEmployeeId = defaultEmployeeId
            })
          this.getUserById(defaultEmployeeId)
          this.getEventsByIdrec(idrec)
          this.fillInInputs()
          })
          .catch(error => {
            this.message = error
          })
      },
      fillInInputs: function () {
        this.events.forEach(item => {
          this.id = item.id,
          this.idrec = item.idrec,
          this.defaultDescription = item.description,
          this.iduser = item.iduser,
          this.idroom = item.idroom,
          this.defaultStartTime = item.starttime,
          this.defaultEndTime = item.endtime,
          this.starttime = item.starttime.split(',').pop(),
          this.defaultStartDate = item.starttime.split(',')[0]
          this.defaultEndDate = item.endtime.split(',')[0]
          this.endtime = item.endtime.split(',').pop(),
          this.created = item.created
        })
      },
      getEventsByIdrec: function (idrec) {
        fetch('/api/events/?idrec=' + idrec, { 
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
            this.eventsByIdrec.push(item)
          })
        })
        .catch(error => {
          console.log(error)
        })
      },
      removeItem: function () {
        let headers = {
            'Content-Type': 'application/json',
            'Authorization': this.$store.state.auth.token
        }
        if (confirm("Are you sure to delete event?")) {
          for (let i = 0; i < this.eventsByIdrec.length; i++) {
            let id = this.eventsByIdrec[i].id
            axios.delete(`/api/events/${id}`, { headers: headers })
              .then(res => {
                this.$router.push({ name: 'loginError', params: { msg: 'Event deleted' }})
              })
              .catch(err => {
                console.log(err)
              })
          }
        }
      },
      // checkForm: function () {
      //   if (this.defaultStartTime && this.defaultStartMinutes && this.username && this.password) {
      //     this.submitForm()
      //   }
      //   this.errors = []
      //   if (!this.fullname) {
      //     this.errors.push('Enter Full Name.')
      //   }
      //   if (!this.email) {
      //     this.errors.push('Enter Email.')
      //   }
      //   if (!this.username) {
      //     this.errors.push('Enter Username.')
      //   }
      //   if (!this.password) {
      //     this.errors.push('Enter Password.')
      //   }
      // },
      submitForm: function () {
        let startTimeNewHours = this.starttime
        let endTimeNewHours = this.endtime
        let headers = {
          'Content-Type': 'application/json',
          'Authorization': this.$store.state.auth.token
        }

        if (this.selectedRecurring === 'true') {
          for (let i = 0; i < this.eventsByIdrec.length; i++) {
          let mockData = this.eventsByIdrec[i]
          let id = mockData.id

          let defaultStartTime = mockData.starttime.split(',').pop()
          let startTimeYear = mockData.starttime.split(',')[0].split('/').pop()
          let startTimeMonth = mockData.starttime.split(',')[0].split('/')[0]
          let startTimeDay = mockData.starttime.split(',')[0].split('/')[1]

          let defaultEndTime = mockData.endtime.split(',').pop()
          let endTimeYear = mockData.endtime.split(',')[0].split('/').pop()
          let endTimeMonth = mockData.endtime.split(',')[0].split('/')[0]
          let endTimeDay = mockData.endtime.split(',')[0].split('/')[1]

          let starttime = new Date(+startTimeYear, +startTimeMonth, +startTimeDay)
          starttime.setHours(+this.defaultStartHours || +defaultStartTime.split(':')[0], +this.defaultStartMinutes || +defaultStartTime.split(':')[1])
          let endtime = new Date(+endTimeYear, +endTimeMonth, +endTimeDay)
          endtime.setHours(+this.defaultEndtHours || +defaultEndTime.split(':')[0], +this.defaultEndMinutes || +defaultEndTime.split(':')[1])
          let data = { idrec: mockData.idrec, description: this.defaultDescription, iduser: this.iduser, idroom: mockData.idroom, 
            starttime: starttime.toLocaleString('en-US'), endtime: endtime.toLocaleString('en-US'), created: mockData.created }
          axios.put('/api/events/' + id, data, { headers: headers })
            .then(res => {
              this.$router.push({ name: 'loginError', params: { msg: 'Event updated' }})
            })
            .catch(err => {
              console.log(err)
              this.$router.push({ name: 'loginError', params: { msg: 'Event not updated' }})
            })
          }
        } else {
          let mockData = this.eventsByIdrec[0]
          let id = mockData.id

          let defaultStartTime = mockData.starttime.split(',').pop()
          let startTimeYear = mockData.starttime.split(',')[0].split('/').pop()
          let startTimeMonth = mockData.starttime.split(',')[0].split('/')[0]
          let startTimeDay = mockData.starttime.split(',')[0].split('/')[1]

          let defaultEndTime = mockData.endtime.split(',').pop()
          let endTimeYear = mockData.endtime.split(',')[0].split('/').pop()
          let endTimeMonth = mockData.endtime.split(',')[0].split('/')[0]
          let endTimeDay = mockData.endtime.split(',')[0].split('/')[1]

          let starttime = new Date(+startTimeYear, +startTimeMonth, +startTimeDay)
          starttime.setHours(+this.defaultStartHours || +defaultStartTime.split(':')[0], +this.defaultStartMinutes || +defaultStartTime.split(':')[1])
          let endtime = new Date(+endTimeYear, +endTimeMonth, +endTimeDay)
          endtime.setHours(+this.defaultEndtHours || +defaultEndTime.split(':')[0], +this.defaultEndMinutes || +defaultEndTime.split(':')[1])
          let data = { idrec: mockData.idrec, description: this.defaultDescription, iduser: this.iduser, idroom: mockData.idroom, 
            starttime: starttime.toLocaleString('en-US'), endtime: endtime.toLocaleString('en-US'), created: mockData.created }
          axios.put('/api/events/' + id, data, { headers: headers })
            .then(res => {
              this.$router.push({ name: 'loginError', params: { msg: 'Event updated' }})
            })
            .catch(err => {
              console.log(err)
              this.$router.push({ name: 'loginError', params: { msg: 'Event not updated' }})
            })
        }
      }
    }
}
</script>
