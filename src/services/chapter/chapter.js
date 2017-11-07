//引入基础请求服务  
import BaseService from '../base/baseService'

let uri = {
  debug: 'http://api.classroom.tianyinculture.com/course/getChapterInfo',
  online: 'http://api.classroom.tianyinculture.com/course/getChapterInfo'
}

const CHAPET_INFO = BaseService.debug ? uri.debug : uri.online


export default {
  //请求章节信息
  // 必需参数:chapterid: 章节ID
  getChapterInfo(callback, params) {
    BaseService.getData(CHAPET_INFO, params).then((response) => {
      callback(response.data || response);
    }).catch((error) => {
      console.log('数据请求失败啦');
      throw new Error(error);
    })
  }

}
