//引入基础请求服务  
import BaseService from '../base/baseService'

let uri = {
  debu: 'http://api.classroom.tianyinculture.com/course/getTaskInfo',
  online: 'http://api.classroom.tianyinculture.com/course/getTaskInfo'
}

const HOMEWORK_INFO = BaseService.debug ? uri.debug : uri.online

export default {
  //请求歌词数据
  getHomework(callback, params) {
    BaseService.getData(HOMEWORK_INFO, params).then((response) => {
      callback(response.data || response);
    }).catch((error) => {
      console.log('数据请求失败啦');
      throw new Error(error);
    })
  }

}
