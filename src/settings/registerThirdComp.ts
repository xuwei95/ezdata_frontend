import type {App} from 'vue';

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.less';
//vexTable组件
import VXETable from 'vxe-table'
import 'xe-utils'
import 'vxe-table/lib/style.css'
//vexTable(antd插件)
import VXETablePluginAntd from 'vxe-table-plugin-antd'
import 'vxe-table-plugin-antd/dist/style.css'
export function registerThirdComp(app: App) {
    app.use(Antd);
    VXETable.use(VXETablePluginAntd)
    app.use(VXETable);

}
