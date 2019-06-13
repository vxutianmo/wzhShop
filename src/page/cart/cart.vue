<template>
  <div class="classify_page">
    <head-top head-title="购物车" go-back='true' ></head-top>
    <!--<div>-->
      <section class="s_card">
        <span style="color: #000;">即时取</span>
      </section>
      <section class="empty-cart" v-if="cartList.length==0">
        <div class="info-container">
          <img src="../../images/nothing.png">
          <span class="text">购物车空空如也，快去逛逛吧</span>
          <router-link class="redirect-classify" to="/classify"><span class="goShopping">去逛逛</span></router-link>
        </div>
      </section>
      <section class="shop_container" v-else>
        <!--<transition name="fade-choose">-->
          <!--<section-->
            <!--class="food_container">-->
            <section class="menu_container">
              <section class="menu_right" ref="menuFoodList">
                <!--<button @click="tt">ttt</button>-->
                <ul>
                  <li  v-for="(foods,foodindex) in cartList" :key="foodindex"  v-if="foods.goodsQuantity==1">
                    <section class="menu_detail_list">
                      <div  tag="div" class="menu_detail_link">
                        <section  class="icon_select">
                          <div class="icon_style " @click="One(foods)">
                            <img src="../../images/selected.svg" v-if="foods.checked">
                            <img src="../../images/select.svg" v-else>
                          </div>
                        </section>
                        <section class="menu_food_img">
                          <img :src="foods.goodsImage">
                        </section>
                        <section class="menu_food_description">
                          <h3 class="food_description_head">
                            <strong class="description_foodname">{{foods.goodsName}}</strong>
                          </h3>
                          <p class="food_description_content">数量：{{foods.goodsQuantity}}</p>
                          <p class="food_description_content">设备名称：{{foods.vdName}}</p>
                        </section>
                      </div>
                      <footer class="menu_detail_footer">
                        <section class="food_price">
                          <span>¥</span>
                          <span>{{foods.goodsPrice/10000}}</span>
                        </section>
                        <section class="cart_list_control">
                          <button class="cart_delete_button" @click="cartDelete(foods)">狠心不要</button>
                        </section>
                      </footer>
                    </section>
                  </li>
                </ul>
              </section>
            </section>
          <!--</section>-->
        <!--</transition>-->

      </section>

      <!--<transition-->
        <!--appear-->
        <!--@after-appear = 'afterEnter'-->
        <!--@before-appear="beforeEnter"-->
        <!--v-for="(item,index) in showMoveDot"-->
      <!--&gt;-->
            <!--<span class="move_dot" v-if="item">-->
                <!--<svg class="move_liner">-->
                    <!--<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-add"></use>-->
                <!--</svg>-->
            <!--</span>-->
      <!--</transition>-->

      <loading v-show="showLoading"></loading>
      <section class="animation_opactiy shop_back_svg_container" v-if="showLoading">
        <img src="../../images/shop_back_svg.svg">
      </section>
      <transition name="router-slid" mode="out-in">
        <router-view></router-view>
      </transition>
    <!--</div>-->



    <section class="buy_cart_container">
      <section  class="cart_icon_num">
        <div class="cart_icon_container" >
          <section  class="icon_select">
            <div class="icon_style " @click="selectAll">
              <img src="../../images/select.svg" v-if="!this.selectStatus">
              <img src="../../images/selected.svg" v-else>
            </div>
            <span v-if="!this.selectStatus">全选</span>
            <span v-else>全不选</span>
          </section>

          <span class="total_price">
            合计￥{{totalPrice}}元
          </span>
          <section class="gotopay" v-if="totalNum!=0">
            <!--<section @click = "gotopay({path: `/cart/pay`})" class="gotopay_button_style" >-->
            <section @click = "gotopay" class="gotopay_button_style" >
              去结算 <span v-if="totalNum" style="color: #fff">({{totalNum}})</span>
            </section>
          </section>
          <section class="gotopay gotopay_gray" v-else>
            <section class="gotopay_button_style" >
              去结算 <span v-if="totalNum" style="color: #fff">({{totalNum}})</span>
            </section>
          </section>
        </div>
      </section>
    </section>
    <foot-guide></foot-guide>
  </div>
</template>
<script>
  import headTop from 'src/components/header/head'
  import footGuide from 'src/components/footer/footGuide'
  import loading from 'src/components/common/loading'

  import {mapState, mapMutations} from 'vuex'
  import {getStore, setStore, removeStore} from 'src/config/mUtils'
  import {getCartInfo,editCartInfo,genarateOrderInfo} from 'src/service/getData'

  import buyCart from 'src/components/common/buyCart'
  import ratingStar from 'src/components/common/ratingStar'
  import {loadMore, getImgPath} from 'src/components/common/mixin'
  import {imgBaseUrl} from 'src/config/env'
  import BScroll from 'better-scroll'
	import axios from 'axios'
	import {baseUrl} from 'src/config/env'

  export default {
    inject:['reload'],
    data(){
      return{
        // vdInfo:[],
        // vdInfos:[],
        // menuList:[], //食品列表
        // cartList:[],
        selectStatus:false,
        selectOne:false,
        // selectItems: {},   //选中商品列表
        activeStatus:1,
        showLoading: true, //显示加载动画
        geohash: '', //geohash位置信息
        // shopId: null, //商店id值
        changeShowType: 'food',//切换显示商品或者评价
        shopDetailData: null, //商铺详情
        showActivities: false, //是否显示活动详情
        menuIndex: 0, //已选菜单索引值，默认为0
        menuIndexChange: true,//解决选中index时，scroll监听事件重复判断设置index的bug
        shopListTop: [], //商品列表的高度集合
        TitleDetailIndex: null, //点击展示列表头部详情
        categoryNum: [], //商品类型右上角已加入购物车的数量
        // totalPrice: 0, //总共价格
        cartFoodList: [], //购物车商品列表
        showCartList: false,//显示购物车列表
        receiveInCart: false, //购物车组件下落的圆点是否到达目标位置
        preventRepeatRequest: false,// 防止多次触发数据请求
        showMoveDot: [], //控制下落的小圆点显示隐藏
        imgBaseUrl,

      }
    },
    created(){
      // this.GET_CART();
    },
    mounted(){
      this.initData();
    },
    beforeDestroy(){
      // this.foodScroll.removeEventListener('scroll', )
    },
    mixins: [loadMore, getImgPath],
    components: {
      loading,
      ratingStar,
      buyCart,
      headTop,
      footGuide

    },
    computed: {
      ...mapState([
        // 'latitude','longitude','cartList','openId','recordCart'
        'openId','recordCart','cartList','vendingMessage','getCart'
      ]),

      //购物车中总共商品的数量
      totalNum: function (){
        let num = 0;
        this.cartList.forEach((item) => {
          if(item.checked&&item.goodsQuantity){
            num+=parseInt(item.goodsQuantity);
          }
        })
        return num
      },
      //购物车中总共商品的价格
      totalPrice: function (){
        let price = 0;
        this.cartList.forEach((item) => {
          if(item.checked&&item.goodsQuantity){
            price+=parseFloat(item.goodsPrice/10000);
          }
        })
        return price
      },
    },
    methods: {
      ...mapMutations([
        // 'RECORD_ADDRESS','ADD_CART','REDUCE_CART','INIT_BUYCART','CLEAR_CART','RECORD_SHOPDETAIL','RECORD_CART'
       'RECORD_CART','GET_CART'
      ]),
      // 从购物车中删除
      cartDelete(foods){
        editCartInfo(this.openId,this.vendingMessage['vdCode'],foods.goodsId,0).then((res)=>{
        });
        foods.goodsQuantity=0;//将购物车数量置为0
      },

      OneTrue(foods){
        foods.checked=true;
      },
      OneFalse(foods){
        foods.checked=false;
      },
      One(foods){
        !foods.checked? this.OneTrue(foods) : this.OneFalse(foods);
      },
      selectAll(){
        if(!this.selectStatus){
          this.cartList.forEach((foods)=>{
            this.OneTrue(foods)
          })
        }else{
          this.cartList.forEach((foods)=>{
            this.OneFalse(foods)
          })
        }
        this.selectStatus=!this.selectStatus;
      },
      gotopay(){

        let vdCodeLC=[];
        let vdCodeL=[];
        this.cartList.forEach((item,index)=>{
        	if(item.goodsQuantity==1&&item.checked){
        		console.log(index)
        	  console.log(item)
        	  vdCodeLC.push(item.vdCode)
        	}
        });

        this.vdCodeL= Array.from(new Set(vdCodeLC));
        console.log(vdCodeL)

				let vdInfo ='';
				let vdInfoL ='';
				let jsonL='';

				this.vdCodeL.forEach((itemL,index)=>{
					console.log('itemL:'+itemL)

					let jsonIdCount='';
					let jsonIdCountL='';
					let vdTotalPrice = 0;

			    this.cartList.forEach((item,index)=>{
			    	if(item.vdCode==itemL && item.goodsQuantity==1 && item.checked){

						  jsonIdCount += '{'+ 'goodsId:' + '"'+item.goodsId + '",' + 'goodsPrice:' + '"'+item.goodsPrice + '",'+'goodsQuantity:' + '"'+item.goodsQuantity + '"},';

						  vdTotalPrice+=item.goodsPrice;
			    	}
			    });

		      jsonIdCountL = jsonIdCount.substring(0, jsonIdCount.length - 1);
//	    		console.log(jsonIdCountL)
//	    		console.log(vdTotalPrice)

					vdInfo += '{'+ 'vdCode:' + '"'+itemL + '",' + 'vdTotalPrice:' + '"'+vdTotalPrice*10000 + '",'+'goodsInfo:' + '[' + jsonIdCountL + ']},';

				});
				vdInfoL=vdInfo.substring(0, vdInfo.length - 1);
				jsonL= "["+vdInfoL+"]";
				console.log(jsonL)

//       genarateOrderInfo(this.openId,this.totalPrice,jsonL).then((res)=>{
//         console.log(res);
//       });

				axios.get(baseUrl+'/sell/presale/generate_orders', {
				　　params: {
					openId: this.openId,
					totalOrderPrice:this.totalPrice*10000,
					vdInfo:jsonL
					}
				}).then( (response)=>{
				　　console.log(response.data);
					if(response.data.result == 'success'){
						this.$router.push({
						    path:'/wxPay',
						    query:{
						    	orderNum:response.data.response
						    }
						})
					}

				}).catch(function (error) {
				　　console.log(error);
				});

      },
      // classification(vdCode){
      //   this.cartList.filter(function(a){
      //     // console.log(a)
      //     return a.badgeNature == vdCode
      //   }).map(function(a){
      //     switch(vdCode){
      //       case '866633031248926':
      //         this.vdInfo.push(a)
      //       default:
      //         this.vdInfos.push(a)
      //     }
      //   });
      // },
      //初始化时获取基本数据
      async initData(){
        // this.cartList.forEach((foods,item)=>{
        //   foods.checked=false;
        // })
        //获取购物车列表
        // this.cartList = await getCartInfo(this.openId);
        // this.cartList = this.cartList.response;
        getCartInfo(this.openId).then((res)=>{
          // this.cartList=res['response']
          this.RECORD_CART(res.response);
          // this.cartList=this.cartList;
          // console.log(this.cartList);
        })
        //隐藏加载动画
        this.hideLoading();
        // alert("重新刷新购物车信息")
      },

      //监听圆点是否进入购物车
      listenInCart(){
        if (!this.receiveInCart) {
          this.receiveInCart = true;
          this.$refs.cartContainer.addEventListener('animationend', () => {
            this.receiveInCart = false;
          })
          this.$refs.cartContainer.addEventListener('webkitAnimationEnd', () => {
            this.receiveInCart = false;
          })
        }
      },

      //隐藏动画
      hideLoading(){
        this.showLoading = false;
      },

      goback(){
        this.$router.go(-1);
      }
    },
    // beforeRouteEnter(to, from, next) {
    //   if (from.path == "/classify") {
    //     from.meta.keepAlive = false;
    //   }
    //   next();
    // },
    // beforeRouteLeave(to, from, next) {
    //   if (to.path == "/classify") {
    //     to.meta.keepAlive = true;
    //   }
    //   next();
    // },
    watch: {
      //showLoading变化时说明组件已经获取初始化数据，在下一帧nextTick进行后续操作
      showLoading: function (value){
        if (!value) {
          this.$nextTick(() => {
            // this.getFoodListHeight();
            // this.initCategoryNum();
          })
        }
      },
      shopCart: function (value){
        // this.initCategoryNum();
      },

    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "../../style/mixin";
  .shop_container{
  	padding-bottom: 5rem;
  }
  .info-container {
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .goShopping{
      color: $mtOrange;
    }
  }
  .cart_delete_button{
    background-color: #fff;
    border: 1px solid $mtOrange;
    color: $mtOrange;
    font-weight: bolder;
    padding: .3rem .6rem .3rem .6rem;
    position: absolute;
    right: 1rem;
    bottom: .2rem;
  }
  input[type="checkbox"]{
    display: none;
  }
  .select{
    position: relative;
    display: inline-block;
    z-index: 1;
    border: 3px solid $mtOrange;
    margin-left: 10px;
    border-radius: 50%;
    width: .7rem;
    height: .7rem;
    cursor: pointer;
  }
  label.mark{
    background: url("../../images/mark1.png") no-repeat -1px -1px;
  }
  .parentCheck{
    margin-top: 1rem;
  }

  .cart_list_control{
    display: flex;
    align-items: center;
    span{
      display: flex;
      align-items: center;
      justify-content: center;
    }
    svg{
      @include wh(.9rem, .9rem);
      fill: $mtOrange;
    }
    .specs_reduce_icon{
      fill: #999;
    }
    .cart_num{
      @include sc(.65rem, #666);
      min-width: 1rem;
      text-align: center;
      font-family: Helvetica Neue,Tahoma;
    }
  }
  .icon_select{
    width:1.5rem;
    height: 1.5rem;
    margin-top: 1rem;
    margin-right: 2rem;
    .icon_style{
      width: 1rem;
      img{
        width: 100%;
        height: 100%;
      }

    }
    span{
      position: absolute;
      top:1.4rem;
      left: 1.7rem;
      color: #000;
      font-size: 16px;
    }

  }
  .selectAll{
    position: absolute;
    left: 2rem;
    top: 1.5rem;
    color: $mtOrange;
    font-size: 14px;
  }
  .s_card{
    width: 90%;
    height: 1.5rem;
    border:1px solid #fff;
    border-radius: 5px;
    background-color: #fff;
    position: fixed;
    margin: 0 auto;
    top: 1.8rem;
    left: 5%;
    z-index: 999;
    /*text-align: center;*/
    font-size: 14px;
    font-weight: bold;
    span{
      display: block;
      margin-top: 4px;
    }

  }
  .geography_position{
    padding-top:1.95rem;
    .geography-link{
      display:block;
      display:flex;
      box-align: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      background:$mtGreen;
      padding: .666667rem .6rem;
    }
  }
  .submit {
    position: absolute;
    left: 13rem;
    top: 1rem;
    margin-right: 0.1rem;
    text-align: center;
    font-size: 0.5rem;
    color: #fff;
    background: $mtYellow;
    display: inline-block;
    @include px2rem(width, 186);
    @include px2rem(line-height, 68);
    &.active {
      background: $mtGrey;
    }
  }
  .selected {
    text-align: center;
    background: $mtYellow;
    @include px2rem(line-height, 35);
    display: inline-flex;
    justify-content: center;
    align-items: center;
    .iconfont {
      font-size: 0.5rem;
    }
  }

  .c_body{
    margin-top: 2rem;
  }
  @keyframes mymove{
    0%   { transform: scale(1) }
    25%  { transform: scale(.8) }
    50%  { transform: scale(1.1) }
    75%  { transform: scale(.9) }
    100% { transform: scale(1) }
  }
  @-moz-keyframes mymove{
    0%   { transform: scale(1) }
    25%  { transform: scale(.8) }
    50%  { transform: scale(1.1) }
    75%  { transform: scale(.9) }
    100% { transform: scale(1) }
  }
  @-webkit-keyframes mymove{
    0%   { transform: scale(1) }
    25%  { transform: scale(.8) }
    50%  { transform: scale(1.1) }
    75%  { transform: scale(.9) }
    100% { transform: scale(1) }
  }
  @-o-keyframes mymove{
    0%   { transform: scale(1) }
    25%  { transform: scale(.8) }
    50%  { transform: scale(1.1) }
    75%  { transform: scale(.9) }
    100% { transform: scale(1) }
  }
  .shop_back_svg_container{
    position: fixed;
    @include wh(100%, 100%);
    img{
      @include wh(100%, 100%);
    }
  }
  .shop_container{
    display: flex;
    flex-direction: column;
    position: absolute;
    right: 0;
    left: 0;
    height: 100%;
    width: 90%;
    margin: 0 auto;
    margin-top: 3.5rem;
    border-radius: 15px;
  }
  .goback{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 2rem;
    z-index: 11;
    padding-top: 0.2rem;
    padding-left: 0.2rem;
  }



  .food_container{
    display: flex;
    flex: 1;
    padding-bottom: 2rem;
  }
  .menu_container{
    display: flex;
    flex: 1;
    overflow-y: hidden;
    position: relative;
    .menu_left{
      width: 3.8rem;
      .menu_left_li{
        padding: .7rem .3rem;
        border-bottom: 0.025rem solid #ededed;
        box-sizing: border-box;
        border-left: 0.15rem solid #f8f8f8;
        position: relative;
        img{
          @include wh(.5rem, .6rem);
        }
        span{
          @include sc(.6rem, #666);
        }
        .category_num{
          position: absolute;
          top: .1rem;
          right: .1rem;
          background-color: #ff461d;
          line-height: .6rem;
          text-align: center;
          border-radius: 50%;
          border: 0.025rem solid #ff461d;
          min-width: .6rem;
          height: .6rem;
          @include sc(.5rem, #fff);
          font-family: Helvetica Neue,Tahoma,Arial;
        }
      }
      .activity_menu{
        border-left: 0.15rem solid $mtOrange;
        background-color: #fff;
        span:nth-of-type(1){
          font-weight: bold;
        }
      }
    }
    .menu_right{
      flex: 4;
      overflow-y: auto;
      .menu_detail_header{
        width: 100%;
        padding: .4rem;
        position: relative;
        @include fj;
        align-items: center;
        .menu_detail_header_left{
          width: 11rem;
          white-space: nowrap;
          overflow: hidden;
          .menu_item_title{
            @include sc(.7rem, #666);
            font-weight: bold;
          }
          .menu_item_description{
            @include sc(.5rem, #999);
            width: 30%;
            overflow: hidden;
          }
        }
        .menu_detail_header_right{
          @include wh(.5rem, 1rem);
          display: block;
          @include bis('../../images/icon_point.png');
          background-size: 100% .4rem;
          background-position: left center;
        }
        .description_tip{
          background-color: #39373a;
          opacity: 0.95;
          @include sc(.5rem, #fff);
          position: absolute;
          top: 1.5rem;
          z-index: 14;
          width: 8rem;
          right: .2rem;
          padding: .5rem .4rem;
          border: 1px;
          border-radius: .2rem;
          span{
            color: #fff;
            line-height: .6rem;
            font-size: .55rem;
          }
        }
        .description_tip::after{
          content: '';
          position: absolute;
          @include wh(.4rem, .4rem);
          background-color: #39373a;
          top: -.5rem;
          right: .7rem;
          transform: rotate(-45deg) translateY(.41rem);
        }
      }
      .menu_detail_list{
        background-color: #fff;
        padding: .6rem .4rem;
        border-bottom: 1px solid #f8f8f8;
        position: relative;
        overflow: hidden;
        .menu_detail_link{
          display:flex;
          .menu_food_img{
            margin-right: .4rem;
            img{
              @include wh(2rem, 2rem);
              display: block;
            }
          }
          .menu_food_description{
            width: 100%;
            .food_description_head{
              @include fj;
              margin-bottom: .2rem;
              .description_foodname{
                @include sc(.7rem, #333);
              }
              .attributes_ul{
                display: flex;
                li{
                  font-size: .3rem;
                  height: .6rem;
                  line-height: .35rem;
                  padding: .1rem;
                  border: 1px solid #666;
                  border-radius: 0.3rem;
                  margin-right: .1rem;
                  transform: scale(.8);
                  p{
                    white-space: nowrap;
                  }
                }
                .attribute_new{
                  position: absolute;
                  top: 0;
                  left: 0;
                  background-color: #4cd964;
                  @include wh(2rem, 2rem);
                  display: flex;
                  align-items: flex-end;
                  transform: rotate(-45deg) translate(-.1rem, -1.5rem);
                  border: none;
                  border-radius: 0;
                  p{
                    @include sc(.4rem, #fff);
                    text-align: center;
                    flex: 1;
                    transform: scale(0.8) translate(0.1rem, -.1rem);
                  }
                }
              }
            }
            .food_description_content{
              @include sc(.5rem, #999);
              line-height: .6rem;
            }
            .food_description_sale_rating{
              line-height: .8rem;
              span{
                @include sc(.5rem, #333);
              }
            }
            .food_activity{
              line-height: .4rem;
              span{
                font-size: .3rem;
                border: 1px solid currentColor;
                border-radius: 0.3rem;
                padding: .08rem;
                display: inline-block;
                transform: scale(.8);
                margin-left: -0.35rem;

              }
            }
          }
        }
        .menu_detail_footer{
          margin-left: 2.4rem;
          font-size: 0;
          margin-top: .3rem;
          @include fj;
          .food_price{
            margin-left: 2.5rem;
            span{
              font-family: 'Helvetica Neue',Tahoma,Arial;
            }
            span:nth-of-type(1){
              @include sc(.5rem, #f60);
              margin-right: .05rem;
            }
            span:nth-of-type(2){
              @include sc(.7rem, #f60);
              font-weight: bold;
              margin-right: .3rem;
            }
            span:nth-of-type(3){
              @include sc(.5rem, #666);
            }
          }
        }
      }
    }
  }
  .buy_cart_container{
    position: fixed;
    background-color: #fff;
    bottom: 2rem;
    left: 0;
    z-index: 13;
    display: flex;
    @include wh(100%, 2rem);
    .cart_icon_num{
      flex: 1;
      .cart_icon_container{
        display: flex;
        position: absolute;
        padding: .4rem;
        left: .5rem;
        top: -.7rem;
        .total_price{
          font-size: .6rem;
          margin-top: 1rem;
          /*margin-left: 2rem;*/
          color: $mtOrange;
        }
        .cart_icon{
          @include wh(1.2rem, 1.2rem);
        }
        .cart_list_length{
          position: absolute;
          top: -.25rem;
          right: -.25rem;
          background-color: #ff461d;
          line-height: .7rem;
          text-align: center;
          border-radius: 50%;
          border: 0.025rem solid #ff461d;
          min-width: .7rem;
          height: .7rem;
          @include sc(.5rem, #fff);
          font-family: Helvetica Neue,Tahoma,Arial;
        }
      }
      .move_in_cart{
        animation: mymove .5s ease-in-out;
      }
      .cart_icon_activity{
        background-color: $mtOrange;
      }
      .cart_num{
        @include ct;
        left: 3.5rem;

        div{
          color: #fff;
        }
        div:nth-of-type(1){
          font-size: .8rem;
          font-weight: bold;
          margin-bottom: .1rem;
        }
        div:nth-of-type(2){
          font-size: .4rem;
        }
      }
    }
    .gotopay{
      position: absolute;
      top: .7rem;
      left: 10rem;
      background-color: $mtOrange;
      @include wh(5rem, 2rem);
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      .gotopay_button_style{
        @include sc(.7rem, #fff);
        font-weight: bold;
      }
    }
    .gotopay_gray{
      background-color: gray;
    }
    .gotopay_acitvity{
      background-color: #4cd964;
    }
  }
  .move_dot{
    position: fixed;
    bottom: 30px;
    left: 30px;

    svg{
      @include wh(.9rem, .9rem);
      fill: $mtOrange;
    }
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-active {
    opacity: 0;
  }
  .fade-choose-enter-active, .fade-choose-leave-active {
    transition: opacity .5s;
  }
  .fade-choose-leave, .fade-choose-leave-active {
    display: none;
  }
  .fade-choose-enter, .fade-choose-leave-active {
    opacity: 0;
  }
  .router-slid-enter-active, .router-slid-leave-active {
    transition: all .4s;
  }
  .router-slid-enter, .router-slid-leave-active {
    transform: translate3d(2rem, 0, 0);
    opacity: 0;
  }
  .toggle-cart-enter-active, .toggle-cart-leave-active {
    transition: all .3s ease-out;
  }
  .toggle-cart-enter, .toggle-cart-leave-active {
    transform: translateY(100%);
  }

</style>
