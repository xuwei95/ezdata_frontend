<template>
  <div :class="prefixCls">
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" preIcon="ant-design:plus-outlined" @click="onAdd">新增</a-button>
        <a-button type="primary" preIcon="ant-design:export-outlined" @click="onExportXls"> 导出</a-button>
        <j-upload-button type="primary" preIcon="ant-design:import-outlined" @click="onImportXls">导入</j-upload-button>
        <a-dropdown v-if="showBatchBtn">
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" @click="onDeleteBatch">
                <Icon icon="ant-design:delete-outlined"></Icon>
                <span>删除</span>
              </a-menu-item>
            </a-menu>
          </template>
          <a-button>
            <span>批量操作</span>
            <Icon icon="mdi:chevron-down"></Icon>
          </a-button>
        </a-dropdown>
      </template>

      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" :dropDownActions="getDropDownAction(record)"/>
      </template>
    </BasicTable>
    <TemplateModal @register="registerModal" @success="reload"/>
    <TemplateTestModal @register="registerTestModal"/>
  </div>
</template>


<script lang="ts" setup name="message-template">
import { unref, computed } from 'vue'
import { ActionItem, BasicTable, TableAction } from '/@/components/Table'
import { useModal } from '/@/components/Modal'
import { useListPage } from '/@/hooks/system/useListPage'
import TemplateModal from './TemplateModal.vue'
import TemplateTestModal from './TemplateTestModal.vue'
import { Api, list, deleteBatch } from './template.api'
import { columns, searchFormSchema } from './template.data'

// 列表页面公共参数、方法
const { prefixCls, onExportXls, onImportXls, tableContext } = useListPage({
  designScope: 'message-template',
  tableProps: {
    title: '消息中心模板列表数据',
    api: list,
    columns: columns,
    formConfig: {
      schemas: searchFormSchema,
    },
  },
  exportConfig: {
    url: Api.exportXls,
    name: '消息中心模板列表',
  },
  importConfig: {
    url: Api.importXls,
    success: () => reload(),
  },
})

// 注册 ListTable
const [registerTable, { reload, setLoading }, { rowSelection, selectedRowKeys }] = tableContext
const [registerModal, { openModal }] = useModal()
const [registerTestModal, testModal] = useModal()
const showBatchBtn = computed(() => selectedRowKeys.value.length > 0)

function onAdd() {
  openModal(true, {
    title: '新增消息模板',
    isUpdate: false,
    record: {},
  })
}

function onEdit(record) {
  openModal(true, {
    title: '修改消息模板',
    isUpdate: true,
    record: record,
  })
}

function onDelete(record) {
  if (record) {
    doDeleteDepart([record.id], false)
  }
}


/**
 * 根据 ids 批量删除
 * @param idListRef array
 * @param confirm 是否显示确认提示框
 */
async function doDeleteDepart(idListRef, confirm = true) {
  const idList = unref(idListRef)
  if (idList.length > 0) {
    try {
      setLoading(true)
      await deleteBatch({ ids: idList.join(',') }, confirm)
      await reload()
    } finally {
      setLoading(false)
    }
  }
}


async function onDeleteBatch() {
  try {
    await doDeleteDepart(selectedRowKeys)
    selectedRowKeys.value = []
  } finally {
  }
}

// 发送消息测试
function onSendTest(record) {
  testModal.openModal(true, { record })
}

/**
 * 操作栏
 */
function getTableAction(record): ActionItem[] {
  return [
    { label: '编辑', onClick: onEdit.bind(null, record) },
  ]
}

/**
 * 下拉操作栏
 */
function getDropDownAction(record): ActionItem[] {
  return [
    { label: '发送测试', onClick: onSendTest.bind(null, record) },
    {
      label: '删除',
      color: 'error',
      popConfirm: {
        title: '确认要删除吗？',
        confirm: onDelete.bind(null, record),
      },
    },
  ]
}
</script>

<style lang="less">
@import "index";
</style>
