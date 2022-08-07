<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "ProgressCharts",
  mounted() {
    let lineCharts = echarts.init(this.$refs.charts);
    lineCharts.setOption({
      xAxis: {
        // 隐藏x轴
        show: false,
        // 最大值与最小值的设置
        min: 0,
        max: 100,
      },
      yAxis: {
        // 隐藏y轴
        show: false,
        type: "category",
      },
      series: [
        {
          type: "bar",
          data: [78],
          // 柱状图的宽度
          barWidth: 10,
          color: "yellowgreen",
          // 背景颜色的设置
          showBackground: true,
          backgroundStyle: {
            color: "#eee",
          },
          // 文本标签
          label:{
            show:true,
            // 改变文本内容
            formatter: '|',
            // 文本标签位置设置
            position: 'right'
          }
        },
      ],
      // 布局调整
      grid: {
        left: 0,
        right: 0,
        top: 10,
        bottom: 0,
      },
    });
  },
};
</script>

<style>
.charts {
  width: 100%;
  height: 100%;
}
</style>