//引入基础请求服务  
import BaseService from '../base/baseService'

let uri = {
  debug: 'http://api.classroom.tianyinculture.com/course/addPractice',
  online: 'http://api.classroom.tianyinculture.com/course/addPractice'
}

const PRACTICE = BaseService.debug ? uri.debug : uri.online;
let uri01 = {
  debug: 'http://api.classroom.tianyinculture.com/course/addWork',
  online: 'http://api.classroom.tianyinculture.com/course/addWork'
}

const WORK = BaseService.debug ? uri01.debug : uri01.online

export default {
  //提交练习录音
  postPractice(callback, params) {
    BaseService.getData(PRACTICE, params).then((response) => {
      callback(response.data || response);
    }).catch((error) => {
      console.log('数据请求失败啦');
      throw new Error(error);
    })
  },
  //提交课后作业录音
  postWork(callback, params) {
    BaseService.getData(WORK, params).then((response) => {
      callback(response.data || response);
    }).catch((error) => {
      console.log('数据请求失败啦');
      throw new Error(error);
    })
  }

}
