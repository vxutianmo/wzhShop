<template>
	<div class="index">
    <head-top head-title="选择自助机" go-back='true'></head-top>

		<div id="container"></div>

    <div>
      <section class="vending_list" v-for="(item,index) in vendinglist" :key="index" @click="vending(item)">
        <p>名称：{{item.vdName}}</p>
<!--        <div class="distance_img">
          <span>距离我：{{}} km</span>
          <span></span>
        </div>-->
        <p>地点：{{item.vdPoint}}</p>
        <button class="choose_button" @click="vending(item)">选择</button>
      </section>
    </div>
	</div>
</template>

<script>
  import { getVendorInfo } from 'src/service/getData'
  import headTop from 'src/components/header/head'
  import {getStore, setStore, removeStore} from 'src/config/mUtils'
  import {mapState, mapMutations} from 'vuex'

	export default {
		name: 'vendings',
		data() {
			return {
				longitude: 0, //经度
				latitude: 0, //纬度
				city: '',
				vendinglist:[],
				openId:'',
				dataTimes:''
			}
		},
	    components:{
	      headTop
	    },
	    computed:{
	      ...mapState([
	        'vendingMessage'
	      ]),
	    },
		methods: {
	      ...mapMutations([
	        'VENDING_MESSAGE'
	      ]),

			//第一部分
			//定位获得当前位置信息
			getMyLocation() {
				this.openId=localStorage.getItem('openId');
				console.log('openId:'+this.openId)

				var geolocation = new qq.maps.Geolocation("NNWBZ-E4S62-L7FUA-CRE2N-3WDNF-ZXBIX", "runhangtech");
				geolocation.getIpLocation(this.showPosition, this.showErr);
			},
		    showPosition(position) {
				console.log(position);
				this.latitude = position.lat;
				this.longitude = position.lng;
				this.city = position.city;
				this.setMap();
			},
			showErr() {
				console.log("定位失败");
				this.getMyLocation(); //定位失败再请求定位，测试使用
			},
			//第二部分
			//位置信息在地图上展示
			setMap() {
				//步骤：定义map变量 调用 qq.maps.Map() 构造函数   获取地图显示容器
				//设置地图中心点
				var myLatlng = new qq.maps.LatLng(this.latitude, this.longitude);
				//定义工厂模式函数
				var myOptions = {
					zoom: 13, //设置地图缩放级别
					center: myLatlng, //设置中心点样式
					mapTypeId: qq.maps.MapTypeId.ROADMAP //设置地图样式详情参见MapType
				}
				//获取dom元素添加地图信息
				var map = new qq.maps.Map(document.getElementById("container"), myOptions);
				//第三部分
				//给定位的位置添加图片标注
				var marker = new qq.maps.Marker({
					position: myLatlng,
					map: map
				});
				//给定位的位置添加文本标注
//				var marker = new qq.maps.Label({
//					position: myLatlng,
//					map: map,
//					content: '这是我当前的位置，偏差有点大，哈哈'
//				});

				this.vendings();
			},
			vendings(){
		        getVendorInfo(this.longitude,this.latitude).then(res => {
		        	// console.log(JSON.stringify(res['response']))
		        	this.vendinglist =res['response'];
              // localStorage.setItem('vendinglist',true);
              // setStore('vendinglist',this.vendinglist)
		        });
		        this.dataTimes=this.$store.dataTime;
		        console.log('dataTime:'+new Date().getTime())
			},
			vending(vending){
				this.VENDING_MESSAGE(vending);
				// console.log('vending-售货机信息：'+this.vendingMessage);

				this.$router.push({
				    path:'/classify?dataTime='+new Date().getTime()
				})
			}
		},

		mounted() {
			this.getMyLocation();
		}
	}
</script>

<style  lang="scss" scoped>
  @import 'src/style/mixin';
  .vending_list{
    width: 100%;
    /*height: 3.5rem;*/
    background-color: #fff;
    padding: 5px;
    margin-top: 3px;
    p{
      font-size: 13px;
      width: 75%;
    }
    p:first-child{
      font-weight: bolder;
    }
    .distance_img{
      span:before{
        content: '';
        background: url("../../images/vending_distance.png") ;
        display: inline-block;
        background-size:100% 100%;
        background-position: center;
        width: 1rem;
        height: 1rem;

      }
      span{
        font-size: 13px;
      }

    }
    p:last-child{

    };
    .choose_button{
      color: $mtOrange;
      width: 3rem;
      height: 1.5rem;
      background-color: #fff;
      border: 1px solid $mtOrange;
      border-radius: 5px;
      position: relative;
      top: -2rem;
      left: 12rem;

    }

  }
	* {
		margin: 0px;
		padding: 0px;
	}

	body,
	button,
	input,
	select,
	textarea {
		font: 12px/16px Verdana, Helvetica, Arial, sans-serif;
	}

	p {
		width: 603px;
		padding-top: 3px;
		margin-top: 10px;
		overflow: hidden;
	}

	#container {
    margin-top: 1.95rem;
		min-width: 300px;
		min-height: 250px;
	}
</style>
