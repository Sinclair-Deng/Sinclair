<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addAttr"
          >添加属性</el-button
        >
        <!-- 表格：展示平台属性 -->
        <el-table :data="attrList" border stripe>
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150px">
          </el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{ row, $index }">
              <el-tag
                type="success"
                v-for="attrValue in row.attrValueList"
                :key="attrValue.id"
                style="margin: 0 20px"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150px">
            <template slot-scope="{ row, $index }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性|修改属性的结构 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!attrInfo.attrName"
          >添加属性值</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table
          border
          style="width: 100%; margin: 20px 0"
          :data="attrInfo.attrValueList"
        >
          <el-table-column
            align="center"
            label="序号"
            type="index"
            width="80px"
          >
          </el-table-column>
          <el-table-column label="属性值名称" prop="prop" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 这里的结构需要input与span来回切换 -->
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                size="mini"
                v-if="row.flag"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
                :ref="$index"
              ></el-input>
              <span
                v-else
                @click="toEdit(row, $index)"
                style="display: block"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="prop" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 气泡确认框 -->
              <el-popconfirm
                :title="`确定删除${row.valueName}吗?`"
                @onConfirm="deleteAttrValue($index)"
              >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="addOrUpdateAttr" :disabled="attrInfo.attrValueList.length<1">保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 按需引入lodash中的深拷贝
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      // 接收平台属性的数据
      attrList: [],
      // 控制table表格的显示与隐藏
      isShowTable: true,
      // 收集新增属性 | 修改属性
      attrInfo: {
        attrName: "", // 属性名
        attrValueList: [], // 属性值，由于属性值可以有多个，因此用数组，每一个属性值都是一个对象
        categoryId: 0, // 三级分类的Id
        categoryLevel: 3, // 服务器也需要区分几级Id
      },
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
        // 发送请求获取平台的属性数据
        this.getAttrList();
      }
    },
    // 获取平台属性的数据
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code === 200) {
        this.attrList = result.data;
      }
    },
    // 添加属性值的回调
    addAttrValue() {
      // 向属性值的数组中添加元素
      // attrId:是对应的属性Id，目前我们是添加属性的操作，还没有对应的Id
      // valueName:相应的属性值的名称
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id, // 对于修改每一个属性的时候，可以在已有的属性值基础上新增新的属性值(新增属性值的时候，需要把已有的属性的id带上)
        valueName: "",
        flag: true, // flag属性，给每个属性值添加一个标记flag，用户切换查看与编辑模式(每一个属性值都可以控制自己的模式切换)
      });
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    // 添加属性按钮的回调函数
    addAttr() {
      // 切换table的显示与隐藏
      this.isShowTable = false;
      // 清除数据
      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3,
      };
    },
    // 修改属性
    updateAttr(row) {
      this.isShowTable = false;
      // 将选中的属性赋值给attrInfo
      // 由于数据结构中存在对象里面套数组，数组里面又套对象，因此需要使用深拷贝解决此类问题
      // 深拷贝，浅拷贝在面试的时候出现频率很高，切记达到手写深拷贝与浅拷贝
      this.attrInfo = cloneDeep(row);
      // 在修改某一个属性值的时候，将相应的属性值元素添加上flag标记
      this.attrInfo.attrValueList.forEach((item) => {
        this.$set(item, "flag", false);
      });
    },
    // 失去焦点的事件————切换为查看模式，展示span
    toLook(row) {
      // 如果属性值为空，不能作为新的属性值，需要给用户提示，让其输入一个其他的属性值
      if (row.valueName.trim() == "") {
        this.$message("请你输入一个正常的属性值");
        return;
      }
      // 新增的属性值不能与已有的属性值重复
      let isRepate = this.attrInfo.attrValueList.some((item) => {
        // 需要将row从数组里面判断的时候去除
        if (row !== item) {
          return row.valueName == item.valueName;
        }
      });
      if (isRepate) {
        this.$message("请不要输入重复属性值");
        return;
      }
      row.flag = false;
    },
    // 点击span的回调，变为编辑模式
    toEdit(row, index) {
      row.flag = true;
      // 获取input节点，实现自动聚焦
      // 需要注意的是，点击span的时候，会切换为input模式，但由于浏览器的重绘与重排需要耗费时间，因此我们不可能一点击span就立马获取到input节点
      // $nextTick，当节点渲染完毕，会执行一次
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    // 气泡确认框的回调(注意elementUI的版本问题)
    deleteAttrValue(index) {
      this.attrInfo.attrValueList.splice(index, 1);
    },
    // 添加属性或修改属性的操作
    async addOrUpdateAttr() {
      // 整理参数：1、在用户添加的属性值中，valueName为空的不应该提交给服务器
      //          2、提交给服务器的数据中不应出现flag字段
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          // 过滤掉属性值不是空的
          if (item.valueName != "") {
            // 删除flag属性
            delete item.flag;
            return true;
          }
        }
      );
      try {
        // 发送请求
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
        // 展示平台属性
        this.isShowTable = true;
        // 提示信息
        this.$message({ type: "success", message: "保存成功" });
        // 保存成功后需要再次获取平台属性进行展示
        this.getAttrList();
      } catch (error) {
        this.$message("保存失败");
      }
    },
  },
};
</script>

<style>
</style>