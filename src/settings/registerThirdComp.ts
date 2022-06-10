import type { App } from 'vue';
import { registerJVxeTable } from '/@/components/jeecg/JVxeTable';
import { registerJVxeCustom } from '/@/components/JVxeCustom';

export async function registerThirdComp(app: App) {
  // 注册 JVxeTable 组件
  registerJVxeTable(app);
  // 注册 JVxeTable 自定义组件
  await registerJVxeCustom();
}
