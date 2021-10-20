<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" title="角色权限配置" width="650px" destroyOnClose @ok="handleSubmit" showFooter>
    <BasicTree
      ref="treeRef"
      checkable
      :checkedKeys="checkedKeys"
      :treeData="treeData"
      :expandedKeys="expandedKeysss"
      :checkStrictly="true"
      toolbar
      title="所拥有的的权限"
      @check="onCheck"
      @expand="onExpand">
      <template #title={slotTitle,ruleFlag}>
        {{ slotTitle }}
        <Icon v-if="ruleFlag" icon="ant-design:align-left-outlined" style="margin-left:5px;color: red;"></Icon>
      </template>
    </BasicTree>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import {defineEmits, ref, computed, unref,onMounted} from 'vue';
  import {BasicDrawer, useDrawerInner} from '/@/components/Drawer';
  import {BasicTree, TreeItem} from '/@/components/Tree';
  import {Form} from 'ant-design-vue';
  import {queryTreeListForRole, queryRolePermission, saveRolePermission} from './role.api';
  // 获取emit
  const emit = defineEmits(['success', 'register']);
  const treeData = ref<TreeItem[]>([]);
  const allTreeKeys = ref([]);
  const checkedKeys = ref([]);
  const defaultCheckedKeys = ref([]);
  const expandedKeysss = ref([]);
  const autoExpandParent = ref(true);
  const roleId = ref('');
  const treeRef = ref(null);
  /**
   * 数据
   */
  const [registerDrawer, {setDrawerProps, closeDrawer}] = useDrawerInner(async (data) => {
    await reset();
    setDrawerProps({confirmLoading: false});
    roleId.value = data.roleId
    //初始化数据
    const roleResult = await queryTreeListForRole();
    treeData.value = roleResult.treeList
    console.log(roleResult.treeList)
    allTreeKeys.value = roleResult.ids
    const permResult = await queryRolePermission({roleId: unref(roleId)});
    checkedKeys.value = [...permResult];
    defaultCheckedKeys.value = [...permResult];
    expandedKeysss.value = unref(allTreeKeys);
  });
  /**
   * 展开
   */
  function onExpand(expandedKeys) {
    expandedKeysss.value = expandedKeys;
    autoExpandParent.value = false
  }
  /**
   * 选择
   */
  function onCheck(o) {
    checkedKeys.value = o.checked ? o.checked : o
  }
  /**
   * 数据重置
   */
  function reset() {
     treeData.value = [];
     allTreeKeys.value = [];
     checkedKeys.value = [];
     defaultCheckedKeys.value = [];
     expandedKeysss.value = [];
     autoExpandParent.value = true;
     roleId.value = '';
  }
  /**
   * 获取tree实例
   */
  function getTree() {
    const tree = unref(treeRef);
    if (!tree) {
      throw new Error('tree is null!');
    }
    return tree;
  }
  /**
   * 提交
   */
  async function handleSubmit() {
    let params = {
      roleId: unref(roleId),
      permissionIds: unref(getTree().getCheckedKeys()).join(","),
      lastpermissionIds: unref(defaultCheckedKeys).join(","),
    };
    const result = await saveRolePermission(params)
    closeDrawer()
  }

</script>
