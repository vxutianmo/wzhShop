<template>
  <div class="order_page">
    <head-top head-title="订单列表" go-back='true'></head-top>
    <ul class="order_list_ul" v-load-more="loaderMore">
      <!--<li class="order_list_li" v-for="item in orderList" :key="item.id">-->
      <li class="order_list_li" v-for="(item,index) in orderList" :key="index">
        <!--<img :src="imgBaseUrl + item.restaurant_image_url" class="restaurant_image">-->
        <img src="../../images/order_pic.jpg"  class="restaurant_image"/>
        <section class="order_item_right">
          <section @click="showDetail(item)">
            <header class="order_item_right_header">
              <section class="order_header">
                <h4 >
                  <span class="ellipsis">详细订单</span>
                  <svg fill="#333" class="arrow_right">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                  </svg>
                </h4>
                <!--<p class="order_time">{{item.formatted_created_at}}</p>-->
                <p class="order_time">{{item.orderTime}}</p>
              </section>
              <!--<p class="order_status">-->
              <!--{{item.status_bar.title}}-->
              <!--</p>-->
            </header>
            <section class="order_basket">
              <p class="order_name">{{item.orderNumber}}</p>
            </section>
            <section class="order_basket">
              <p class="order_amount">实付共：¥{{item.totalOrderPrice/10000}}</p>
            </section>
          </section>
          <div class="order_again">
            <span class="buy_again" v-if="item.payStatus == 0">未付款</span>
            <span class="buy_again" v-if="item.payStatus == 1">已支付</span>
            <span class="buy_again" v-if="item.payStatus == 2">已退款</span>
            <span class="buy_again" v-if="item.payStatus == 3">取消订单(已支付)</span>
            <span class="buy_again" v-if="item.payStatus == 4">取消订单(未支付)</span>
          </div>
        </section>
      </li>
    </ul>
    <foot-guide></foot-guide>
    <transition name="loading">
      <loading v-show="showLoading"></loading>
    </transition>
    <transition name="router-slid" mode="out-in">
      <router-view></router-view>
    </transition>

  </div>
</template>

<script>
  import {mapState, mapMutations} from 'vuex'
  import headTop from 'src/components/header/head'
  import computeTime from 'src/components/common/computeTime'
  import loading from 'src/components/common/loading'
  import {getImgPath} from 'src/components/common/mixin'
  import footGuide from 'src/components/footer/footGuide'
  import {getOrderInfo} from 'src/service/getData'
  import {loadMore} from 'src/components/common/mixin'
  import {imgBaseUrl} from 'src/config/env'


  export default {
    data(){
      return{
        orderList: null, //订单列表        
        offset: 0,
        preventRepeat: false,  //防止重复获取
        showLoading: true, //显示加载动画
        imgBaseUrl
      }
    },
    mounted(){
      this.initData();
    },
    mixins: [loadMore],
    components: {
      headTop,
      footGuide,
      loading,
      computeTime,
    },
    computed: {
      ...mapState([
        'userInfo', 'geohash','openId'
      ]),
    },
    methods: {
      ...mapMutations([
        'SAVE_ORDER'
      ]),
      //初始化获取信息
      async initData(){
           console.log(this.openId)
        // if (this.userInfo && this.userInfo.user_id) {
          let res = await getOrderInfo(this.openId,null);
          console.log(res.response);
          
          this.orderList = [...res.response];
          this.hideLoading();
        // }else{
        //   this.hideLoading();
        // }
      },
      //加载更多
      async loaderMore(){
        if (this.preventRepeat) {
          return
        }
        this.preventRepeat = true;
        this.showLoading = true;
        this.offset += 10;
        //获取信息
        // let res = await getOrderList(this.userInfo.user_id, this.offset);
        // this.orderList = [...this.orderList, ...res];
        this.hideLoading();
        // if (res.length < 10) {
        //     return
        // }
        this.preventRepeat = false;
      },
      //显示详情页
      showDetail(item){
      	
        this.SAVE_ORDER(item);
        this.preventRepeat = false;
						this.$router.push({
						    path:'/orderDetail',
						    query:{
						    	orderNum:item.orderNumber
						    }
						})        
        
      },
      //生产环境与发布环境隐藏loading方式不同
      hideLoading(){
        this.showLoading = false;
      },
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
      userInfo: function (value) {
        if (value && value.user_id && !this.orderList) {
          this.initData();
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import 'src/style/mixin';

  .order_page{
    background-color: #f1f1f1;
    margin-bottom: 1.95rem;
    p, span, h4{
      font-family: Helvetica Neue,Tahoma,Arial;
    }
  }
  .order_list_ul{
    padding-top: 1.95rem;
    .order_list_li{
      background-color: #fff;
      display: flex;
      margin-bottom: 0.5rem;
      padding: .6rem .6rem 0;
      .restaurant_image{
        @include wh(2rem, 2rem);
        margin-right: 0.4rem;
      }
      .order_item_right{
        flex: 5;
        .order_item_right_header{
          border-bottom: 0.025rem solid #f5f5f5;
          padding-bottom: .3rem;
          @include fj;
          .order_header{
            h4{
              display: flex;
              align-items: center;
              justify-content: flex-start;
              @include sc(.75rem, #333);
              line-height: 1rem;
              width: 9rem;

              .arrow_right{
                @include wh(.4rem, .4rem);
                fill: #ccc;
                margin-right: .2rem;
              }
            }
            .order_time{
              @include sc(.55rem, #999);
              line-height: .8rem;
            }
          }
          .order_status{
            @include sc(.6rem, #333);
          }
        }
        .order_basket{
          @include fj;
          line-height: 1rem;
          border-bottom: 0.025rem solid #f5f5f5;
          .order_name{
            @include sc(.6rem, #666);
            width: 10rem;
          }
          .order_amount{
            @include sc(.6rem, #f60);
            font-weight: bold;
          }
        }
        .order_again{
          text-align: right;
          line-height: .6rem;
          .buy_again{
            @include sc(.55rem, $mtOrange);
            border: 0.025rem solid $mtOrange;
            padding: .1rem .2rem;
            border-radius: .15rem;
            position: relative;
            top: -4rem;
          }
        }
      }
    }
  }
  .loading-enter-active, .loading-leave-active {
    transition: opacity .7s
  }
  .loading-enter, .loading-leave-active {
    opacity: 0
  }
  .router-slid-enter-active, .router-slid-leave-active {
    transition: all .4s;
  }
  .router-slid-enter, .router-slid-leave-active {
    transform: translate3d(2rem, 0, 0);
    opacity: 0;
  }
</style>
