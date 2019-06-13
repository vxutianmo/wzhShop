<!DOCTYPE html>
<html>

	<head>
		<meta charset="UTF-8">
		<title></title>
	</head>

	<body>
	</body>

	<script>
		function onBridgeReady() {
			WeixinJSBridge.invoke('getBrandWCPayRequest', {
				"appId": "wxabc0c03b2b2a8960",
				"nonceStr": "c64cdfef09c54fc9b5b03f5f5ca95021",
				"package": "prepay_id=wx0314470028665861119073aa0155797900",
				"paySign": "VmWwsIYv/AAL7YKUejRGtFEweahh7xt92ENTOADTqpboe1MlCvbWjV0/h8Sl90HkkWNCJq9kaIXTWVx70acIWHF2S6f7B3YFAIPe9J/9ASk1BNwHzTPVEO50ZpwyTgotEijSWENDj/ZlIdQdzwUrN0AeSJyha1els2i3ra55a+xLDRSRbSEwykfhBrFdj0xMgHdvgP9fUy3DmDqrv9JWSgCyysOCZrH+/Makj/t7X0MUcrWDs/GFPnAno8c0/HSBZurF7TILRpFZyViBsAp+qB/qeS45fCOKo0azv3fOYE16hy+vCKQENENg45dZgl6iVwPW8XnxAaoI3GzCvUWUTA==",
				"signType": "RSA",
				"timeStamp": "1559544420"
			}, function(res) {
				if(res.err_msg == "get_brand_wcpay_request:ok") {
					location.href = "http://sell.runhangtech.com/sell/wxpay/wx_return_url";
				} else if(res.err_msg == "get_brand_wcpay_request:cancel") {
					location.href = "http://sell.runhangtech.com/sell/wxpay/test";
				} else if(res.err_msg == "get_brand_wcpay_request:fail") {
					alert(JSON.stringify(res));
				}
			});
		}
		if(typeof WeixinJSBridge == "undefined") {
			if(document.addEventListener) {
				document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
			} else if(document.attachEvent) {
				document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
				document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
			}
		} else {
			onBridgeReady();
		}
	</script>

</html>