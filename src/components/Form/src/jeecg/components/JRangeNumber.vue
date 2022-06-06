<template>
    <a-input-group>
        <a-input :value="beginValue" style="width: calc( 50% - 15px )" placeholder="请输入最小值" @change="handleChangeBegin"/>
        <a-input style="width: 30px; border-left: 0; pointer-events: none; background-color: #fff" placeholder="~" disabled/>
        <a-input :value="endValue" style="width: calc( 50% - 15px );border-left: 0" placeholder="请输入最大值" @change="handleChangeEnd"/>
    </a-input-group>
</template>

<script>

  /**
   * 查询条件用-数值范围查询
   */
  import {ref, watch} from 'vue'
  export default {
    name: "JRangeNumber",
    props:{
      value: {
        type: Array,
        default: ['','']
      }
    },
    emits: ['change'],
    setup(props, {emit}){
      const beginValue = ref('')
      const endValue = ref('')
      
      function handleChangeBegin(e) {
        beginValue.value = e.target.value
        emitArray()
      }

      function handleChangeEnd(e) {
        endValue.value = e.target.value
        emitArray()
      }
      
      function emitArray(){
        let arr = []
        let begin = beginValue.value || ''
        let end = endValue.value || ''
        arr.push(begin)
        arr.push(end)
        emit('change', arr)
      }
      
      watch(()=>props.value, (val)=>{
        if(val.length==2){
          beginValue.value = val[0]
          endValue.value = val[1]
        }else{
          beginValue.value = ''
          endValue.value = ''
        }
      });
      
      return {
        beginValue,
        endValue,
        handleChangeBegin,
        handleChangeEnd
      }
    }
  }
</script>

<style scoped>

</style>