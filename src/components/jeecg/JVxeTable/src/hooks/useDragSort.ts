import { onMounted, onUnmounted, nextTick } from 'vue';
import { JVxeTableMethods, JVxeTableProps } from '/@/components/jeecg/JVxeTable/src/types';
import Sortable from 'sortablejs';

export function useDragSort(props: JVxeTableProps, methods: JVxeTableMethods) {
  if (props.dragSort) {
    let sortable2: Sortable;
    let initTime: any;

    onMounted(() => {
      // 加载完成之后再绑定拖动事件
      initTime = setTimeout(createSortable, 300);
    });

    onUnmounted(() => {
      clearTimeout(initTime);
      if (sortable2) {
        sortable2.destroy();
      }
    });

    function createSortable() {
      let xTable = methods.getXTable();
      // let dom = xTable.$el.querySelector('.vxe-table--fixed-wrapper .vxe-table--body tbody')
      let dom = xTable.$el.querySelector('.body--wrapper>.vxe-table--body tbody');
      let startChildren = [];
      sortable2 = Sortable.create(dom as HTMLElement, {
        handle: '.drag-btn',
        direction: 'vertical',
        animation: 300,
        onStart(e) {
          let from = e.from;
          // @ts-ignore
          startChildren = [...from.children];
        },
        onEnd(e) {
          let oldIndex = e.oldIndex as number;
          let newIndex = e.newIndex as number;
          if (oldIndex === newIndex) {
            return;
          }
          let from = e.from;
          let element = startChildren[oldIndex];
          let target = null;
          if (oldIndex > newIndex) {
            // 向上移动
            if (oldIndex + 1 < startChildren.length) {
              target = startChildren[oldIndex + 1];
            }
          } else {
            // 向下移动
            target = startChildren[oldIndex + 1];
          }
          from.removeChild(element);
          from.insertBefore(element, target);
          nextTick(() => {
            methods.doSort(oldIndex, newIndex);
            methods.trigger('dragged', { oldIndex, newIndex });
          });
        },
      });
    }
  }
}
