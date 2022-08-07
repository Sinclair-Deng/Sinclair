<template>
  <div>
    <div class="card-header">
      <span>{{ title }}</span>
      <svg
        t="1659671927144"
        class="icon"
        viewBox="0 200 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="4868"
        width="30"
        height="30"
      >
        <path
          d="M512 170.666667C324.266667 170.666667 170.666667 324.266667 170.666667 512s153.6 341.333333 341.333333 341.333333 341.333333-153.6 341.333333-341.333333S699.733333 170.666667 512 170.666667z m0 640c-164.266667 0-298.666667-134.4-298.666667-298.666667s134.4-298.666667 298.666667-298.666667 298.666667 134.4 298.666667 298.666667-134.4 298.666667-298.666667 298.666667z"
          fill="#d9d9d9"
          p-id="4869"
        ></path>
        <path
          d="M512 448c-12.8 0-21.333333 8.533333-21.333333 21.333333v213.333334c0 10.666667 8.533333 21.333333 21.333333 21.333333s21.333333-8.533333 21.333333-21.333333V469.333333c0-10.666667-8.533333-21.333333-21.333333-21.333333zM512 320c-12.8 0-21.333333 10.666667-21.333333 21.333333v42.666667c0 12.8 8.533333 21.333333 21.333333 21.333333s21.333333-10.666667 21.333333-21.333333v-42.666667c0-12.8-8.533333-21.333333-21.333333-21.333333z"
          fill="#d9d9d9"
          p-id="4870"
        ></path>
      </svg>
    </div>
    <div class="card-content">{{ count }}</div>
    <div class="card-charts">
      <slot name="charts"></slot>
    </div>
    <div class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Detail",
  props: ["title", "count"],
};
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  color: #d9d9d9;
}
.card-content {
  font-size: 30px;
  padding: 10px 0px;
}
.card-charts {
  height: 50px;
}
.card-footer {
  border-top: 1px solid #eee;
  padding-top: 10px;
}
</style>