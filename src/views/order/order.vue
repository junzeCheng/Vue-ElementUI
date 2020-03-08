<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col :span="10">
          <el-input placeholder="请输入内容" clearable @clear="getOrderList" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- table表格 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number" width="240"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template v-slot="scoped">
            <el-tag type="danger" v-if="scoped.row.pay_status!='1'">未付款</el-tag>
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template v-slot="scoped">{{scoped.row.create_time | dataFormat}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scoped">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="showBox(scoped.row)"></el-button>
            <el-button type="success" size="mini" icon="el-icon-location" @click="showProgressBox"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <!-- 修改地址对话框 -->
      <el-dialog title="修改地址" :visible.sync="dialogVisible" width="50%">
        <el-form
          :model="addressForm"
          :rules="addressFormRules"
          ref="addressFormRef"
          label-width="100px"
        >
          <el-form-item label="省市区/县" prop="address1">
            <el-input v-model="addressForm.address1"></el-input>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
            <el-input v-model="addressForm.address2"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 进度对话框 -->
      <el-dialog title="物流信息" :visible.sync="progressVisible" width="50%">
        <el-timeline class="block">
          <el-timeline-item
            v-for="(activity, index) in progressInfo"
            :key="index"
            :timestamp="activity.time"
          >{{activity.context}}</el-timeline-item>
        </el-timeline>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderList: [],
      dialogVisible: false,
      progressVisible: false,
      addressForm: {
        address1: [],
        address2: ""
      },
      addressFormRules: {
        address1: [
          { required: true, message: "请输入省市区县", trigger: "blur" }
        ],
        address2: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ]
      },
      progressInfo: {}
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo
      });
      if (res.meta.status != 200) {
        return this.$message.error("获取商品列表失败");
      }
      this.total = res.data.total;
      this.orderList = res.data.goods;
    },
    handleSizeChange(newpageSize) {
      this.queryInfo.pagesize = newpageSize;
      this.getOrderList();
    },
    handleCurrentChange(newpageNum) {
      this.queryInfo.pagenum = newpageNum;
      this.getOrderList();
    },
    showBox() {
      this.dialogVisible = true;
    },
    async showProgressBox() {
      const { data: res } = await this.$http.get("/kuaidi/804909574412544580");
      if (res.meta.status != 200) {
        return this.$message.error("获取物流信息失败");
      }
      this.progressInfo = res.data;
      this.progressVisible = true;
    }
  }
};
</script>

<style lang="less" scoped>
</style>