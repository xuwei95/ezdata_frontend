<script lang="tsx">
  import { computed, defineComponent, PropType, unref } from 'vue';
  import { FormSchema } from '/@/components/Form';
  import { upperFirst } from 'lodash-es';
  import { componentMap } from '/@/components/Form/src/componentMap';
  import { createPlaceholderMessage } from '/@/components/Form/src/helper';
  import { isFunction } from '/@/utils/is';

  export default defineComponent({
    name: 'OnlineSuperQueryValComponent',
    inheritAttrs: false,
    props: {
      schema: {
        type: Object as PropType<FormSchema>,
        default: () => ({}),
      },
      formModel: {
        type: Object as PropType<Recordable>,
        default: () => ({}),
      },
      setFormModel: {
        type: Function as PropType<(key: string, value: any) => void>,
        default: null,
      },
    },
    setup(props) {
      const getComponentsProps = computed(() => {
        const { schema, formModel } = props;
        let { componentProps = {} } = schema;
        if (isFunction(componentProps)) {
          componentProps = componentProps({ schema, formModel }) ?? {};
        }
        return componentProps as Recordable;
      });

      const getValues = computed(() => {
        const { formModel, schema } = props;
        let obj = {
          field: schema.field,
          model: formModel,
          values: {
            ...formModel,
          } as Recordable,
          schema: schema,
        };
        return obj;
      });

      function renderComponent() {
        const { component, changeEvent = 'change', valueField } = props.schema;
        const field = 'val';
        const isCheck = component && ['Switch', 'Checkbox'].includes(component);
        const eventKey = `on${upperFirst(changeEvent)}`;
        const on = {
          [eventKey]: (...args: Nullable<Recordable>[]) => {
            const [e] = args;
            if (propsData[eventKey]) {
              propsData[eventKey](...args);
            }
            const target = e ? e.target : null;
            const value = target ? (isCheck ? target.checked : target.value) : e;
            props.setFormModel(field, value);
          },
        };
        const Comp = componentMap.get(component) as ReturnType<typeof defineComponent>;

        const propsData: Recordable = {
          allowClear: true,
          getPopupContainer: (trigger: Element) => trigger.parentNode,
          ...unref(getComponentsProps),
        };

        const isCreatePlaceholder = !propsData.disabled;

        // RangePicker place是一个数组
        if (isCreatePlaceholder && component !== 'RangePicker' && component) {
          //自动设置placeholder
          propsData.placeholder = unref(getComponentsProps)?.placeholder || createPlaceholderMessage(component) + props.schema.label;
        }
        propsData.codeField = field;
        propsData.formValues = unref(getValues);
        const bindValue: Recordable = {
          [valueField || (isCheck ? 'checked' : 'value')]: props.formModel[field],
        };
        const compAttr: Recordable = {
          ...propsData,
          ...on,
          ...bindValue,
          allowClear: true,
        };
        return <Comp {...compAttr} />;
      }
      return () => {
        return <div style="width:100%">{renderComponent()}</div>;
      };
    },
  });
</script>
