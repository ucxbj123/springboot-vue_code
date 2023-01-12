<template>
  <div class="app-container">
    <!-- 其实，当路由变更时就会调用addViewTags,addViewTag会根据匹配的路由name属性进行缓存。
    而用到三级路由的时候，拿到name只能时第三级路由的name，二级路由组件的名字会丢失，keep-alive就不会进行缓存
    -->
    <!-- <keep-alive :include="cachedViews"> -->
      <router-view :key="key" />
    <!-- </keep-alive> -->
  </div>
</template>

<script>
export default {
    name:'Check',
    computed:{
        key(){
            return this.$route.path
        },
        cachedViews() {//缓存的组件
          return this.$store.state.tagsView.cachedViews
        },
    }
}
</script>

<style>

</style>