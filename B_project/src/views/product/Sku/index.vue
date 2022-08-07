<template>
  <div>
    <!-- 数据表格 -->
    <el-table border style="width: 100%" :data="records">
      <el-table-column align="center" type="index" label="序号" width="80px">
      </el-table-column>
      <el-table-column prop="skuName" label="名称" width="width">
      </el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width">
      </el-table-column>
      <el-table-column label="默认图片" width="150px">
        <template slot-scope="{ row, $index }">
          <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量" width="150px">
      </el-table-column>
      <el-table-column prop="price" label="价格" width="150px">
      </el-table-column>
      <el-table-column label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button
            type="info"
            icon="el-icon-bottom"
            size="mini"
            v-if="row.isSale == 0"
            @click="save(row)"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-top"
            size="mini"
            v-else
            @click="cancel(row)"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="edit"
          ></el-button>
          <el-button
            type="info"
            icon="el-icon-info"
            size="mini"
            @click="getSkuInfo(row)"
          ></el-button>
          <el-popconfirm title="确定删除吗？" @onConfirm="deleteSku(row)">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              slot="reference"
              style="margin-left:10px"
            ></el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      style="text-align: center"
      @current-change="getSkuList"
      @size-change="sizeChange"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      background
    >
      :pager-count="7">
    </el-pagination>
    <!-- 抽屉 -->
    <el-drawer :visible.sync="show" :show-close="false" size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <template>
            <el-tag
              type="success"
              v-for="attr in skuInfo.skuAttrValueList"
              :key="attr.id"
              style="margin-right: 10px"
              >{{ attr.attrId }}-{{ attr.valueId }}</el-tag
            >
          </template>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="400px">
            <el-carousel-item
              v-for="item in skuInfo.skuImageList"
              :key="item.id"
            >
              <img
                :src="item.imgUrl"
                style="height: 400px; padding-left: 120px"
              />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      page: 1,
      limit: 3,
      records: [],
      total: 0,
      // 存储SKU信息
      skuInfo: {},
      // 控制抽屉的显示与隐藏
      show: false,
    };
  },
  mounted() {
    // 获取sku列表
    this.getSkuList();
  },
  methods: {
    async getSkuList(pages = 1) {
      this.page = pages;
      const { page, limit } = this;
      // 发送请求
      let result = await this.$API.sku.reqSkuList(page, limit);
      if (result.code == 200) {
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },
    sizeChange(limit) {
      this.limit = limit;
      this.getSkuList();
    },
    // 上架回调
    async save(row) {
      let result = await this.$API.sku.reqSale(row.id);
      if (result.code == 200) {
        row.isSale = 1;
        this.$message({ type: "success", message: "上架成功" });
      }
    },
    // 下架回调
    async cancel(row) {
      let result = await this.$API.sku.reqCancel(row.id);
      if (result.code == 200) {
        row.isSale = 0;
        this.$message({ type: "success", message: "下架成功" });
      }
    },
    edit() {
      this.$message({ message: "正在开发中..." });
    },
    // 获取SKU详情的回调
    async getSkuInfo(row) {
      // 展示抽屉
      this.show = true;
      // 获取SKU数据
      let result = await this.$API.sku.reqSkuById(row.id);
      if (result.code == 200) {
        this.skuInfo = result.data;
      }
    },
    // 删除SKU
    async deleteSku(row){
      let result = await this.$API.sku.reqDeleteSku(row.id);
      if(result.code==200){
        this.$message({type:'success',message:'删除成功'});
        // 如果SPU的个数大于1，删除之后停留在当前，否则回到上一页
        this.getSkuList(this.records.length > 1 ? this.page : this.page - 1);
      }
    }
  },
};
</script>

<style>
.el-carousel__item {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__button {
  width: 10px;
  height: 10px;
  background-color: red;
  border-radius: 50%;
}
</style>

<style scoped>
.el-row .el-col-5 {
  font-size: 20px;
  text-align: right;
}
.el-col {
  margin: 10px;
}
</style>