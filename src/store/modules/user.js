import { login, logout } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { Login, getInfo } from '@/api/Login/Login'

const getDefaultState = () => {
  return {
    token: getToken(),
    userName: '',
    avatar: '',
    userId: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
    localStorage.removeItem('token')
  },
  SET_TOKEN: (state, token) => {
    state.token = token
    localStorage.setItem('token', token)
  },
  SET_NAME: (state, name) => {
    state.userName = name
  },
  SET_USERID: (state, userId) => {
    state.userId = userId
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { userId, password } = userInfo
    return new Promise((resolve, reject) => {
      Login({ userId: userId.trim(), password: password }).then(response => {
        console.log("res:{}",response)
        commit('SET_TOKEN', response.data.token)
        setToken(response.data.token)
        resolve()
      }).catch(err => {
        reject(err)
      })

    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(data => {
        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        console.log("res2:{}",data)
        const { userName, avatar, userId } = data.data
        commit('SET_NAME', userName)
        commit('SET_USERID', userId)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      // logout(state.token).then(() => {
      //   removeToken() // must remove  token  first
      //   resetRouter()
      //   commit('RESET_STATE')
      //   resolve()
      // }).catch(error => {
      //   reject(error)
      // })
      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

