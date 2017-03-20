/**
 * Created by chengfei on 2017/2/21.
 */
import * as types from '../mutation-types'
import { Areas } from '../../config/Areas';
const state = {
    loading: false
}

// getters
const getters = {
    getLoadStatus: state => state.loading
}

const actions = {
    getAreas ({state}) {
        return  Areas;
    }
}

const mutations = {
    [types.START_LOADING] (state) {
        state.loading = true
    },
    [types.FINISH_LOADING] (state) {
        state.loading = false
    }
}
export default {
    state,
    actions,
    getters,
    mutations
}
