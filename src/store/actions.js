/**
 * Created by chengfei on 2017/2/17.
 */
import * as types from './mutation-types'
import area from '../config/Areas'
export const addToCart = ({ commit }, product) => {
    if (product.inventory > 0) {
        commit(types.ADD_TO_CART, {
            id: product.id
        })
    }
}
