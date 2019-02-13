<template>
  <div class="bread">
    <i class="schedule-icon icon-bread"></i>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="schedule-bread">
      <el-breadcrumb-item 
        v-for="items,index in breadData" 
        :key="index" 
        :to="{ path: items.path }">
        {{ items.name }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  props: ['breadData']
}
</script>

<style lang="stylus">
.bread
  text-align left
  margin-top 24px
  margin-bottom 24px
</style>
