<template>
	<div id="wxPayErr">
		支付失败
		<button class="wxPay" @click="showDetail">订单详情</button>		
	</div>
</template>

<script>

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
		methods:{
			showDetail(){
				this.$router.push({
				    path:'/orderDetail',
				    query:{
				    	orderNum:this.orderNum
				    }
				})				
			}
		}
	}
	
</script>

<style>
</style>