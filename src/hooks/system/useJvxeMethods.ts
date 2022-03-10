import {defHttp} from '/@/utils/http/axios';
import {ref,unref} from 'vue';
import { VALIDATE_FAILED,validateFormModelAndTables} from '/@/utils/common/vxeUtils'

export function useJvxeMethod(requestAddOrEdit,classifyIntoFormData,tableRefs,activeKey,refKeys,validateSubForm?) {
    const formRef = ref();
    /** 查询某个tab的数据 */
    function requestSubTableData(url, params, tab, success) {
        tab.loading = true
        defHttp.get({url, params},{isTransformResponse:false}).then(res => {
            let { result } = res;
            if (res.success && result) {
                if (Array.isArray(result)) {
                    tab.dataSource = result
                } else if (Array.isArray(result.records)) {
                    tab.dataSource = result.records
                }
            }
            typeof success === 'function' ? success(res) : ''
        }).finally(() => {
            tab.loading = false
        })
    }

    /* --- handle 事件 --- */

    /** ATab 选项卡切换事件 */
    function handleChangeTabs(key) {
        // 自动重置scrollTop状态，防止出现白屏
        tableRefs[key]?.value?.resetScrollTop(0);
    }

    /** 获取所有的editableTable实例*/
    function getAllTable() {
        let values = Object.values(tableRefs);
        return Promise.all(values)
    }
    /** 确定按钮点击事件 */
    function handleSubmit() {
        /** 触发表单验证 */
        getAllTable().then(tables => {
            let values = formRef.value.getFieldsValue()
            return validateFormModelAndTables(formRef.value.validate,values,tables)
        }).then(allValues => {
            /** 一次性验证一对一的所有子表 */
            return (validateSubForm && typeof validateSubForm === 'function')?validateSubForm(allValues):validateAllSubOne(allValues)
        }).then(allValues => {
            if (typeof classifyIntoFormData !== 'function') {
                throw throwNotFunction('classifyIntoFormData')
            }
            let formData = classifyIntoFormData(allValues)
            // 发起请求
            return requestAddOrEdit(formData)
        }).catch(e => {
            if (e.error === VALIDATE_FAILED) {
                // 如果有未通过表单验证的子表，就自动跳转到它所在的tab
                activeKey.value = e.index == null ? unref(activeKey) : refKeys.value[e.index]
            } else {
                console.error(e)
            }
        })
    }
    //校验所有子表表单
    function validateAllSubOne(allValues){
        return new Promise((resolve) => {
            resolve(allValues)
        })
    }
    /* --- throw --- */

    /** not a function */
    function throwNotFunction(name) {
        return `${name} 未定义或不是一个函数`
    }

    /** not a array */
    function throwNotArray(name) {
        return `${name} 未定义或不是一个数组`
    }
    return [handleChangeTabs,handleSubmit,requestSubTableData,formRef]
}
