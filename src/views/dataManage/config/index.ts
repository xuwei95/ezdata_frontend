import {
  httpFormSchema,
  fileFormSchema,
  minioFormSchema,
  mysqlFormSchema,
  clickhouseFormSchema,
  esFormSchema,
  mongodbFormSchema,
  neo4jFormSchema,
  influxdbFormSchema,
  prometheusFormSchema,
  kafkaFormSchema,
  redisFormSchema,
} from './datasource.conn.data';

import {
  httpSchema,
  fileTableSchema,
  minioTableSchema,
  SqlSchema,
  mysqlTableSchema,
  mysqlBinlogSchema,
  ckTableSchema,
  esIndexSchema,
  mongoCollectionSchema,
  neo4jGraphSchema,
  influxdbTableSchema,
  prometheusMetricSchema,
  prometheusPromqlSchema,
  kafkaTopicSchema,
  redisKeySchema,
} from './datamodel.model.data';

import {
  ckTableFieldSchema,
  esIndexFieldSchema,
  influxdbTableFieldSchema,
  mongoCollectionFieldSchema,
  mysqlTableFieldSchema,
  neo4jGraphFieldSchema,
} from './datamodel.field.data';

// 数据源类型下拉选项
export const dataSourceTypeOptions = [
  { label: 'http请求', value: 'http' },
  { label: '文件', value: 'file' },
  { label: 'minio对象存储', value: 'minio' },
  { label: 'redis', value: 'redis' },
  { label: 'mysql', value: 'mysql' },
  { label: 'clickhouse', value: 'clickhouse' },
  { label: 'elasticsearch', value: 'elasticsearch' },
  { label: 'mongodb', value: 'mongodb' },
  { label: 'neo4j', value: 'neo4j' },
  { label: 'influxdb', value: 'influxdb' },
  { label: 'prometheus', value: 'prometheus' },
  { label: 'kafka', value: 'kafka' },
];

// 数据源连接配置表单字典
export const ConnFormSchemaMap = {
  http: httpFormSchema,
  file: fileFormSchema,
  minio: minioFormSchema,
  redis: redisFormSchema,
  mysql: mysqlFormSchema,
  clickhouse: clickhouseFormSchema,
  elasticsearch: esFormSchema,
  mongodb: mongodbFormSchema,
  neo4j: neo4jFormSchema,
  influxdb: influxdbFormSchema,
  prometheus: prometheusFormSchema,
  kafka: kafkaFormSchema,
};

// 数据源可用数据模型下拉选项字典
export const dataModelTypeOptionsMap = {
  http: [
    { label: 'json api', value: 'http_json' },
    { label: 'html', value: 'http_html' },
  ],
  file: [
    { label: '表格文件(csv/excel)', value: 'file_table' },
    { label: 'json文件', value: 'file_json' },
    { label: 'h5文件', value: 'file_h5' },
  ],
  minio: [
    { label: '表格文件(csv/excel)', value: 'minio_table' },
    { label: 'json文件', value: 'minio_json' },
    { label: 'h5文件', value: 'minio_h5' },
  ],
  redis: [
    { label: '字符串', value: 'redis_string' },
    { label: '列表', value: 'redis_list' },
    { label: '队列', value: 'redis_list_stream' },
    { label: '哈希', value: 'redis_map' },
  ],
  mysql: [
    { label: 'mysql数据表', value: 'mysql_table' },
    { label: 'binlog数据流', value: 'mysql_binlog' },
    { label: 'sql', value: 'sql' },
  ],
  clickhouse: [
    { label: 'clickhouse数据表', value: 'clickhouse_table' },
    { label: 'sql', value: 'sql' },
  ],
  elasticsearch: [{ label: 'elasticsearch索引', value: 'elasticsearch_index' }],
  mongodb: [{ label: 'mongodb集合', value: 'mongodb_collection' }],
  neo4j: [
    { label: 'neo4j graph', value: 'neo4j_graph' },
    { label: 'sql', value: 'sql' },
  ],
  influxdb: [
    { label: 'influxdb数据表', value: 'influxdb_table' },
    { label: 'sql', value: 'sql' },
  ],
  prometheus: [
    { label: 'prometheus指标', value: 'prometheus_metric' },
    { label: 'promql', value: 'prometheus_promql' },
  ],
  kafka: [{ label: 'kafka topic', value: 'kafka_topic' }],
};

// 数据模型配置表单字典
export const ModelFormSchemaMap = {
  http_json: httpSchema,
  http_html: httpSchema,
  file_table: fileTableSchema,
  file_json: fileTableSchema,
  file_h5: fileTableSchema,
  minio_table: minioTableSchema,
  minio_json: minioTableSchema,
  minio_h5: minioTableSchema,
  redis_string: redisKeySchema,
  redis_list: redisKeySchema,
  redis_list_stream: redisKeySchema,
  redis_map: redisKeySchema,
  sql: SqlSchema,
  mysql_table: mysqlTableSchema,
  mysql_binlog: mysqlBinlogSchema,
  clickhouse_table: ckTableSchema,
  elasticsearch_index: esIndexSchema,
  mongodb_collection: mongoCollectionSchema,
  neo4j_graph: neo4jGraphSchema,
  influxdb_table: influxdbTableSchema,
  prometheus_metric: prometheusMetricSchema,
  prometheus_promql: prometheusPromqlSchema,
  kafka_topic: kafkaTopicSchema,
};

// 数据模型字段配置表单字典
export const ModelFieldSchemaMap = {
  mysql_table: mysqlTableFieldSchema,
  clickhouse_table: ckTableFieldSchema,
  elasticsearch_index: esIndexFieldSchema,
  mongodb_collection: mongoCollectionFieldSchema,
  neo4j_graph: neo4jGraphFieldSchema,
  influxdb_table: influxdbTableFieldSchema,
};
