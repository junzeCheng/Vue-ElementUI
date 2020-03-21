<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容" clearable @clear="getGoodsList" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="searchGoods"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品列表 -->
      <el-table :data="goodsList" border stripe style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" ></el-table-column>
        <el-table-column prop="goods_number" label="商品数量" width="80px"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="110"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="80px"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="180">
          <template v-slot="scoped">
            {{scoped.row.add_time | dataFormat}}
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" width="140">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditGoodsDialog(scope.row.goods_id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteGoodsById(scope.row.goods_id)"
            ></el-button>
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
        background
      ></el-pagination>
      <!-- 编辑商品 -->
      <el-dialog
          title="编辑商品"
          :visible.sync="editGoodsVisible"
          width="50%"
          @close="editDialogClose()"
        >
          <el-form :model="editGoodsForm" :rules="editGoodsRules" ref="editGoodsRef" label-width="90px">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="editGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="editGoodsForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="editGoodsForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="editGoodsForm.goods_weight" type="number"></el-input>
            </el-form-item>
          </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editGoodsVisible = false">取 消</el-button>
          <el-button type="primary" @click="addGoods">确 定</el-button>
        </span>
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
      goodsList: [],
      total: 0,
      editGoodsVisible: false,
      editGoodsForm:{},
      editGoodsRules:{
        goods_name :[
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price :[
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_weight :[
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ],
        goods_number :[
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.goodsList = res.data.goods;
      this.total = res.data.total;
    },
    // 分页
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },
    handleCurrentChange(newPageNum) {
      this.queryInfo.pagenum = newPageNum;
      this.getGoodsList();
    },
    // 搜索商品
    searchGoods(){
      this.queryInfo.pagenum = 1
      this.getGoodsList()
    },
    editDialogClose(){
      this.$refs.editGoodsRef.resetFields();
    },
    //编辑商品
    async showEditGoodsDialog(id){
       const { data: res } = await this.$http.get("goods/" + id);
      if (res.meta.status != 200)
        return this.$message.error("查询商品信息失败");
      this.editGoodsForm = res.data;
      this.editGoodsVisible = true;
    },
    addGoods(){
      this.$refs.editGoodsRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "goods/" + this.editGoodsForm.goods_id,
          {
            goods_name: this.editGoodsForm.goods_name,
            goods_price: this.editGoodsForm.goods_price,
            goods_weight: this.editGoodsForm.goods_weight,
            goods_number: this.editGoodsForm.goods_number,
            goods_cat: this.editGoodsForm.goods_cat
          }
        );
        if (res.meta.status != 200) {
          return this.$message.error("修改分类信息失败");
        }
        this.$message.success("修改成功");
        this.editGoodsVisible = false;
        this.getGoodsList();
      });
    },
    // 删除商品
    async deleteGoodsById(goods_id){
      const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        if(confirmResult!=='confirm'){
          return this.$message.info('已取消删除!')
        }
        const {data:res} = await this.$http.delete(`goods/${goods_id}`)
        if(res.meta.status!=200){
          return this.$message.error('删除商品失败!')
        }
        this.$message.success("删除商品成功!")
        this.getGoodsList()
    },
    //添加商品
    goAddPage(){
      this.$router.push('goods/add')
    }
  }
};
</script>

<style>
</style>