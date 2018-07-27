<template>
<!-- 单选 -->
  <div class="dropdown" v-if="isSelect">
    <div class="dropdown-header" :class="{dropdownShow:showData}" @click.stop="showDataList" ref="dropdownHeader">
      <i :class="{rotate:showData}" class="iconSanjiao"></i>
      <p class="dropdown-text dropdown-selected" :class="{isColor:selectSelection}">{{msg}}</p>
    </div>
    <collapse-transition>
    <div class="dorpdown-con" v-if="showData">
      <ul class="dropdown-select">
        <li class="item" v-for="(item, index) in dataList.params" 
          :class="{liactive:selectData.value==item.value}"
          @click.stop="select(item.name, item.value)">{{item.name}}</li>
      </ul>
    </div>
    </collapse-transition>
  </div>
  <!-- 文本 -->
  <div v-else-if="isText">
    <span>{{msg}}</span>
  </div>
  <!-- 多选 -->
  <div v-else-if="multiple && !isTile" class="dropdown">
    <div class="dropdown-header" :class="{dropdownShow:showData}" @click.stop="showDataList" ref="dropdownHeader">
      <i :class="{rotate:showData}" class="iconSanjiao"></i>
      <div class="m-dropdown-text dropdown-selected" :class="{isColor:selectSelection}">
        <div class="m-msg" v-for="(item, index) in mMsg">
          <span>{{item}}</span>
          <i class="iconfont icon-cuo iconDel" @click.stop="iconDel(index)"></i>
        </div>
      </div>
    </div>
    <collapse-transition>
    <div class="dorpdown-con" v-if="showData">
      <ul class="dropdown-select">
        <li class="item" v-for="(item, index) in dataList.params" 
          :class="{mliactive:mMsg.indexOf(item.name) != '-1'}"
          @click.stop="mSelect(item.name, item.value)">{{item.name}}
          <i v-if="mMsg.indexOf(item.name) != '-1'" class="iconfont icon-iconfontcheck iconRight"></i>
        </li>
      </ul>
    </div>
    </collapse-transition>
  </div> 
  <!-- 单选平铺 -->
  <div class="dropdown tile" v-else-if="isTile && !multiple" :class="{tileMore:tileMore}">
    <div class="t-box t-btn" @click.stop="tBtn" v-if="paramsLength >5">更多</div>
    <div class="t-title">{{dataList.discription}}:</div>
    <div class="t-box" v-for="(item,index) in dataList.params" 
      :class="{tileActive:selectData.value==item.value}"
      @click.stop="tile(item.name,item.value)">{{item.name}}</div>
  </div>
  <!-- 多选平铺 -->
  <div class="dropdown tile" v-else-if="isTile && multiple" :class="{tileMore:tileMore}">
    <div class="t-box t-btn" @click.stop="tBtn" v-show="paramsLength >5">更多</div>
    <div class="t-title">{{dataList.discription}}:</div>
    <div class="t-box" v-for="(item,index) in dataList.params" 
      :class="{tileActive:mMsg.indexOf(item.name) != '-1'}"
      @click.stop="mSelect(item.name,item.value)">{{item.name}}</div>
  </div> 
</template>
<script>
import collapseTransition from "./CollapseTransition";
export default {
  components: { collapseTransition },
  data() {
    return {
      dataList: [],
      msg: "",
      mMsg: [], //多选
      showData: false, //下拉隐藏状态
      selectSelection: false, //选中的颜色
      tileMore: true, //平铺更多按键
      paramsLength:0
    };
  },
  props: {
    selectData: {
      type: Object,
      default: function() {
        return {
          isSelect: "1", //0表格或1下拉框
          value: "0", //当前选中的
          dicCode: "gender"
        };
      }
    },
    multiple: {
      type: Boolean,
      default: false
    },
    isSelect: {
      type: Boolean,
      default: false
    },
    isText: {
      type: Boolean,
      default: false
    },
    isTile: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    let self = this;
    this.$store.getters.getVarenumList.forEach(function(v, i) {
      if (self.selectData.dicCode == v.dicCode) {
        self.dataList = v;
        self.paramsLength = v.params.length;
        debugger
        v.params.forEach(function(v2, i2) {
          if (self.multiple || (self.isTile && self.multiple)) {
          // 多选下拉
            self.selectData.value.forEach(function(v3) {
              if (v2.value == v3) {
                self.mMsg.push(v2.name);
              }
            });
            self.$emit("input", self.selectData.value);
          }else if(self.isTile && !self.multiple){
          // 单选平铺
            if (v2.value == self.selectData.value) {
              self.msg = v2.name;
              self.$emit("input", v2.value);
            }
          }else {
          // 单选下拉或文本
            if (v2.value == self.selectData.value) {
              self.msg = v2.name;
              self.$emit("input", v2.value);
            }
          }
        });
      }
    });
    document.addEventListener("click", e => {
      e.stopPropagation();
      if (self.showData == true) {
        self.showData = !self.showData;
      }
      self.selectSelection = false;
    });
  },
  methods: {
    showDataList: function() {
      var self = this;
      let dn = document.querySelectorAll(".dropdownShow");
      [].forEach.call(dn, function(div) {
        if (div !== self.$refs.dropdownHeader) {
          div.click();
        }
      });
      this.showData = !this.showData;
      this.selectSelection = true;
    },
    select: function(item, index) {
      this.selectData.value = index;
      this.msg = item;
      this.showData = !this.showData;
      this.$emit("input", index);
    },
    mSelect: function(item, index) {
      let self = this,
        flag = this.mMsg.indexOf(item);
      if (flag == -1) {
        this.mMsg.push(item);
        this.selectData.value.push(index);
        self.$emit("input", self.selectData.value);
      } else {
        this.mMsg.splice(flag, 1);
        this.selectData.value.splice(flag, 1);
        self.$emit("input", self.selectData.value);
      }
    },
    iconDel: function(index) {
      let self = this;
      this.mMsg.splice(index, 1);
      this.selectData.value.splice(index, 1);
      self.$emit("input", self.selectData.value);
    },
    tile: function(item, index) {
      this.selectData.value = index;
      this.$emit("input", index);
    },
    tBtn: function(){
      this.tileMore = !this.tileMore;
    }
  }
};
</script>
<style>
.dropdown li,
.dropdown p,
.dropdown ul {
  margin: 0;
  padding: 0;
}
.dropdown ul {
  list-style: none;
}
.dropdown-text {
  overflow: hvalueden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.dropdown {
  background-color: #fff;
  position: relative;
  width: 100%;
  height: auto;
  box-sizing: border-box;
}
.dropdown-header .dropdown-text {
  box-sizing: border-box;
  width: 100%;
  padding-right: 35px;
  padding-left: 10px;
  color: #495060;
  height: 32px;
  line-height: 32px;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #dddee1;
  transition: all 0.2s ease-in-out;
  white-space: pre-line;
}

.dropdown-header p:hover {
  border-color: #57a3f3;
}
.dorpdown-con {
  position: absolute;
  left: 0;
  z-index: 1;
  width: 100%;
  height: auto;
  max-height: 200px;
  line-height: 30px;
  overflow-y: auto;
  overflow-x: hvalueden;
  background-color: #fff;
  box-sizing: border-box;
  margin: 5px 0;
  padding: 5px 0;
  border-radius: 4px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
}
.dropdown-select li {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  height: 30px;
  padding-left: 10px;
  padding-right: 10px;
  white-space: nowrap;
  overflow: hvalueden;
  text-overflow: ellipsis;
  color: #495060;
}
.dropdown-select li:hover {
  background: #f3f3f3;
}
.dropdown-header {
  position: relative;
}
.dropdown-header .iconSanjiao {
  position: absolute;
  right: 13px;
  top: 50%;
  margin-top: -6px;
}
.dropdown-header .rotate {
  transform: rotate(90deg);
  -ms-transform: rotate(90deg);
  -moz-transform: rotate(90deg);
  -webkit-transform: rotate(90deg);
  transition: all 0.5s;
}
.dropdown-select li.liactive {
  background: rgba(40, 123, 211, 0.91);
  color: #fff;
}
.iconSanjiao {
  height: 0px;
  width: 0px;
  border-top: 6px solid transparent;
  border-right: 6px solid #80848f;
  border-bottom: 6px solid transparent;
  transform: rotate(-90deg);
  transition: all 0.5s;
}

.dropdown-header .m-dropdown-text {
  box-sizing: border-box;
  width: 100%;
  padding-right: 35px;
  padding-left: 10px;
  color: #495060;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #dddee1;
  transition: all 0.2s ease-in-out;
  white-space: pre-line;
}
.dropdown-header .isColor {
  border-color: #57a3f3;
  outline: 0;
  box-shadow: 0 0 0 2px rgba(45, 140, 240, 0.2);
}
.iconDel {
  position: relative;
  top: 2px;
  color: #666;
}
.m-msg {
  display: inline-block;
  line-height: 21px;
  margin: 3px 4px 3px 0;
  padding: 0 8px;
  border: 1px solid #e9eaec;
  border-radius: 3px;
  background: #f7f7f7;
  font-size: 12px;
  vertical-align: middle;
  opacity: 1;
  overflow: hidden;
  cursor: pointer;
  color: #495060;
}
.dropdown-select .mliactive {
  color: rgba(45, 140, 240, 0.9);
}
.iconRight {
  color: rgba(45, 140, 240, 0.9);
  position: absolute;
  right: 13px;
}
.t-box {
  display: inline-block;
  line-height: 21px;
  margin: 3px 4px 3px 0;
  padding: 0 8px;
  border: 1px solid #e9eaec;
  border-radius: 3px;
  background: #f7f7f7;
  font-size: 12px;
  vertical-align: middle;
  opacity: 1;
  overflow: hidden;
  cursor: pointer;
  color: #495060;
}
.tile {
  position: relative;
      white-space: pre-line;
    transition: all .5s ease-in .1s;
    padding-right: 45px;
}
.tileActive {
  background: rgba(40, 123, 211, 0.91);
  color: #fff;
}
.t-title {
  display: inline-block;
}
.t-btn {
    position: absolute;
    top: 0;
    right: 0;
    background: #88F6C9;
    color: #fff;
    margin-right: 0;
}
.tileMore {
    overflow: hidden;
    height: 29px;
}
</style>

