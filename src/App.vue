<template>
  <div id="app">
    <div class="mid">
      <!-- multiple多选 isSelect单选 isText文本 isTile平铺 -->
      <dropDown :select-data="selectData" :json-list="varenumList" multiple v-model="modelData"></dropDown>
    </div>
    <div class="mid">
      <dropDown :select-data="selectData2" :json-list="varenumList" isSelect></dropDown>
    </div>
    
    <div class="mid">
      <dropDown :select-data="selectData3" :json-list="varenumList" isTile></dropDown>
    </div>
    <div class="mid">
      <dropDown :select-data="selectData4" :json-list="varenumList" isTile multiple></dropDown>
    </div>
  </div>
</template>

<script>
import dropDown from "./components/select";

export default {
  components: { dropDown },
  name: "app",
  data() {
    return {
      varenumList: [
        {
          dicCode:'gender',
          discription:'性别',
          params:[
            {
              value:'0',
              name:'男'
            },
            {
              value:'1',
              name:'女'
            },
            {
              value:'2',
              name:'男女'
            },
            {
              value:'3',
              name:'女女'
            },
            {
              value:'4',
              name:'其它'
            },
            {
              value:'5',
              name:'其它2'
            },
            {
              value:'6',
              name:'其它3'
            },
            {
              value:'7',
              name:'其它4'
            },
            {
              value:'8',
              name:'其它5'
            }
          ]
        },
        {
          dicCode:'priority',
          discription:'优先级',
          params:[
            {
              value:'0',
              name:'忽略'
            },
            {
              value:'1',
              name:'低'
            },
            {
              value:'2',
              name:'中'
            },
            {
              value:'3',
              name:'高'
            },
            {
              value:'4',
              name:'紧急'
            }
          ]
        }
      ],
      modelData:[],
      selectData: {
        // isSelect: '1', 0表格或1下拉框
        value: ["1","3"], //当前选中的
        dicCode: 'gender'
      },
      selectData2: {
        // isSelect: '1', 0表格或1下拉框
        value: "2", //当前选中的
        dicCode: 'priority'
      },
      selectData3: {
        value: "2", //当前选中的
        dicCode: 'priority'
      },
      selectData4: {
        value: ["2","3"], //当前选中的
        dicCode: 'gender'
      }
    };
  },
  beforeMount(){
    this.$store.dispatch('setVarenumList',this.varenumList);
  },
  mounted(){
    // console.log(this.modelData);
  }
};
</script>

<style>

.mid {
  width: 300px;
  margin-top: 5px;
  float: left;
}
</style>
