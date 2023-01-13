<template>
  <div class="app-container">
    <!-- 
    问题：其实，当路由变更时就会调用addViewTags,addViewTag会根据匹配的路由name属性进行缓存。
          而用到三级路由的时候，拿到name只能时第三级路由的name，二级路由组件的名字会丢失，keep-alive就不会进行缓存
    处理三级路由缓存问题：在二级的主页上添加keep-alive，在store--tagsView.js添加的缓存的mutations判断是否是三级组件，若是则通过路由的matched属性获取二级路由组件的name
    缺点：关闭组件时，没有做二级组件缓存的删除操作，因为不确定三级组件是否全部关闭了;可以进行浏览器页面刷新，清除缓存的名单
    -->
    <keep-alive :include="cachedViews">
      <router-view :key="key" />
    </keep-alive>
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