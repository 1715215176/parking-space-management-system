<template>
  <div class="main">
    <div class="echars-warp"></div>
    <div class="search-warp">
      <el-select
        v-model="typeValue"
        placeholder="请选择车位类型"
        clearable
        size="small"
      >
        <el-option
          v-for="item in typeOption"
          :key="item.value"
          :label="item.text"
          :value="item.value"
        >
        </el-option>
      </el-select>

      <el-input
        class="w300"
        v-model="userPhone"
        placeholder="请输入车主手机号"
        size="small"
        clearable
      ></el-input>
      <el-button type="primary" size="mini" @click="search">查询</el-button>
      <el-button type="" size="mini" @click="reset">重置</el-button>
      <el-button type="success" size="mini" @click="init('new')"
        >刷新</el-button
      >
    </div>

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
          <el-dialog
            title="停车信息"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
          >
            <el-form
              :model="userStopCarInfo"
              ref="form"
              :rules="rules"
              label-width="100px"
              :inline="false"
              size="normal"
            >
              <el-form-item label="用户名:" prop="userName">
                <el-input
                  v-model="userStopCarInfo.userName"
                  size="small"
                ></el-input>
              </el-form-item>
              <el-form-item label="手机号:" prop="userPhone">
                <el-input
                  v-model="userStopCarInfo.userPhone"
                  size="small"
                ></el-input>
              </el-form-item>
              <el-form-item label="车牌号:" prop="userCar">
                <el-input
                  v-model="userStopCarInfo.userCar"
                  size="small"
                ></el-input>
              </el-form-item>
              <el-form-item label="停车时间:" prop="stopCarTime">
                <el-input
                  v-model="userStopCarInfo.stopCarTime"
                  disabled
                ></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false" size="mini"
                >取 消</el-button
              >
              <el-button type="primary" @click="submitForm" size="mini"
                >确 定</el-button
              >
            </span>
          </el-dialog>
          <el-dialog
            title="结算"
            :visible.sync="centerDialogVisible"
            width="30%"
            center
          >
            <span
              >该车主本次一共停车{{ totalTime }},需要收取{{ money }}元。</span
            >
            <span slot="footer" class="dialog-footer">
              <el-button @click="centerDialogVisible = false" size="mini"
                >取 消</el-button
              >
              <el-button type="primary" @click="confirmCharge()" size="mini"
                >确 定</el-button
              >
            </span>
          </el-dialog>
          <el-button
            v-if="!scope.row.isEmpty && scope.row.type !== 2"
            type="primary"
            size="mini"
            @click="goStopCar(scope.row)"
            >去停车</el-button
          >
          <el-button
            v-else-if="scope.row.type === 2 && scope.row.isEmpty === 0"
            type="danger"
            size="mini"
            @click="link(scope.row.id)"
            >去办理</el-button
          >
          <el-button
            v-else-if="scope.row.type === 2 && scope.row.isEmpty === 1"
            type="info"
            size="mini"
            >没到期</el-button
          >
          <el-button
            v-else
            type="danger"
            size="mini"
            @click="settlement(scope.row)"
            >结算</el-button
          >
        </template>
      </el-table-column>
      <el-table-column label="设置" min-width="120">
        <template slot-scope="scope">
          <el-button size="mini" @click="changeType(scope.row.id)">{{
            scope.row.type === 1 ? "设置为固定车位" : "设置为普通车位"
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryParams.pageIndex"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      class="page"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      typeOption: [
        {
          value: 2,
          text: "固定车位",
        },
        {
          value: 1,
          text: "自由车位",
        },
      ],
      typeValue: 1,
      userPhone: "",
      dialogVisible: false,
      userStopCarInfo: {
        userName: "",
        userPhone: "",
        userCar: "",
        stopCarTime: "",
      },
      rules: {
        userName: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
        ],
        userPhone: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
        ],
        userCar: [
          { required: true, message: "车牌号不能为空", trigger: "blur" },
        ],
        stopCarTime: [
          { required: true, message: "入住时间不能为空", trigger: "blur" },
        ],
      },
      id: "", // 当前车位的id
      type: "", // 当前车位的类型
      allNumber: {}, // 当前全部的车位数据
      centerDialogVisible: false, // 结算弹框
      totalTime: "", // 总共的停车时长
      money: "", // 最终的收费价钱
      total: 0, // 总条数
      queryParams: {
        pageSize: 10,
        pageIndex: 1,
      },
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    /** 表头设置颜色 */
    handSytle() {
      return {
        background: "#808e9b",
        color: "#fff",
      };
    },
    /**
     *  去停车
     */
    goStopCar(row) {
      this.dialogVisible = true;
      this.id = row.id;
      this.type = row.type;
      console.log(this.$moment().format("YYYY-MM-DD HH:mm:ss"));
      this.userStopCarInfo.stopCarTime = this.$moment().format(
        "YYYY-MM-DD HH:mm:ss"
      );
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.confirm();
        } else {
          this.dialogVisible = true;
          this.$message.error("请根据提示正确的填写表单");
          return false;
        }
      });
    },
    confirm() {
      this.dialogVisible = false;
      const index = this.tableData.findIndex((item) => item.id === this.id);
      this.tableData[index].userName = this.userStopCarInfo.userName;
      this.tableData[index].userPhone = this.userStopCarInfo.userPhone;
      this.tableData[index].userCar = this.userStopCarInfo.userCar;
      this.tableData[index].stopCarTime = this.userStopCarInfo.stopCarTime;
      this.tableData[index].isEmpty = 1;
      if (this.type == 1) {
        ++this.allNumber.nommon;
        --this.allNumber.surpuls;
      } else {
        ++this.allNumber.member;
        --this.allNumber.surpulsMember;
      }
      let arr = JSON.parse(localStorage.getItem("tableDate"));
      let arrIndex = arr.findIndex((item) => item.id === this.id);
      arr[arrIndex] = this.tableData[index];
      localStorage.setItem("tableDate", JSON.stringify(arr));
      localStorage.setItem("allNumber", JSON.stringify(this.allNumber));
      (this.userStopCarInfo = {
        userName: "",
        userPhone: "",
        userCar: "",
        stopCarTime: this.$moment().format("YYYY-DD-MM hh:mm:ss"),
      }),
        this.init();
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
        } else if (item.type === 1) {
          item.dueDate = "非会员车位";
        } else {
          item.dueDate = "待办理";
        }
      });
      this.total = arr.length;
      this.tableData = arr.slice(
        (this.queryParams.pageIndex - 1) * 10,
        this.queryParams.pageSize + (this.queryParams.pageIndex - 1) * 10
      );
    },
    /**
     *  去结算
     */
    settlement(row) {
      const start = row.stopCarTime;
      const end = this.$moment().format("YYYY-MM-DD HH:mm:ss");
      this.totalTime = this.DateDifference(start, end);
      this.centerDialogVisible = true;
      this.id = row.id;
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
    },
    /**
     *  结算
     */
    confirmCharge() {
      const index = this.tableData.findIndex((item) => item.id === this.id);
      this.tableData[index].userName = "";
      this.tableData[index].userPhone = "";
      this.tableData[index].userCar = "";
      this.tableData[index].stopCarTime = "";
      this.tableData[index].isEmpty = 0;
      if (this.type === 1) {
        --this.allNumber.nommon;
        ++this.allNumber.surpuls;
      }
      let arr = JSON.parse(localStorage.getItem("tableDate"));
      let arrIndex = arr.findIndex((item) => item.id === this.id);
      arr[arrIndex] = this.tableData[index];
      localStorage.setItem("tableDate", JSON.stringify(arr));
      localStorage.setItem("allNumber", JSON.stringify(this.allNumber));
      this.init();
      this.centerDialogVisible = false;
    },
    handleSizeChange(val) {
      this.queryParams.pageSize = val;
      this.init();
    },
    handleCurrentChange(val) {
      this.queryParams.pageIndex = val;
      this.init();
    },
    /**
     *  查询功能更
     */
    search() {
      let arr = JSON.parse(localStorage.getItem("tableDate"));
      this.tableData = [];
      arr.forEach((item) => {
        if (item.type === this.typeValue && item.userPhone === this.userPhone) {
          this.tableData.push(item);
        }
      });
    },
    /**
     *  重置
     */
    reset() {
      this.queryParams.pageSize = 10;
      this.queryParams.pageIndex = 1;
      this.typeValue = 1;
      this.userPhone = "";
      this.init();
    },
    /**
     *
     * @param {*} id
     */
    changeType(id) {
      let arr = JSON.parse(localStorage.getItem("tableDate"));
      let allNumber = JSON.parse(localStorage.getItem("allNumber"));
      const index = arr.findIndex((item) => item.id === id);
      console.log(arr[index].isEmpty);
      if (arr[index].isEmpty === 1) {
        this.$message.error("该车位正在占用，请稍后再试");
        return;
      }
      if (arr[index].type === 1) {
        arr[index].type = 2;
        ++allNumber.surpulsMember;
        --allNumber.surpuls;
      } else {
        arr[index].type = 1;
        --allNumber.surpulsMember;
        ++allNumber.surpuls;
      }
      localStorage.setItem("tableDate", JSON.stringify(arr));
      localStorage.setItem("allNumber", JSON.stringify(allNumber));
      this.init();
      this.$message.success(`已将车位${id}设置为${arr[index].type === 1 ? '自由车位' : '固定车位'}`)
    },
    link(id) {
      this.$router.push({name: 'joinMember',query:{id}})
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
.page {
  text-align: right;
  margin-top: 10px;
}
</style>