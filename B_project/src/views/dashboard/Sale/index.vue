<template>
  <div>
    <el-card class="box-card" style="margin: 10px 0">
      <div slot="header" class="clearfix">
        <!--   @tab-click="handleClick" -->
        <!-- 左侧结构 -->
        <el-tabs class="tab" v-model="activeName">
          <el-tab-pane label="销售额" name="sale"></el-tab-pane>
          <el-tab-pane label="访问量" name="visite"></el-tab-pane>
        </el-tabs>
        <!-- 右侧结构 -->
        <div class="right">
          <span @click="setDay">今日</span>
          <span @click="setWeek">本周</span>
          <span @click="setMonth">本月</span>
          <span @click="setYear">本年</span>
          <el-date-picker
            v-model="date"
            class="date"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="mini"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </div>
      </div>
      <div>
        <el-row :gutter="10">
          <el-col :span="18">
            <div class="charts" ref="charts"></div>
          </el-col>
          <el-col :span="6">
            <h3>门店{{title}}排名</h3>
            <ul>
              <li>
                <span class="rindex">1</span>
                <span>肯德基</span>
                <span class="rvalue">323,234</span>
              </li>
              <li>
                <span class="rindex">2</span>
                <span>麦当劳</span>
                <span class="rvalue">299,132</span>
              </li>
              <li>
                <span class="rindex">3</span>
                <span>必胜客</span>
                <span class="rvalue">283,998</span>
              </li>
              <li>
                <span class="rindexs">4</span>
                <span>海底捞</span>
                <span class="rvalue">266,223</span>
              </li>
              <li>
                <span class="rindexs">5</span>
                <span>西贝筱面村</span>
                <span class="rvalue">223,445</span>
              </li>
              <li>
                <span class="rindexs">6</span>
                <span>汉堡王</span>
                <span class="rvalue">219,663</span>
              </li>
              <li>
                <span class="rindexs">7</span>
                <span>德克士</span>
                <span class="rvalue">200,997</span>
              </li>
            </ul>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from "echarts";
import dayjs from 'dayjs';
import {mapState} from 'vuex';
export default {
  name: "Sale",
  data() {
    return {
      activeName: "sale",
      mycharts: null,
      date: [],
    };
  },
  mounted() {
    this.mycharts = echarts.init(this.$refs.charts);
    this.mycharts.setOption({
      title:{
        text: ''
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: [],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: [],
        },
      ],
    });
  },
  computed:{
    title(){
      return this.activeName == 'sale' ? '销售额' : '访问量';
    },
    ...mapState({
      listState: state => state.home.list
    })
  },
  watch:{
    title(){
      // 重新修改图表的配置数据
      // 图表的配置数据可以再次修改，如果有新的数据，就用新的，否则还用以前的
      this.mycharts.setOption({
        title:{
          text: this.title + '趋势'
        },
        xAxis:{
          data: this.title == '销售额' ? this.listState.orderFullYearAxis : this.listState.userFullYearAxis
        },
        series:{
          data: this.title == '销售额' ? this.listState.orderFullYear : this.listState.userFullYear
        }
      })
    },
    listState(){
      this.mycharts.setOption({
        title:{
          text: this.title + '趋势'
        },
        xAxis:{
          data: this.listState.orderFullYearAxis
        },
        series:{
          data: this.listState.orderFullYear
        }
      })
    }
  },
  methods: {
    setDay(){
      const day = dayjs().format('YYYY-MM-DD')
      this.date = [day,day]
    },
    setWeek(){
      const start = dayjs().day(1).format('YYYY-MM-DD')
      const end = dayjs().day(7).format('YYYY-MM-DD')
      this.date = [start,end]
    },
    setMonth(){
      const start = dayjs().startOf('month').format('YYYY-MM-DD')
      const end = dayjs().endOf('month').format('YYYY-MM-DD')
      this.date = [start,end]
    },
    setYear(){
      const start = dayjs().startOf('year').format('YYYY-MM-DD')
      const end = dayjs().endOf('year').format('YYYY-MM-DD')
      this.date = [start,end]
    }
  },
};
</script>

<style scoped>
.clearfix {
  position: relative;
  display: flex;
  justify-content: space-between;
}
.tab {
  width: 100%;
}
.right {
  position: absolute;
  right: 0;
}
.date {
  width: 250px;
  margin: 0 20px;
}
.right span {
  margin: 0 10px;
}
.charts {
  width: 100%;
  height: 300px;
}
ul{
  list-style: none;
  width: 100%;
  height: 300px;
  padding: 0;
}
ul li{
  height: 8%;
  margin: 10px 0;
}
.rindex{
  float: left;
  width: 20px;
  height: 20px;
  line-height: 20px;
  border-radius: 50%;
  background: black;
  color: white;
  text-align: center;
  margin-right: 20px;
}
.rvalue{
  float: right;
}
.rindexs{
  margin: 0 25px 0 5px;
}
</style>