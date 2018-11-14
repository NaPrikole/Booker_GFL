import { USER_REQUEST, USER_ERROR, USER_SUCCESS } from '../actions/user'
import { AUTH_LOGOUT } from '../actions/auth'
import Vue from 'vue'
import axios from 'axios'

const state = { status: '', profile: {} }

const getters = {
  getProfile: state => state.profile,
  isProfileLoaded: state => !!state.profile.name,
}

const actions = {
  [USER_REQUEST]: ({commit, dispatch}) => {
    return new Promise((resolve, reject) => {
      commit(USER_REQUEST)
      let id = localStorage.getItem('user-id')
      axios.get('/api/users/'+id)
      .then(res => {
          commit(USER_SUCCESS, res.data[0])
        })
      .catch(res => {
        commit(USER_ERROR)
        // if res is unauthorized, logout, to
        dispatch(AUTH_LOGOUT)
      })
    })
  },
}

const mutations = {
  [USER_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [USER_SUCCESS]: (state, res) => {
    state.status = 'success'
    Vue.set(state, 'profile', res)
  },
  [USER_ERROR]: (state) => {
    state.status = 'error'
  },
  [AUTH_LOGOUT]: (state) => {
    state.profile = {}
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
}
