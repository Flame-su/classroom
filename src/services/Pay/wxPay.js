//引入基础请求服务  
import BaseService from '../base/baseService'

const WX_PAY_API = '/api/order/submit'

export default {

    //微信快捷支付 POST
    goTOPay(callback, params) {
        // appid = (appid != '' || appid != undefined) ? '?appid=' + appid : '';
        BaseService.saveData(WX_PAY_API, params).then((response) => {
            callback(response.data || response);
        }).catch((error) => {
            console.log('数据请求失败啦');
            throw new Error(error);
        })
    }


}