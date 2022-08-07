<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :show="scene != 0"
      ></CategorySelect>
    </el-card>
    <el-card>
      <!-- 三部分进行切换 -->
      <div v-show="scene == 0">
        <!-- 展示SPU列表的结构 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addSpu"
          >添加SPU</el-button
        >
        <el-table border style="width: 100%" :data="records">
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <HintButton
                type="success"
                size="mini"
                icon="el-icon-plus"
                title="添加sku"
                @click="addSku(row)"
              ></HintButton>
              <HintButton
                type="warning"
                size="mini"
                icon="el-icon-edit"
                title="修改spu"
                @click="updateSpu(row)"
              ></HintButton>
              <HintButton
                type="info"
                size="mini"
                icon="el-icon-info"
                title="查看当前spu的全部sku列表"
                @click="handler(row)"
              ></HintButton>
              <el-popconfirm
                title="确定删除吗？"
                @onConfirm="deleteSpu(row)"
              >
                <HintButton
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  title="删除spu"
                  slot="reference"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          style="text-align: center"
          @size-change="sizeChange"
          @current-change="getSpuList"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout="prev, pager, next, jumper, ->, sizes, total"
          :total="total"
          background
        >
          :pager-count="7">
        </el-pagination>
      </div>
      <SpuForm
        v-show="scene == 1"
        @changeScene="changeScene"
        ref="spu"
      ></SpuForm>
      <SkuForm
        v-show="scene == 2"
        ref="sku"
        @changeScenes="changeScenes"
      ></SkuForm>
    </el-card>
    <el-dialog
      :title="`${spu.spuName}的sku列表`"
      :visible.sync="dialogTableVisible"
      :before-close="close"
    >
      <el-table :data="skuList" border style="width: 100%" v-loading="loading">
        <el-table-column prop="skuName" label="名称" width="width">
        </el-table-column>
        <el-table-column prop="price" label="价格" width="width">
        </el-table-column>
        <el-table-column prop="weight" label="重量" width="width">
        </el-table-column>
        <el-table-column label="默认图片" width="width">
          <template slot-scope="{ row, $index }">
            <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SkuForm from "./SkuForm";
import SpuForm from "./SpuForm";
export default {
  name: "Spu",
  components: { SkuForm, SpuForm },
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      page: 1,
      limit: 3,
      records: [],
      total: 0,
      scene: 0, // 0代表展示SPU列表数据  1代表添加|修改SPU数据  2代表添加SKU数据
      // 控制sku列表信息的显示与隐藏
      dialogTableVisible: false,
      spu: {},
      // 存储SKU列表的数据
      skuList: [],
      loading: true
    };
  },
  methods: {
    // 自定义事件的回调
    getCategoryId({ categoryId, level }) {
      // 区分三级分类对应的Id，以及父组件进行存储
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        // 发送请求获取Spu数据
        this.getSpuList();
      }
    },
    // 获取Spu列表数据的方法
    async getSpuList(pages = 1) {
      this.page = pages;
      const { page, limit, category3Id } = this;
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      if (result.code == 200) {
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },
    // 每页展示的数据发生变化时的回调
    sizeChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },
    // 添加Spu按钮的回调
    addSpu() {
      this.scene = 1;
      // 通知子组件发送请求
      this.$refs.spu.addSpuData(this.category3Id);
    },
    // 修改Spu
    updateSpu(row) {
      this.scene = 1;
      // 获取子组件SpuForm
      // 在父组件中可以通过$refs|$children获取子组件，进而操作子组件的数据与方法
      this.$refs.spu.initSpuData(row);
    },
    // 自定义事件的回调
    changeScene({ scene, flag }) {
      // flag这个参数是为了区分保存按钮是添加还是修改
      // 切换场景
      this.scene = scene;
      // 子组件通知父组件切换场景之后，需要再次获取SPU列表数据
      if (flag == "修改") {
        this.getSpuList(this.page);
      } else {
        this.getSpuList();
      }
    },
    // 删除按钮的回调
    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id);
      if (result.code == 200) {
        this.$message({ type: "success", message: "删除成功" });
        // 如果SPU的个数大于1，删除之后停留在当前，否则回到上一页
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1);
      }
    },
    // 添加Sku回调
    addSku(row) {
      this.scene = 2;
      // 父组件调用子组件的方法，让子组件发送三个请求
      this.$refs.sku.getData(this.category1Id, this.category2Id, row);
    },
    // skuForm通知父组件修改场景
    changeScenes(scene) {
      this.scene = scene;
    },
    // 查看SKU信息按钮的回调
    async handler(spu) {
      // 点击按钮对话框可见
      this.dialogTableVisible = true;
      // 保存spu信息
      this.spu = spu;
      // 获取SKU的列表数据进行展示
      let result = await this.$API.spu.reqSkuList(spu.id);
      if (result.code == 200) {
        this.skuList = result.data;
        this.loading = false;
      }
    },
    // 关闭对话框的回调
    close(done){
      // 开启loading
      this.loading = true;
      // 清除上次的列表数据
      this.skuList = [];
      // 关闭对话框
      done();
    }
  },
};
</script>

<style>
</style>