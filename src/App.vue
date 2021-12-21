<template>
  <div id="app">
    <div class="slide-bar">
      <div class="logo">
        <img src="@/assets/img/logo.png" alt="">
      </div>
      <el-menu
        default-active="1"
        class="el-menu-vertical-demo"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
      >
        <template v-for="item in menuList">
          <el-menu-item :index="item.index" :key="item.index" @click="routerLink(item.name)">
            <i class="el-icon-document"></i>
            <span slot="title">{{ item.menuName }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
    <div class="main">
      <div class="top-bar">路路停车场管理系统</div>
      <div class="main-warp">
         <router-view />
      </div>
    </div>
  </div>
</template>
<script>
import data from '@/dataJson/pakingData.json'
import carInfo from '@/dataJson/carInfo.json'
export default {
  data() {
    return {
      menuList: [
        {
          menuName: "首页",
          index: '1',
          name: 'home'
        },
        {
          menuName: "车位列表",
          index: '2',
          name: 'placeList'
        },
        {
          menuName: "加入会员",
          index: '3',
          name: "joinMember"
        },
      ],
      index: '1'
    };
  },
  mounted() {
    console.log('--');
    console.log(this.$route.path);
    if (!localStorage.getItem("tableDate")){
      localStorage.setItem("tableDate", JSON.stringify(data.tableData));
    }
    if (!localStorage.getItem("allNumber")){
      localStorage.setItem("allNumber", JSON.stringify(carInfo.allNumber));
    }
  },
  methods: {
    routerLink(name) {
      // this.index = index;
      this.$router.push({name})
    }
  }
};
</script>
<style lang="less">
@import "assets/baseCss/normalize.css";
#app {
  background-color: #f0f0f0;
}
.el-menu {
  width: 200px;
  min-height: 100vh;
}
.main {
  margin-left: 95px;
}
.top-bar {
  height: 40px;
  display: flex;
  align-items: center;
  background-color: #ffffff;
  font-size: 18px;
  padding-left: 20px;
  justify-content: center;
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
}
.logo {
    background-color: rgb(84, 92, 100);
    height: 60px;
    position: relative;
    width: 200px;
    img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
    }
}
.main-warp {
  margin-left: 10px;
  margin-top: 10px;
  padding: 16px;
  box-sizing: border-box;
  background-color: #ffffff;
}
.slide-bar {
  position: fixed;
  height: 100vh;
}
</style>
