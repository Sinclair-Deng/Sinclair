<template>
  <div>
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0"
      @click="showDialog"
      >添加</el-button
    >
    <!-- 
      表格组件
      data: 表格组件将来要展示的数据————数组类型
      border: 给表格添加边框
      label: 显示标题
      width: 对应列的宽度
      align: 标题的对齐方式
      prop: 对应列内容的字段名
      注意1：elementUI当中的table组件，数据是以一列一列的形式展示的
    -->
    <el-table border style="width: 100%" :data="list">
      <el-table-column type="index" label="序号" width="80px" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="prop" label="品牌LOGO" width="width">
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button
            type="warning"
            size="mini"
            icon="el-icon-edit"
            @click="updateTrademark(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="deleteTradeMark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 
      分页器
      当前第几页、数据总条数、每一页展示条数、连续页码数
      layout: 实现分页器的布局
      pager-count：按钮的数量
    -->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout="prev, pager, next, jumper, ->, sizes, total"
      @current-change="currentChange"
      @size-change="sizeChange"
      :total="total"
      background
    >
      :pager-count="7">
    </el-pagination>

    <!-- 
      对话框  
      :visible.sync 控制对话框的显示与隐藏
      Form组件提供了表单验证的功能，只需要通过rules属性传入约定的验证规则，并将Form-Item的prop属性设置为需校验的字段名即可
    -->
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <!-- form表单 :model属性的作用是将表单的数据收集到对象身上，将来表单验证也需要这个属性 -->
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- 
            action：设置图片上传的地址
            :on-success 可以检测到图片上传成功，当图片上传成功，会执行一次
            :before-upload 可以在图片上传之前执行一次
           -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">
              只能上传jpg文件，且不超过2MB
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "TradeMark",
  data() {
    return {
      // 当前的页码
      page: 1,
      // 当前页数展示的数据个数
      limit: 3,
      // 总数据条数
      total: 0,
      // 列表展示的数据
      list: [],
      // 对话框显示与隐藏控制的属性
      dialogFormVisible: false,
      // 上传图片使用的属性
      imageUrl: "",
      // 品牌信息：对象身上的属性名称，不能瞎写，需要与后台对应
      tmForm: {
        tmName: "",
        logoUrl: "",
      },
      // 表单验证规则
      rules: {
        // 品牌名称的验证规则
        // required 必须要校验字段(与字段前的五角星有关)  message 提示信息  trigger 用户行为设置 (事件的设置: blur change)
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "change",
          },
        ],
        // 品牌LOGO的验证规则
        logoUrl: [
          { required: true, message: "请选择品牌图片", trigger: "change" },
        ],
      },
    };
  },
  mounted() {
    this.getPageList();
  },
  methods: {
    // 获取品牌列表的数据
    async getPageList() {
      const { page, limit } = this;
      // 获取品牌列表的接口
      let result = await this.$API.trademark.reqTradeMarkList(page, limit);
      if (result.code === 200) {
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    currentChange(pager) {
      this.page = pager;
      this.getPageList();
    },
    sizeChange(limits) {
      this.limit = limits;
      this.getPageList();
    },
    // 点击显示品牌对话框
    showDialog() {
      this.dialogFormVisible = true;
      // 清除数据
      this.tmForm = { tmName: "", logoUrl: "" };
    },
    // 点击修改品牌对话框
    updateTrademark(row) {
      // row 当前用户选中的品牌信息
      this.dialogFormVisible = true;
      // 将已有的品牌信息赋值给tmForm进行展示
      // 如果将服务器返回的品牌信息，直接赋值给tmForm进行展示，则意味着tmForm存储即为服务器返回的品牌信息。
      this.tmForm = { ...row };
    },
    // 图片上传成功的回调
    handleAvatarSuccess(res, file) {
      // res 上传成功之后返回前端数据
      // file 上传成功之后服务器返回前端数据
      // 收集品牌图片数据
      this.tmForm.logoUrl = res.data;
    },
    // 图片上传之前的回调
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 添加或修改品牌信息
    addOrUpdateTradeMark() {
      // 当全部验证字段通过，再去书写业务逻辑
      this.$refs.ruleForm.validate(async (success) => {
        // 如果全部字段校验成功
        if (success) {
          this.dialogFormVisible = false;
          // 发送请求
          let result = await this.$API.trademark.reqAddOrUpdateTradeMark(
            this.tmForm
          );
          if (result.code === 200) {
            // 弹出信息
            this.$message({
              type: "success",
              message: this.tmForm.id ? "修改品牌成功" : "添加品牌成功",
            });
            this.getPageList();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 删除品牌信息
    deleteTradeMark(row) {
      this.$confirm(`你确定删除${row.tmName}吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 当用户点击确定按钮时会触发
          let result = await this.$API.trademark.reqDeleteTradeMark(row.id);
          if (result.code === 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            // 再次获取品牌列表数据
            this.getPageList(this.list.length>1 ? this.page : this.page-1);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>