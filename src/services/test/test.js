//引入基础请求服务  
import BaseService from '../base/baseService'

let uri = {
  debug: 'http://result.eolinker.com/jKkYjMXb875a276c4af0dc69b15f69437080b30ce0c9940?uri=http://tianyinculture.com/api/test',
  online: '/api/'
}

const TEST_INFO = BaseService.debug ? uri.debug : uri.online

export default {
  //课后作业列表
  getAllTest(callback, params) {
    BaseService.getData(TEST_INFO, params).then((response) => {
      callback(response.data || response);
    }).catch((error) => {
      console.log('数据请求失败啦');
      throw new Error(error);
    })
  }

}
