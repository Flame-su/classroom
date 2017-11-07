//引入基础请求服务  
import BaseService from '../base/baseService'

const SUBMIT = '/api/order/submit'

export default {

  //提交订单信息POST
  submitOrder(callback, params) {
    // appid = (appid != '' || appid != undefined) ? '?appid=' + appid : '';
    BaseService.saveData(SUBMIT, params).then((response) => {
      callback(response.data || response);
    }).catch((error) => {
      console.log('数据请求失败啦');
      throw new Error(error);
    })
  }


}
