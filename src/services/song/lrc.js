//引入基础请求服务  
import BaseService from '../base/baseService'

let uri= {
  debug: 'http://api.classroom.tianyinculture.com/course/getLyric',
  online: 'http://api.classroom.tianyinculture.com/course/getLyric'
}

const LRC_INFO = BaseService.debug ? uri.debug : uri.online

export default {
  //请求歌词数据
  getLrc(callback, params) {
    BaseService.getData(LRC_INFO, params).then((response) => {
      callback(response.data || response);
    }).catch((error) => {
      console.log('数据请求失败啦');
      throw new Error(error);
    })
  },
  //获取网络在线歌词数据，请求地址动态传入
  getWebLrc(callback, params, url) {
    BaseService.getData(url, params).then((response) => {
      callback(response.data || response);
    }).catch((error) => {
      console.log('数据请求失败啦');
      throw new Error(error);
    })
  }

}
