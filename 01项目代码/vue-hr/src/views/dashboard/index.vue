<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <button @click="test">请求接口带token</button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getProfile } from '@/api/user'
export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {
    async test() {
      await getProfile()
    }
  }

}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
