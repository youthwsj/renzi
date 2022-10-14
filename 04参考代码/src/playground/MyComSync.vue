<template>
  <div>
    我是子组件-sync, {{ a }}, {{ age }}
    <button @click="$emit('update:a', 200) "> 200</button>
    <button @click="$emit('update:age',20)">age变成20</button>
  </div>
</template>
<script>
export default {
  // 如何在子组件内部，拿到父组件传递数据?
  props: ['a', 'age']
}
</script>
