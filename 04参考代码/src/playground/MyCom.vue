<template>
  <div @click="$emit('click')">
    我是子组件
    $emit('xxxx')
    $emit('click')
  </div>
</template>
