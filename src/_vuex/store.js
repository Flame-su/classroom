import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        mes: '',
        phone:false,
        isShow:false,
        id:""
    },
    mutations: {
        "SET_MSG"(state, mes) {
            state.mes = mes
        },
        "changePhone"(state,phone){				
			state.phone = !state.phone	
		},
		getPosition(state,isShow){
			state.isShow=!state.isShow
		}
    },
    getters: {
        "GET_MSG"(state) {
            return state.mes
        }
    },
    actions: {
        "SET_MSG"(state, mes) {
        	console.log('获取', state.mes)
        }
    }
})
export default store