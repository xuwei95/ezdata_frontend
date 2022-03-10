import {defHttp} from "/@/utils/http/axios";
import {useMessage} from '/@/hooks/web/useMessage';
import {useGlobSetting} from '/@/hooks/setting';

const {createMessage, createWarningModal} = useMessage();
const glob = useGlobSetting();

export function useMethods() {
  /**
   * 导出xls
   * @param name
   * @param url
   */
  async function exportXls(name,url,params) {
    const data = await defHttp.get({url: url, params:params,responseType: 'blob'}, {isTransformResponse: false})
    if (!data) {
      createMessage.warning("文件下载失败")
      return
    }
    if(!name || typeof name != "string"){
      name = "导出文件"
    }
    if (typeof window.navigator.msSaveBlob !== 'undefined') {
      window.navigator.msSaveBlob(new Blob([data], {type: 'application/vnd.ms-excel'}), name + '.xls')
    } else {
      let url = window.URL.createObjectURL(new Blob([data], {type: 'application/vnd.ms-excel'}))
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', name + '.xls')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
    }
  }

  /**
   * 导入xls
   * @param data 导入的数据
   * @param url
   * @param success 成功后的回调
   */
  async function importXls(data, url, success) {
    const isReturn = (fileInfo) => {
        try{
            if (fileInfo.code === 201) {
                let {message, result: {msg, fileUrl, fileName}} = fileInfo
                let href = glob.uploadUrl + fileUrl;
                createWarningModal({
                    title: message,
                    centered:false,
                    content: `<div>
                                <span>${msg}</span><br/> 
                                <span>具体详情请<a href = ${href} download = ${fileName}> 点击下载 </a> </span> 
                              </div>`
                })
            } else if (fileInfo.code === 500) {
                createMessage.error(fileInfo.message || `${data.file.name} 导入失败`)
            } else {
                createMessage.success(fileInfo.message || `${data.file.name} 文件上传成功`)
            }
        } catch (error) {
            console.log("导入的数据异常",error)
        }finally{
            typeof success === 'function' ? success(fileInfo) : ''
        }
    };
    await defHttp.uploadFile({url}, {file: data.file},{success:isReturn});
  }

  return {
    handleExportXls: (name: string, url: string,params:object) => exportXls(name, url,params),
    handleImportXls: (data, url, success) => importXls(data, url, success),
  };
}
