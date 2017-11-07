//引入基础请求服务  
import BaseService from '../base/baseService'

let uri = {
  debug: 'http://api.classroom.tianyinculture.com/course/getChapterInfo',
  online: 'http://api.classroom.tianyinculture.com/course/getChapterInfo'
}

const WHOLE_INFO = BaseService.debug ? uri.debug : uri.online

export default {
  //请求歌词数据
  getWhole(callback, params) {
    BaseService.getData(WHOLE_INFO, params).then((response) => {
      callback(response.data || response);
    }).catch((error) => {
      console.log('数据请求失败啦');
      throw new Error(error);
    })
  }

}
