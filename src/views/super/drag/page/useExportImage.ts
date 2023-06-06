
import {ref} from 'vue'
import html2canvas from 'html2canvas';

/**
 * 用于导出生成image
 */
export function useExportImage() {
  
  const exportRef = ref();

  /**
   * 导出图片触发事件
   * @param fileName
   */
  function onExportImage(fileName) {
    let ele = exportRef.value;
    if(!ele){
      console.error('没有导出对象')
      return;
    }
    const size = {
      width: ele.offsetWidth,
      height: ele.offsetHeight
    }
    html2canvas(ele, { useCORS: true, logging: true }).then(async (canvas) => {
      const dataURL = canvas.toDataURL('image/png');
      await download(dataURL, size, fileName);
    });
  }

  async function download(imgUrl, size, fileName) {
    const dataUrl = await getBase64(imgUrl, size);
    const link:any = document.createElement('a');
    link.href = dataUrl;
    link.download = `${fileName}.png`;
    link.click();
  }

  function getBase64(url, size){
    return new Promise((resolve) => {
      let canvas:any = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      // 允许跨域
      img.crossOrigin = 'Anonymous';
      img.src = url;
      img.onload = () => {
        // eslint-disable-next-line prefer-destructuring
        canvas.height = size.height;
        // eslint-disable-next-line prefer-destructuring
        canvas.width = size.width;
        ctx!.drawImage(img, 0, 0, size.width, size.height);
        const dataURL = canvas.toDataURL('image/png');
        canvas = null;
        resolve(dataURL);
      };
    });
  }

  return {
    exportRef,
    onExportImage
  }
}