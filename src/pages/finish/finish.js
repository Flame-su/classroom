import AjaxIndex from '../../services/index/index';
import AjaxUserInfo from '../../services/users/user'; //用户信息
import Vue from 'vue';
export default {
  data() {
    return {
      isShow: false,
      data: {
        graduation_info: ''
      },
      userinfo: ''
    }
  },
  created() {
    this.getIndex();
    this.getUser();
  },
  computed: {
    bgStyle() {
      if (this.data.graduation_info) {
        var str = {
          'background': this.data.graduation_info.bgcolor + ' url("' + this.data.graduation_info.bgimg + ' ") no-repeat',
          'background-size': 'contain',
          'background-position': 'top',
        }
        return str;
      }
    }
  },
  methods: {
    //获取用户信息
    getUser() {
      AjaxUserInfo.getUserInfo(res => {
        if (res.code == 0) {
          this.userinfo = res.data;
        } else {
          Vue.toast(res.msg);
        }
      });
    },
    getIndex() {
      AjaxIndex.getIndex(res => {
        if (res.code == 0) {
          this.data = res.data;
          document.title = res.data.graduation_info.title;
        } else {
          Vue.toast(res.msg);
        }
      }, {
        courseid: 1
      })
    }
  }
}
