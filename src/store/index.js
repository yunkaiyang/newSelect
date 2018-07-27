import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state:{
    varenumList:[]
  },
  mutations:{
    setVarenumList: function (state, varenumList){
      state.varenumList = varenumList;
    }
  },
  getters:{
    getVarenumList:function(state){
      return state.varenumList;
    }
  },
  actions:{
    setVarenumList:function(context,varenumList){
      context.commit('setVarenumList',varenumList);
    }
  }
})