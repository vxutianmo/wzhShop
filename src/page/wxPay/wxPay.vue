<template>
	<div id="wxPay">
		<div>订单号：{{orderNum}}</div>
		<button class="wxPay" @click="wxPay">微信支付</button>
	</div>
</template>

<script>
	import { wpsale } from 'src/service/getData'
	import axios from 'axios'
	import {baseUrl,frontUrl} from 'src/config/env'

	export default {
		data() {
			return {
				openId: '',
				orderNum:''
			}
		},
		async created() {
			console.log('created---')
			this.openId = localStorage.getItem('openId');
			console.log('wxPay--openId:' + this.openId);
			
			this.orderNum=this.$route.query.orderNum;
			console.log(this.orderNum);
		},
		methods: {

			wxPay() {

				let outTradeNum = this.orderNum;
				let price = '0.01';
				let infors = '微信支付';				
				//支付成功回调地址
				let returnUrl = 'http://sell.runhangtech.com/sell/wxpay/test';
				//支付取消地址
				let cancleUrl = frontUrl+'/sell/wxpay/test';
				//支付异常地址
				let failUrl = frontUrl+'/sell/wxpay/test';
				let openid = this.openId;
				
//				this.wxSale(outTradeNum,price,infors,returnUrl,cancleUrl,failUrl,openid);

				this.wxSaleL(openid,outTradeNum);
       		},
			
			wxSaleL(openIdL,orderNumberL){
				axios.get(baseUrl+'/sell/presale/payment', {
				    params: {
						orderNumber:orderNumberL,
						openId:openIdL
				    }
				  })
				  .then((response)=> {
				  	console.log(response.data)
				    console.log(response.data.response.payInfo);
				    
				    this.wxPayLS(response.data.response.payInfo);

				  })
				  .catch(function (error) {
				    console.log(error);
				  });				
			},
			
			wxPayLS(payInfoL){
				console.log('wxPay：'+payInfoL);
				
				WeixinJSBridge.invoke('getBrandWCPayRequest', {
					"appId": payInfoL.appId,
					"nonceStr": payInfoL.nonceStr,
					"package": payInfoL.package,
					"paySign": payInfoL.paySign,
					"signType": payInfoL.signType,
					"timeStamp": payInfoL.timeStamp
				}, function(res) {
					if(res.err_msg == "get_brand_wcpay_request:ok") {						
//						location.href = frontUrl+"wxpay/wx_return_url";//支付成功
						console.log('res:'+res.err_msg)

						this.$router.push({
						    path:'/orderDetail',
						    query:{
						    	orderNum:this.orderNum
						    }
						})

					} else if(res.err_msg == "get_brand_wcpay_request:cancel") {						
//						location.href = frontUrl+"/sell/wxpay/test";//支付失败
						console.log('res:'+res.err_msg)
						
						this.$router.push({
						    path:'/orderDetail',
						    query:{
						    	orderNum:this.orderNum
						    }
						})
				
					} else if(res.err_msg == "get_brand_wcpay_request:fail") {
						console.log('res:'+res.err_msg)
						alert(JSON.stringify(res));
					}
				});

				if(typeof WeixinJSBridge == "undefined") {
					if(document.addEventListener) {
						document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
					} else if(document.attachEvent) {
						document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
						document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
					}
				} else {
//					onBridgeReady();
				}

			},

			wxSale(outTradeNumL,priceL,inforsL,returnUrlL,cancleUrlL,failUrlL,openidL){

				axios.get(baseUrl+'/sell/wxpay/wp_sale', {
				    params: {
						outTradeNum:outTradeNumL,
						price:priceL,
						infors:inforsL,
						returnUrl:returnUrlL,
						cancleUrl:cancleUrlL,
						failUrl:failUrlL,
						openid:openidL
				    }
				  })
				  .then(function (response) {

				    console.log(response.data);
				    let data=response.data;

				    //微信支付代码
					var reg = /<script[^>]*>([^\x00]+)$/i
					var htmlBlock = data.split("<\/script>");
					for(var i in htmlBlock) {
						var blocks; //匹配正则表达式的内容数组，blocks[1]就是真正的一段脚本内容，因为前面reg定义我们用了括号进行了捕获分组
						if(blocks = htmlBlock[i].match(reg)) {
							//清除可能存在的注释标记，对于注释结尾-->可以忽略处理，eval一样能正常工作
							var code = blocks[1].replace(/<!--/, '');
							try {
								eval(code) //执行脚本
							} catch(e) {}
						}
					}

				  })
				  .catch(function (error) {
				    console.log(error);
				  });

			},
		}
	}
</script>

<style>
	.wxPay {
		width: 100px;
		height: 50px;
	}
</style>
