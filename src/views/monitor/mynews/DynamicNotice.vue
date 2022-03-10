<template>
  <component :is="comp" :formData="formData" ref="compModel" v-if="comp"></component>
</template>
<script>
  const modules = import.meta.glob('/@/views/monitor/mynews/*.vue')
  export default {
    name: 'DynamicNotice',
    data () {
      return {
        compName: this.path
      }
    },
    computed: {
      comp: function () {
        if(!this.path){
          return null;
        }
        return () => modules[`/@/views/monitor/mynews/${this.path}`]
      }
    },
    props: ['path','formData'],
    methods: {
      detail () {
        setTimeout(() => {
          if(this.path){
            this.$refs.compModel.view(this.formData);
          }
        }, 200)
      },
    }
  }
</script>
