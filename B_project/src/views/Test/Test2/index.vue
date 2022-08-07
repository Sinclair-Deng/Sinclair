<template>
  <el-button type="primary" v-show="$store.state.user.buttons.indexOf('btn.Add3') != -1" >添加按钮3</el-button>
</template>

<script>
export default {
    name: 'Test2'
}
</script>

<style>

</style>