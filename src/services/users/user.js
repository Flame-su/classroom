//引入基础请求服务  
import BaseService from '../base/baseService'

let uri = {
  debug: 'http://api.classroom.tianyinculture.com/user/getProfile',
  online: 'http://api.classroom.tianyinculture.com/user/getProfile'
}

const USER_INFO = BaseService.debug ? uri.debug : uri.online

export default {
  //获取用户信息
  getUserInfo(callback, params) {
    BaseService.getData(USER_INFO, params).then((response) => {
      callback(response.data || response)
    }).catch((error) => {
      console.log('请求错误');
      throw new Error(error);
    })
  }
}
