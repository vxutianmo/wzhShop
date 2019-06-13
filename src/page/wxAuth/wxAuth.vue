<template>
	<div id="wxAuth">
		微信授权页面跳转...
	</div>
</template>

<script>
	import { test,userInfo } from 'src/service/getData'
    import {getStore, setStore, removeStore} from 'src/config/mUtils'
    import {mapState, mapMutations} from 'vuex'

	/**
	 * 微信网页授权
	 */
	export default {
		name: 'wxAuth',

		async created() {

			console.log("微信授权页面")
			console.log("code值：" + this.$route.query.code)
			// 如果连接中有微信返回的 code，则用此 code 调用后端接口，向微信服务器请求用户信息
			// 如果不是从微信重定向过来的，没有带着微信的 code，则直接进入首页
			if(this.$route.query.code) {

		        userInfo(this.$route.query.code,'state').then(res => {
		        	console.log(JSON.stringify(res))

		            localStorage.setItem('wxUserInfo',res);

		            this.WXUSERINFOSTATE(true);

		            localStorage.setItem('openId', res['response'][0]['openId']);

    				this.$router.replace('/vendings?dataTime='+new Date().getTime());

//					this.$router.replace('/wxPay');
		        })

			} else {
				this.$router.replace('/')
			}
		},
		methods: {
	      ...mapMutations([
	        'WXUSERINFOSTATE'
	      ]),
		}

	}
</script>
