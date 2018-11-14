<template>
  <div>
    <div style='margin-top:60px'>
      <h2>{{msg}}</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: 'loginError',
  data () {
    return {
      msg: ''
    }
  },
  created: function () {
    this.msg = this.$route.params.msg
	}
}
</script>
