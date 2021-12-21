<template>
  <div class="main">
    <div class="echars-warp">
      <div id="parkingLot"></div>
      <div id="member"></div>
    </div>
    <div class="search-warp"><i class="el-icon-s-custom"></i> 会员列表</div>

    <el-table :data="tableData" stripe :header-cell-style="handSytle">
      <el-table-column label="车位" min-width="60">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="车位类型" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.type === 1 ? "自由车位" : "固定车位" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否空余" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.isEmpty === 0 ? "空余" : "已使用" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="停车用户" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.userPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="车牌" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.userCar }}</span>
        </template>
      </el-table-column>
      <el-table-column label="停车时间/办理日期" min-width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.stopCarTime || scope.row.startTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="价钱" min-width="120">
        <template slot-scope="scope">
          <span class="price">{{
            scope.row.type === 1 ? scope.row.price : "200/半年"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="会员剩余时间" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.dueDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="120">
        <template slot-scope="scope">
          <el-button type="info" size="mini">{{
            scope.row.dueDate != '0天' ? "没到期" : ""
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    drawParkingLot() {
      let parkingLot = this.$echarts.init(
        document.querySelector("#parkingLot")
      );
      parkingLot.setOption({
        title: {
          text: "今日车位使用情况",
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: "车位",
            type: "pie",
            radius: "50%",
            data: [
              { value: this.allNumber.member, name: "已有会员车位" },
              { value: this.allNumber.surpulsMember, name: "剩余会员车位" },
              { value: this.allNumber.nommon, name: "普通车位" },
              { value: this.allNumber.surpuls, name: "剩余普通车位" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      });
    },
    drawMemeber() {
      let member = this.$echarts.init(document.querySelector("#member"));
      member.setOption({
        title: {
          text: "固定车位",
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: "车位",
            type: "pie",
            radius: "50%",
            data: [
              { value: this.allNumber.member, name: "已有固定车位" },
              { value: this.allNumber.surpulsMember, name: "剩余固定车位" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      });
    },
    /** 表头设置颜色 */
    handSytle() {
      return {
        background: "#808e9b",
        color: "#fff",
      };
    },
    /**
     *  初始化页面数据
     */
    init(type) {
      if (type === "new") {
        this.$message.success("刷新成功");
      }
      let arr = JSON.parse(localStorage.getItem("tableDate"));
      this.allNumber = JSON.parse(localStorage.getItem("allNumber"));
      arr.forEach((item) => {
        if (item.endTime) {
          let day = this.DateDifference(
            this.$moment().format("YYYY-MM-DD HH:mm:ss"),
            item.endTime
          );
          day = day.split("天")[0] + "天";
          item.dueDate = day;
          // 会员过期处理
          if (day <=0 ) {
            item.isEmpty= 0;
            item.userName= '';
            item.userPhone = '';
            item.userCar = '';
            item.dueDate = '';
            item.startTime= '';
            item.endTime = '';
          }
        }
      });
      arr.map((item) => {
        if (item.type === 2 && item.isEmpty !== 0) {
          this.tableData.push(item);
        }
      });
      this.drawMemeber();
      this.drawParkingLot();
      localStorage.setItem("tableDate", JSON.stringify(arr));
    },
    /**
     *
     *  计算停车总共时长
     */
    DateDifference(faultDate, completeTime) {
      // console.log('---');
      var stime = new Date(faultDate).getTime();
      var etime = new Date(completeTime).getTime();
      var usedTime = etime - stime; //两个时间戳相差的毫秒数
      var days = Math.floor(usedTime / (24 * 3600 * 1000));
      var leave1 = usedTime % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
      var hours = Math.floor(leave1 / (3600 * 1000));
      var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
      var minutes = Math.floor(leave2 / (60 * 1000));
      var time = days + "天" + hours + "时" + minutes + "分";
      if (minutes === 0) {
        this.money = 100 * days + hours * 5;
      } else {
        this.money = 100 * days + hours * 5 + 5;
      }
      return time;
    }
  },
};
</script>

<style lang="less" scoped>
.echars-warp {
  display: flex;
}
#parkingLot {
  flex: 1;
  width: 0;
  height: 500px;
}
#member {
  flex: 1;
  height: 500px;
}
.search-warp {
  font-family: "Helvetica Neue";
  margin: 10px;
  font-weight: 600;
  // display: flex;
  // margin: 10px 0;
}
.w300 {
  width: 300px;
  margin-right: 10px;
  margin-left: 10px;
}
.price {
  color: rgb(255, 0, 0);
  font-weight: 600;
}
</style>