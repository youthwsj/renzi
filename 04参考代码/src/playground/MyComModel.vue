<template>
  <div>
    我是子组件, {{ value }}
    <button @click="$emit('input', value+1) "> +1</button>
  </div>
</template>
<script>
export default {
  // 如何在子组件内部，拿到父组件传递数据?
  props: ['value']
}
</script>
