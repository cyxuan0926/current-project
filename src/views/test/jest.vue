<template>
  <ul>
    <li
      v-for="(message, index) in messages"
      :key="index">
      {{ message }}
    </li>
    <li>
      <el-button @click="onClick(111)">哈哈</el-button>
      <el-button @click="onClick(222)">哈哈</el-button>
      <el-button @click="onClick(333)">哈哈</el-button>
    </li>
    <li>
      <el-input v-model="input1" />
      <el-input v-model="input2" />
      <el-input v-model="input3" />
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    messages: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      haha: 0,
      input1: '',
      input2: '',
      input3: ''
    }
  },
  methods: {
    onClick(e) {
      this.haha = e
    }
  }
  // data() {
  //   return {
  //     messages: []
  //   }
  // }
}
</script>
