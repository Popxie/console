/**
 * Created by chengfei on 2017/2/21.
 */
import * as types from '../mutation-types'
import {_get} from '../../utils/fetch'
const state = {
    message: 'home'
}

// getters
const getters = {
    getMessage: state => state.message
}
// mutations
const mutations = {
    [types.FETCH_HOME_SUCCESS] (state, data) {
        state.message = data.name
    }
}

// actions
const actions = {
    getHome ({commit}) {
        const url = '/home'
        return _get({url}, commit)
            .then((json) => {
                if (json.code === 0) {
                    return commit(types.FETCH_HOME_SUCCESS, json.data)
                }
                return Promise.reject(new Error(types.FETCH_HOME_FAILURE))
            })
            .catch((error) => {
                // commit('FETCH_HOME_FAILURE')
                return Promise.reject(error)
            })
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
