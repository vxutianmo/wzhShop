<template>
  <div class="order_detail_page">
    <head-top head-title="订单详情" go-back='true'></head-top>
    <section v-if="!showLoading" id="scroll_section" class="scroll_container">
      <section class="scroll_insert">
        <section class="order_detail_style">
          <section class="item_style">
            <p class="item_left">订单编号：</p>
            <div class="item_right">
              <p>{{orderList.orderNumber}}</p>
            </div>
          </section>
          <section class="item_style">
            <p class="item_left">下单时间：</p>
            <div class="item_right">
              <p>{{orderList.orderTime}}</p>
            </div>
          </section>
          <section class="item_style">
            <p class="tips">(请24h内凭取货码到售货机取货!)</p>
          </section>
        </section>

        <section class="order_detail_style" v-for="(item,index) in orderList.vdInfo" :key="index">
        	<section class="item_style">
            <p class="item_left">取货地址：</p>
            <div class="item_right">
              <p>{{item.vdName}}({{item.vdPoint}})</p>
            </div>
          </section>
          <section class="item_style" v-for="(code,codeindex) in item.goodsInfo" :key="codeindex">
            <img :src="code.goodsImage" />
            <div>
              <p style="color: gray">{{code.goodsName}}</p>
              <div class="item_style" style="padding-left: 0">
                <p class="item_left" style="color: #FD6B00;width: 3rem">取货码：</p>
                <div class="item_right">
                  <p v-if="code.PickUpCode"  style="color: #FD6B00">{{code.PickUpCode}}</p>
                  <p v-else  style="color: #FD6B00;">无</p>
                </div>
              </div>
            </div>

          </section>
          
        </section>
      </section>
    </section>

    <section class="buy_cart_container" v-if="orderList.payStatus==0">
      <section  class="cart_icon_num">
        <div class="cart_icon_container" >

          <span class="total_price">
            合计￥{{orderList.totalOrderPrice/10000}}元
          </span>
          <section class="gotopay">
            <section class="gotopay_button_style"  @click = "gotopay">
              去结算
            </section>
          </section>

        </div>
      </section>
    </section>
    <transition name="loading">
      <loading v-if="showLoading"></loading>
    </transition>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import headTop from 'src/components/header/head'
  import {getImgPath} from 'src/components/common/mixin'
  import {getOrderDetails} from 'src/service/getData'
  import loading from 'src/components/common/loading'
//import BScroll from 'better-scroll'
  import {imgBaseUrl} from 'src/config/env'


  export default {

    data(){
      return{
        showLoading: true, //显示加载动画
        // orderData: null,
        orderNum:null,
        orderList: [],
        imgBaseUrl
      }
    },
		async created() {
			console.log('created---')

			this.orderNum=this.$route.query.orderNum;
			console.log(this.orderNum);
			getOrderDetails(this.orderNum).then((res) => {
        	this.orderList=res.response;
        	console.log(this.orderList);
       })
		},
    mounted(){
      this.initData();
    },
    mixins: [getImgPath],
    components: {
      headTop,
      loading,
    },
    computed: {
      ...mapState([
        // 'orderDetail', 'geohash', 'userInfo'
        // 'orderList',
      ]),
    },
    methods: {
      async initData(){
        // if (this.userInfo && this.userInfo.user_id) {
          // this.orderData = await getOrderDetail(this.userInfo.user_id, this.orderDetail.unique_id);
//      console.log(JSON.stringify(this.orderList[0].orderNumber));

          // this.orderList = await getOrderDetail(JSON.stringify(this.orderList[0].orderNumber));
          this.showLoading = false;
//        this.$nextTick(() => {
//          new BScroll('#scroll_section', {
//            deceleration: 0.001,
//            bounce: true,
//            swipeTime: 1800,
//            click: true,
//          });
//        })
        // }
      },
      gotopay(){
        this.$router.push({
          path:'/wxPay',
          query:{
            orderNum:this.orderList.orderNumber
          }
        });
      }
//    getOrderDetails(){


//    }

    },
    // beforeRouteLeave(to, from, next) {
    //   if (to.path == "/classify") {
    //     to.meta.keepAlive = true;
    //   }
    //   next();
    // },
    watch: {
      // userInfo: function (value) {
      //   if (value && value.user_id) {
      //     this.initData();
      //   }
      // }
    }
  }
</script>

<style lang="scss" scoped>
  @import 'src/style/mixin';
  .order_status{
    color: $mtOrange;
    font-size: 16px;
  }
  .buy_cart_container{
    position: fixed;
    background-color: #fff;
    bottom: 0;
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
  .order_detail_page{
    /*position: fixed;*/
    /*top: 0;*/
    /*left: 0;*/
    /*right: 0;*/
    /*bottom: 0;*/
    background-color: #f1f1f1;
    /*z-index: 202;*/
    /*padding-top: 1.95rem;*/
    p, span{
      font-family: Helvetica Neue,Tahoma,Arial;
    }
  }
  .scroll_container{
    /*position: fixed;*/
    /*top: 0;*/
    /*left: 0;*/
    /*right: 0;*/
    /*bottom: 0;*/
    @include wh(100%,100%);

    padding-top: 1.95rem;
    padding-bottom: 2.5rem;
  }
  .scroll_insert{
    @include wh(100%,100%);
    /*padding-bottom: 1rem;*/
    overflow-y: scroll;
  }
  .order_detail_style{
    background-color: #fff;
    margin-top: 0.5rem;
    header{
      @include sc(.75rem, #333);
      padding: .5rem;
      border-bottom: 1px solid #f5f5f5;
    }
    .item_style{
      display: flex;
      padding: .5rem;
      .item_left{
        width: 5rem;
      }
      img{
        width: 2rem;
        height: 2rem;
        margin-right: 1rem;
      }
      p{
        @include sc(.65rem, #666);
        line-height: 1rem;
      }

      .tips{
        color: $mtOrange;
      }
    }
  }
  .loading-enter-active, .loading-leave-active {
    transition: opacity .7s
  }
  .loading-enter, .loading-leave-active {
    opacity: 0
  }

</style>
