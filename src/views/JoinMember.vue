<template>
  <div class="main">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>加入会员</span>
      </div>
      <el-form
        :model="form"
        ref="form"
        :rules="rules"
        label-width="100px"
        :inline="false"
        size="normal"
      >
        <el-form-item label="用户名:" prop="userName">
          <el-input v-model="form.userName" size="small"></el-input>
        </el-form-item>
        <el-form-item label="手机号:" prop="userPhone">
          <el-input v-model="form.userPhone" size="small"></el-input>
        </el-form-item>
        <el-form-item label="车牌:" prop="userCar">
          <el-input v-model="form.userCar" size="small"></el-input>
        </el-form-item>
        <el-form-item label="办理日期:" prop="startTime">
          <el-input v-model="form.startTime" readonly size="small"></el-input>
        </el-form-item>
        <el-form-item label="选择套餐:">
          <el-select
            v-model="form.endTime"
            placeholder="请选择办理套餐"
            clearable
            filterable
          >
            <el-option
              v-for="item in packageList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择车位:" prop="id">
          <el-select v-model="form.id">
            <el-option
              v-for="item in memebrList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
              :disabled="item.isEmpty !== 0 ? true : false"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="submitForm"
            >立即创建</el-button
          >
          <el-button size="mini">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        userName: "",
        userPhone: "",
        userCar: "",
        startTime: this.$moment().format("YYYY-MM-DD HH:mm:ss"),
        endTime: 1,
        id: this.$route.query.id || null,
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
        startTime: [
          { required: true, message: "入住时间不能为空", trigger: "blur" },
        ],
        id: [
          { required: true, message: "必须选择一个车位", trigger: "change" },
        ],
      },
      memebrList: [],
      memebrOption: "",
      packageList: [
        {
          id: 1,
          label: "200/半年",
        },
        {
          id: 2,
          label: "350/年",
        },
      ],
      allNumber: {},
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      let arr = JSON.parse(localStorage.getItem("tableDate"));
      arr.forEach((item) => {
        let obj = {};
        if (item.type === 2) {
          obj.id = item.id;
          obj.label = item.id + "号车位";
          obj.isEmpty = item.isEmpty;
          console.log(obj);
          this.memebrList.push(obj);
        }
      });
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.onSubmit();
        } else {
          this.dialogVisible = true;
          this.$message.error("请根据提示正确的填写表单");
          return false;
        }
      });
    },
    onSubmit() {
      let arr = JSON.parse(localStorage.getItem("tableDate"));
      this.allNumber = JSON.parse(localStorage.getItem("allNumber"));
      let index = arr.findIndex((item) => item.id === this.form.id);
      if (this.form.endTime === 1) {
        let time = this.$moment()
          .add(6, "months")
          .format("YYYY-MM-DD HH:mm:ss");
        arr[index].endTime = time;
      } else {
        let time = this.$moment().add(1, "years").format("YYYY-MM-DD HH:mm:ss");
        arr[index].endTime = time;
      }
      arr[index].userName = this.form.userName;
      arr[index].userPhone = this.form.userPhone;
      arr[index].userCar = this.form.userCar;
      arr[index].startTime = this.form.startTime;
      arr[index].isEmpty = 1;
      ++this.allNumber.member;
      --this.allNumber.surpulsMember;
      localStorage.setItem("tableDate", JSON.stringify(arr));
      localStorage.setItem("allNumber", JSON.stringify(this.allNumber));
      this.form = {
        userName: "",
        userPhone: "",
        userCar: "",
        startTime: this.$moment().format("YYYY-MM-DD HH:mm:ss"),
        endTime: 1,
        id: null,
      };
      this.init();
      this.$message.success("添加成功");
      this.$router.push({ name: "home" });
    },
  },
};
</script>

<style ccope lang="less">
.el-form {
  .el-input {
    width: 600px;
  }
}
</style>