import axios from 'axios'

const state = {
  photosList: [],
  photoUpdateFieldsState: [
    {
      column: 'photo ID',
      field: 'photo_id',
      type: 'String',
      readOnly: false,
      create: false,
      initialValue: ''
    },
    {
      column: 'Photo status',
      field: 'photo_status',
      type: 'String',
      readOnly: false,
      create: false,
      initialValue: ''
    }
  ]
}

const getters = {
  allPhotosList: state => state.photosList,
  getPhotoById: (state) => (id) => {
    return state.photosList.find((d) => d.photo_id === id)
  },
  getPhotoUpdateFieldsState: state => state.photoUpdateFieldsState,
  getDeviceForPhoto: (state, getters, rootState, rootGetters) => {
    return rootGetters.getCurrentDevice
  }
}

const actions = {
  async fetchPhotosList ({ dispatch, commit, getters, rootGetters }) {
    const baseURL = rootGetters.getBaseUrl
    const options = rootGetters.getOptions
    console.log('in fetch photos')
    const device = getters.getDeviceForPhoto
    const response = await axios.get(
      baseURL.concat('/gadget_communicator_pull/api/list_photos/device/').concat(device.device_id), options)
      .catch(
        function (error) {
          console.log('Show error notification!' + error.response.data)
          return Promise.reject(error)
        }
      )
    console.log(JSON.stringify(response.data))
    commit('setPhotosList', response.data)
  },
  async deletePhoto ({ dispatch, commit, getters, rootGetters }, id) {
    const baseURL = rootGetters.getBaseUrl
    const options = rootGetters.getOptions
    const url = baseURL.concat('/gadget_communicator_pull/api/photo_operation/').concat(id).concat('/delete')
    await axios.delete(url, options).catch(
      function (error) {
        console.log('Show error notification!')
        commit('setErrors', error.response.data)
      }
    )
    commit('removePhoto', id)
  },
  async takePhoto ({ dispatch, commit, getters, rootGetters }) {
    const baseURL = rootGetters.getBaseUrl
    const options = rootGetters.getOptions
    const device = getters.getDeviceForPhoto
    const url = baseURL.concat('/gadget_communicator_pull/api/photo_operation/device/').concat(device.device_id)
    const responseCreate = await axios.get(url, options).catch(
      function (error) {
        console.log('Show error notification!')
        commit('setErrors', error.response.data)
      }
    )
    const urlGet = baseURL.concat('/gadget_communicator_pull/api/photo_operation/').concat(responseCreate.data.id)
    const response = await axios.get(urlGet, options).catch(
      function (error) {
        console.log('Show error notification!')
        return Promise.reject(error)
      }
    )
    commit('takePhotoM', response.data)
  },
  async downloadPhoto ({ dispatch, commit, getters, rootGetters }, id) {
    const baseURL = rootGetters.getBaseUrl
    const options = rootGetters.getOptions
    const optionsCopy = { ...options }
    let err = 'none'
    optionsCopy.responseType = 'arraybuffer'
    const url = baseURL.concat('/gadget_communicator_pull/api/photo_operation/').concat(id).concat('/download')
    await axios.get(url, optionsCopy).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'image/png' }))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', id)
      document.body.appendChild(link)
      link.click()
    }).catch(
      // eslint-disable-next-line node/handle-callback-err
      async function (error) {
        await axios.get(url, options).catch(
          function (error) {
            console.log('Show error notification!' + JSON.stringify(error.response.data))
            err = JSON.stringify(error.response.data)
          }).then(() => {
          console.log('Show error4 notification!' + err)
          commit('setErrors', err)
        })
      }
    )
  }
}

const mutations = {
  setPhotosList (state, photo) {
    (state.photosList = photo)
  },
  takePhotoM: (state, photo) => state.photosList.unshift(photo),
  removePhoto: (state, id) =>
    (state.photosList = state.photosList.filter(photo => photo.photo_id !== id))
}

export default {
  state,
  getters,
  actions,
  mutations
}
