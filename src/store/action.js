/*
* 通过mutation间接更新state
* */
import {
	getUser,
	getAddressList,
    getCartInfo
} from '../service/getData'

import {
	GET_USERINFO,
	SAVE_ADDRESS,
    RECORD_CART,
    GET_CART
} from './mutation-types.js'

export default {
//   async cartList({
//     commit,
//     state
//   }) {
//   let res = await getCartInfo(state.openId);
//   commit(GET_CART, res)
// },

	async getUserInfo({
		commit,
		state
	}) {
		let res = await getUser();
		commit(GET_USERINFO, res)
	},
	async saveAddress({
		commit,
		state
	}) {

		if(state.removeAddress.length > 0) return;

		let addres = await getAddressList(state.userInfo.user_id);
		commit(SAVE_ADDRESS, addres);
	},
}
