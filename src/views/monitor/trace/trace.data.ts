import { BasicColumn } from '/@/components/Table';
import dayjs from 'dayjs';
export const columns: BasicColumn[] = [
  {
    title: '请求时间',
    dataIndex: 'timestamp',
    width: 50,
    customRender({text}) {
      return dayjs(text).format('YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    title: '请求方法',
    dataIndex: 'request.method',
    width: 20,
    slots: { customRender: 'requestMethod' },
  },
  {
    title: '请求URL',
    dataIndex: 'request.uri',
    width: 200,
  },
  {
    title: '响应状态',
    dataIndex: 'response.status',
    width: 50,
    slots: { customRender: 'responseStatus' },
  },
  {
    title: '请求耗时',
    dataIndex: 'timeTaken',
    width: 50,
    slots: { customRender: 'timeTaken' },
  },
];
