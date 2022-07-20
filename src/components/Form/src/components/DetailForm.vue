<template>
  <div :class="formContainerClass">
    <a-row>
      <a-col v-for="(item, index) in schemas" :key="index" :span="getItemSpan(item)">
        <div class="detail-item">
          <div class="item-title" :title="item.label"> {{ item.label }}： </div>
          <div class="item-content" v-if="item.isHtml" v-html="detailFormData[item.field]"></div>
          <div class="item-content" v-else-if="item.isImage">
            <div class="ant-upload-list ant-upload-list-picture-card">
              <template v-for="url in detailFormData[item.field]">
                <div class="ant-upload-list-picture-card-container" style="margin-top: 8px">
                  <span>
                    <div class="ant-upload-list-item ant-upload-list-item-done ant-upload-list-item-list-type-picture-card" data-has-actions="true">
                      <div class="ant-upload-list-item-info">
                        <img :src="url" alt="图片不存在" class="ant-upload-list-item-image" />
                      </div>
                      <span class="ant-upload-list-item-actions">
                        <download-outlined @click="handleDownloadFile(url)" />
                        <eye-outlined @click="handleViewImage(item.field)" />
                      </span>
                    </div>
                  </span>
                </div>
              </template>
            </div>
          </div>
          <div class="item-content" v-else-if="item.isFile">
            <div class="ant-upload-list ant-upload-list-text">
              <template v-for="url in detailFormData[item.field]">
                <div class="">
                  <span>
                    <div class="ant-upload-list-item ant-upload-list-item-done ant-upload-list-item-list-type-text">
                      <div class="ant-upload-list-item-info">
                        <span>
                          <paper-clip-outlined />
                          <a :href="url" target="_blank" rel="noopener noreferrer" class="ant-upload-list-item-name ant-upload-list-item-name-icon-count-1">
                            {{ getFilename(url) }}
                          </a>
                          <span class="ant-upload-list-item-card-actions">
                            <download-outlined @click="handleDownloadFile(url)" />
                          </span>
                        </span>
                      </div>
                    </div>
                  </span>
                </div>
              </template>
            </div>
          </div>
          <div v-else class="item-content">
            {{ detailFormData[item.field] }}
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { propTypes } from '/@/utils/propTypes';
  import { useDetailForm } from '../hooks/useDetailForm';
  import { DownloadOutlined, EyeOutlined, PaperClipOutlined } from '@ant-design/icons-vue';

  export default defineComponent({
    name: 'DetailForm',
    components: {
      DownloadOutlined,
      EyeOutlined,
      PaperClipOutlined,
    },
    props: {
      span: propTypes.number.def(24),
      //表单配置
      schemas: propTypes.array.def([]),
      //表单数据
      data: propTypes.object.def({}),
      containerClass: propTypes.string.def(''),
    },
    setup(props) {
      const { formContainerClass, detailFormData, getItemSpan, handleDownloadFile, handleViewImage, getFilename } = useDetailForm(props);
      return {
        formContainerClass,
        detailFormData,
        getItemSpan,
        handleDownloadFile,
        handleViewImage,
        getFilename,
      };
    },
  });
</script>

<style scoped lang="less">
  .jeecg-detail-form {
    border: 1px solid #f0f0f0;
    border-left: none;
    border-bottom: none;
    .detail-item {
      display: flex;
      flex-direction: row;
      align-items: stretch;
      line-height: 24px;
      border-bottom: 1px solid #f0f0f0;
      height: 100%;
      .item-title {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        flex-shrink: 0;
        flex-grow: 0;
        min-width: 100px;
        width: 20%;
        max-width: 220px;
        background-color: #fafafa;
        border-right: 1px solid #f0f0f0;
        /* border-left: 1px solid #f0f0f0;*/
        padding: 10px 0;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .item-content {
        border-right: 1px solid #f0f0f0;
        flex-grow: 1;
        padding-left: 10px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .anticon {
          &:hover {
            color: #40a9ff;
          }
        }

        .detail-image-container {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          color: #000000d9;
          font-size: 14px;
          font-variant: tabular-nums;
          list-style: none;
          font-feature-settings: 'tnum';
          line-height: 1.5715;
          .image-item {
            display: inline-block;
            width: 104px;
            height: 104px;
            margin: 5px;
            border: 1px solid #f0f0f0;
            vertical-align: top;
            img {
            }
          }
        }
      }
    }
  }
</style>
