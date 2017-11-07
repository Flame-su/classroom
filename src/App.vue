<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>
export default {
	name: 'app'
}
import Vue from 'vue'

//加载适配
import "./static/lib/adapter.js";
// a simple toast
Vue.toast = function(txt) {
	var GToast = document.createElement('span');
	GToast.className = 'g-toast';
	GToast.innerHTML = txt;
	document.getElementById('app').appendChild(GToast);
	setTimeout(() => {
		document.getElementById('app').removeChild(GToast);
	}, 3000);
};

Vue.isAndroid = function() {
	var u = navigator.userAgent;
	var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
	var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
	console.log('isAndroid', isAndroid);
	return isAndroid;
}
</script>

<style lang='scss'>
/*写一些通用样式*/

@import './styles/_base.scss';
@import './styles/_reset.scss';
@import './styles/_common.scss';
#app {
	height: 100%;
}

.g-toast {
	max-width: 60%;
	background: rgba(0, 0, 0, .8);
	position: fixed;
	top: 50%;
	left: 50%;
	z-index: 99999;
	transform: translate(-50%, -50%);
	color: #fff;
	padding: rem(10) rem(20);
	border-radius: rem(20);
	font-size: rem(30);
	text-align: center;
}
</style>
