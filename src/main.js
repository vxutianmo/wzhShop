import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './router/router'
import store from './store'
   import {routerMode} from './config/env'
import './config/rem'
import FastClick from 'fastclick'
import BaiduMap from 'vue-baidu-map'

Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: 'YOUR_APP_KEY'
})
if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}

Vue.use(VueRouter)
const router = new VueRouter({
	routes,
  mode:'history',
	strict: process.env.NODE_ENV !== 'production',
	scrollBehavior (to, from, savedPosition) {
	  if (savedPosition) {
		    return savedPosition
		} else {
			if (from.meta.keepAlive) {
				from.meta.savedPosition = document.body.scrollTop;
			}
		    return { x: 0, y: to.meta.savedPosition || 0 }
		}
	}
})


//微信授权验证
router.beforeEach((to, from, next) => {

	//验证是否微信浏览器打开
  if (!/micromessenger/i.test(navigator.userAgent)) {
  	console.log('1---')

//	this.$router.replace('/noWechat')
    next()
    return
  }

  //不对 wxAuth 路由进行拦截，不进入 wxAuth 路由就拿不到微信返回的授权 code
  if (to.path === '/wxAuth') {
  	console.log('2---')
    next()
    return
  }

  //验证微信用户信息是否为空
  let wxUserInfo = localStorage.getItem('wxUserInfo')
  let wxUserInfoState=store.state.wxUserInfoState


  console.log('wxUserInfo---'+wxUserInfo)
  console.log('wxUserInfoState---'+wxUserInfoState)

  if (wxUserInfoState == false) {
  	console.log('3---1---')

    //保存当前路由地址，授权后还会跳到此地址
    sessionStorage.setItem('wxRedirectUrl', to.fullPath)

    //请求微信授权,并跳转到 /wxAuth 路由
    let appId = 'wxabc0c03b2b2a8960'
    let redirectUrl = encodeURIComponent('http://rhtech.runhangtech.com/wxAuth?dataTime='+new Date().getTime())

    //判断是否为正式环境
//  if (window.location.origin.indexOf('https://m.xxxxxx.com') !== -1) {
//    appId = '正式服的AppId'
//    redirectUrl = encodeURIComponent('https://m.xxxxxx.com/WxAuth')
//  }

		window.location.href = `http://authtest.runhangtech.com/get_weixin_code.html?appid=${appId}&scope=snsapi_base&state=state&redirect_uri=${redirectUrl}`
  } else {
  	console.log('3---2---')
		next()
  }
})



new Vue({
	router,
	store,
}).$mount('#app')

