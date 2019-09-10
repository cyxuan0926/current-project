<template>
  <!-- TODO: 公共服务添加新角色之后，要把 keep-alive 移到 the-frame 组件中 -->
  <keep-alive :include="$store.state.global.componentsKeepAlive">
    <router-view />
  </keep-alive>
</template>
