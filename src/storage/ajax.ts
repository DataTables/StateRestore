import { Storage } from '../interface';

const ajax: Storage = {
	read: async function (dt) {
		return [];
	},

	create: async function (dt, state, states) {
		return true;
	},

	edit: async function (dt, state, states) {
		return true;
	},

	remove: async function (dt, state, states) {
		return true;
	}
};

export default ajax;
