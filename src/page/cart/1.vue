<template>
  <div class="classify_page">
    <head-top head-title="购物车" go-back='true' ></head-top>
    <div>
      <section class="s_card">
        <span style="color: #000;">即时取</span>
      </section>
      <section v-if="!showLoading" class="shop_container">
        <transition name="fade-choose">
          <section
            class="food_container">
            <section class="menu_container">
              <section class="menu_right" ref="menuFoodList">
                <ul>
                  <li  v-for="(foods,foodindex) in menuList" :key="foodindex"  >
                    <section class="menu_detail_list">
                      <div  tag="div" class="menu_detail_link">
                        <!--选择按钮-->
                        <!--<section -->
                        <!--class="icon_select" -->
                        <!--@click="selectItems">-->
                        <!--<div class="icon_style">-->
                        <!--<img src="../../images/select.svg" v-if="activeStatus =='-1'">-->
                        <!--<img src="../../images/selected.svg" v-else>-->
                        <!--</div>-->
                        <!--</section>-->
                        <!--<span-->
                        <!--class="icon_select"-->
                        <!--@click="allSelect">-->
                        <!--<img src="../../images/select.svg"-->
                        <!--v-if="selectItems['allSelect'] === true">-->
                        <!--<img src="../../images/selected.svg" v-else>-->
                        <!--</span>-->
                        <section class="icon_select" >
                          s
                        </section>

                        <section class="menu_food_img">
                          <!--<img :src="imgBaseUrl + foods.image_path">-->
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
                          <span>{{foods.goodsPrice}}</span>
                        </section>
                        <!--<buy-cart :shopId='shopId' :foods='foods' @moveInCart="listenInCart" @showMoveDot="showMoveDotFun"></buy-cart>-->
                        <!--<buy-cart :openId='openId' :foods='foods' @moveInCart="listenInCart" @showMoveDot="showMoveDotFun"></buy-cart>-->
                        <section class="cart_list_control">
                                            <span @click="removeOutCart(item.category_id, item.item_id, item.food_id, item.name, item.price, item.specs)">
                                                <svg>
                                                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-minus"></use>
                                                </svg>
                                            </span>
                          <span class="cart_num">{{foods.goodsQuantity}}</span>
                          <!--<svg class="cart_add" @click="addToCart(item.category_id, item.item_id, item.food_id, item.name, item.price, item.specs)">-->
                          <svg class="cart_add" @click="addToCart(foods.vdCode, foods.goodsId, foods.goodsQuantity)">
                            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-add"></use>
                          </svg>
                        </section>
                      </footer>
                    </section>
                  </li>
                </ul>
              </section>
            </section>
          </section>
        </transition>

      </section>

      <transition
        appear
        @after-appear = 'afterEnter'
        @before-appear="beforeEnter"
        v-for="(item,index) in showMoveDot"
      >
            <span class="move_dot" v-if="item">
                <svg class="move_liner">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-add"></use>
                </svg>
            </span>
      </transition>
      <loading v-show="showLoading"></loading>
      <section class="animation_opactiy shop_back_svg_container" v-if="showLoading">
        <img src="../../images/shop_back_svg.svg">
      </section>
      <transition name="router-slid" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>



    <section class="buy_cart_container">
      <section  class="cart_icon_num">
        <div class="cart_icon_container" >
          <!--<section class="icon_select" @click="selectItems">-->
          <!--<div class="icon_style ">-->
          <!--<img src="../../images/select.svg" v-if="activeStatus =='-1'">-->
          <!--<img src="../../images/selected.svg" v-else>-->
          <!--</div>-->
          <!--</section>-->
          <!--<span class="selectAll">全选</span>-->
          <span class="total_price">
            合计￥{{totalPrice}}元
          </span>
          <section class="gotopay" >
            <section @click = "gotopay({path: `/cart/pay`})" class="gotopay_button_style" >
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
  import {msiteAddress, shopDetails, foodMenu, getRatingList, ratingScores, ratingTags} from 'src/service/getData'

  import buyCart from 'src/components/common/buyCart'
  import ratingStar from 'src/components/common/ratingStar'
  import {loadMore, getImgPath} from 'src/components/common/mixin'
  import {imgBaseUrl} from 'src/config/env'
  import BScroll from 'better-scroll'
  export default {
    data(){
      return{
        menuList:[
          {
            goodsId:"1",
            goodsName:"商品名称1",
            goodsCategory:"商品类别1",
            goodsPrice:"12",
            goodsQuantity:"1",
            vdCode:"设备工控编号",
            vdName:"设备名称",
            goodsImage:"https://wanghong-mall.oss-cn-beijing.aliyuncs.com/productImgs/5b89f70feb95452f87f6cfd712d2a642.png",
          },
          {
            goodsId:"2",
            goodsName:"商品名称2",
            goodsCategory:"商品类别2",
            goodsPrice:"32",
            goodsQuantity:"2",
            vdCode:"设备工控编号",
            vdName:"设备名称",
            goodsImage:"https://wanghong-mall.oss-cn-beijing.aliyuncs.com/productImgs/5b89f70feb95452f87f6cfd712d2a642.png",
          },
          {
            goodsId:"3",
            goodsName:"商品名称3",
            goodsCategory:"商品类别3",
            goodsPrice:"11",
            goodsQuantity:"3",
            vdCode:"设备工控编号",
            vdName:"设备名称",
            goodsImage:"https://wanghong-mall.oss-cn-beijing.aliyuncs.com/productImgs/5b89f70feb95452f87f6cfd712d2a642.png",
          },
          {
            goodsId:"4",
            goodsName:"商品名称4",
            goodsCategory:"商品类别4",
            goodsPrice:"22",
            goodsQuantity:"4",
            vdCode:"设备工控编号",
            vdName:"设备名称",
            goodsImage:"https://wanghong-mall.oss-cn-beijing.aliyuncs.com/productImgs/5b89f70feb95452f87f6cfd712d2a642.png",
          },
          {
            goodsId:"5",
            goodsName:"商品名称5",
            goodsCategory:"商品类别1",
            goodsPrice:"12",
            goodsQuantity:"5",
            vdCode:"设备工控编号",
            vdName:"设备名称",
            goodsImage:"https://wanghong-mall.oss-cn-beijing.aliyuncs.com/productImgs/5b89f70feb95452f87f6cfd712d2a642.png",
          },
        ], //食品列表
        selectItems: {},   //选中商品列表
        activeStatus:1,
        showLoading: true, //显示加载动画
        geohash: '', //geohash位置信息
        // shopId: null, //商店id值
        openId: null, //商店id值
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
        foodScroll: null,  //食品列表scroll
        showSpecs: false,//控制显示食品规格
        specsIndex: 0, //当前选中的规格索引值
        choosedFoods: null, //当前选中视频数据
        showDeleteTip: false, //多规格商品点击减按钮，弹出提示框
        showMoveDot: [], //控制下落的小圆点显示隐藏
        windowHeight: null, //屏幕的高度
        elLeft: 0, //当前点击加按钮在网页中的绝对top值
        elBottom: 0, //当前点击加按钮在网页中的绝对left值
        imgBaseUrl,

      }
    },
    created(){
      this.geohash = this.$route.query.geohash;
      this.shopId = this.$route.query.id;
      this.openId = this.$route.query.id;
      this.INIT_BUYCART();
    },
    mounted(){
      this.initData();
      this.windowHeight = window.innerHeight;
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
        'latitude','longitude','cartList'
      ]),

      //购物车中总共商品的数量
      totalNum: function (){
        let num = 0;
        // this.cartFoodList.forEach(item => {
        this.menuList.forEach((item) => {
          num+=parseInt(item.goodsQuantity);
        })
        return num
      },
      //购物车中总共商品的价格
      totalPrice: function (){
        let price = 0;
        // this.cartFoodList.forEach(item => {
        this.menuList.forEach((item) => {
          price+=parseInt(item.goodsPrice);
        })
        return price
      },
    },
    methods: {
      ...mapMutations([
        'RECORD_ADDRESS','ADD_CART','REDUCE_CART','INIT_BUYCART','CLEAR_CART','RECORD_SHOPDETAIL'
      ]),
      changeNumber(id,val){
        var i=this.findPosition(id);
        var number=this.goodsList[i].number;
        this.updateGoods({
          index:i,
          key:"number",
          value:number+val<=0?1:number+val
        })
      },

      allSelect(){
        console.log(this.selectItems)
      },
      selectItems(){
        this.activeStatus=-this.activeStatus;
      },
      gotopay(path){
        this.$router.push(path);
      },
      //初始化时获取基本数据
      async initData(){
        // if (!this.latitude) {
        //获取位置信息
        // let res = await msiteAddress(this.geohash);
        // 记录当前经度纬度进入vuex
        // this.RECORD_ADDRESS(res);
        // }
        //获取商铺信息
        // this.shopDetailData = await shopDetails(this.shopId, this.latitude, this.longitude);
        // this.shopDetailData = await shopDetails(this.openId, this.latitude, this.longitude);
        //评论列表
        // this.ratingList = await getRatingList(this.shopId, this.ratingOffset);
        // this.ratingList = await getRatingList(this.openId, this.ratingOffset);
        //商铺评论详情
        // this.ratingScoresData = await ratingScores(this.shopId);
        // this.ratingScoresData = await ratingScores(this.openId);
        //评论Tag列表
        // this.ratingTagsList = await ratingTags(this.shopId);
        // this.ratingTagsList = await ratingTags(this.openId);
        // this.RECORD_SHOPDETAIL(this.shopDetailData)
        //隐藏加载动画
        this.hideLoading();
      },
      //获取食品列表的高度，存入shopListTop
      // getFoodListHeight(){
      //   const listContainer = this.$refs.menuFoodList;
      //   if (listContainer) {
      //     const listArr = Array.from(listContainer.children[0].children);
      //     listArr.forEach((item, index) => {
      //       this.shopListTop[index] = item.offsetTop;
      //     });
      //     this.listenScroll(listContainer)
      //   }
      // },
      //当滑动食品列表时，监听其scrollTop值来设置对应的食品列表标题的样式
      // listenScroll(element){
      //   this.foodScroll = new BScroll(element, {
      //     probeType: 3,
      //     deceleration: 0.001,
      //     bounce: false,
      //     swipeTime: 2000,
      //     click: true,
      //   });
      //
      //   const wrapperMenu = new BScroll('#wrapper_menu', {
      //     click: true,
      //   });
      //
      //   const wrapMenuHeight = this.$refs.wrapperMenu.clientHeight;
      //   this.foodScroll.on('scroll', (pos) => {
      //     if (!this.$refs.wrapperMenu) {
      //       return
      //     }
      //     this.shopListTop.forEach((item, index) => {
      //       if (this.menuIndexChange && Math.abs(Math.round(pos.y)) >= item) {
      //         this.menuIndex = index;
      //         const menuList=this.$refs.wrapperMenu.querySelectorAll('.activity_menu');
      //         const el = menuList[0];
      //         wrapperMenu.scrollToElement(el, 800, 0, -(wrapMenuHeight/2 - 50));
      //       }
      //     })
      //   })
      // },
      //控制活动详情页的显示隐藏
      // showActivitiesFun(){
      //   this.showActivities = !this.showActivities;
      // },
      //点击左侧食品列表标题，相应列表移动到最顶层
      // chooseMenu(index){
      //   this.menuIndex = index;
      //   //menuIndexChange解决运动时listenScroll依然监听的bug
      //   this.menuIndexChange = false;
      //   this.foodScroll.scrollTo(0, -this.shopListTop[index], 400);
      //   this.foodScroll.on('scrollEnd', () => {
      //     this.menuIndexChange = true;
      //   })
      // },
      // showTitleDetail(index){
      //   if (this.TitleDetailIndex == index) {
      //     this.TitleDetailIndex = null;
      //   }else{
      //     this.TitleDetailIndex = index;
      //   }
      // },
      //加入购物车，所需7个参数，商铺id，食品分类id，食品id，食品规格id，食品名字，食品价格，食品规格
      addToCart(openId,vdCode, goodsId, goodsQuantity){
        this.ADD_CART({shopid:openId,vdCode, goodsId, goodsQuantity});
      },
      // addToCart(category_id, item_id, food_id, name, price, specs){
      //   this.ADD_CART({shopid: this.shopId, category_id, item_id, food_id, name, price, specs});
      // },
      //移出购物车，所需7个参数，商铺id，食品分类id，食品id，食品规格id，食品名字，食品价格，食品规格
      removeOutCart(openId,vdCode, goodsId, goodsQuantity){
        this.REDUCE_CART({openId,vdCode, goodsId, goodsQuantity});
      },
      /**
       * 初始化和shopCart变化时，重新获取购物车改变过的数据，赋值 categoryNum，totalPrice，cartFoodList，整个数据流是自上而下的形式，所有的购物车数据都交给vuex统一管理，包括购物车组件中自身的商品数量，使整个数据流更加清晰
       */

      //控制购物列表是否显示
      toggleCartList(){
        this.cartFoodList.length ? this.showCartList = !this.showCartList : true;
      },
      //清除购物车
      clearCart(){
        this.toggleCartList();
        // this.CLEAR_CART(this.shopId);
        this.CLEAR_CART(this.openId);
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

      //记录当前所选规格的索引值
      chooseSpecs(index){
        this.specsIndex = index;
      },
      //显示下落圆球
      showMoveDotFun(showMoveDot, elLeft, elBottom){
        this.showMoveDot = [...this.showMoveDot, ...showMoveDot];
        this.elLeft = elLeft;
        this.elBottom = elBottom;
      },
      beforeEnter(el){
        el.style.transform = `translate3d(0,${37 + this.elBottom - this.windowHeight}px,0)`;
        el.children[0].style.transform = `translate3d(${this.elLeft - 30}px,0,0)`;
        el.children[0].style.opacity = 0;
      },
      afterEnter(el){
        el.style.transform = `translate3d(0,0,0)`;
        el.children[0].style.transform = `translate3d(0,0,0)`;
        el.style.transition = 'transform .55s cubic-bezier(0.3, -0.15, 0.7, -0.15)';
        el.children[0].style.transition = 'transform .55s linear';
        this.showMoveDot = this.showMoveDot.map(item => false);
        el.children[0].style.opacity = 1;
        el.children[0].addEventListener('transitionend', () => {
          this.listenInCart();
        })
        el.children[0].addEventListener('webkitAnimationEnd', () => {
          this.listenInCart();
        })
      },
      goback(){
        this.$router.go(-1);
      }
    },
    watch: {
      //showLoading变化时说明组件已经获取初始化数据，在下一帧nextTick进行后续操作
      showLoading: function (value){
        if (!value) {
          this.$nextTick(() => {
            this.getFoodListHeight();
            this.initCategoryNum();
          })
        }
      },
      shopCart: function (value){
        this.initCategoryNum();
      },
      //购物车列表发生变化，没有商铺时，隐藏
      cartFoodList: function (value){
        if(!value.length){
          this.showCartList = false;
        }
      },
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "../../style/mixin";
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
    img{
      width: 100%;
      height: 100%;
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
  .shop_detail_header{
    overflow: hidden;
    position: relative;
    .header_cover_img{
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 9;
      filter: blur(10px);
    }
    .description_header{
      position: relative;
      z-index: 10;
      background-color: rgba(119,103,137,.43);
      padding: 0.4rem 0 0.4rem 0.4rem;
      width: 100%;
      overflow: hidden;
      .description_top{
        display: flex;
        .description_left{
          margin-right: 0.3rem;
          img{
            @include wh(2.9rem, 2.9rem);
            display: block;
            border-radius: 0.15rem;
          }
        }
        .description_right{
          flex: 1;
          .description_title{
            @include sc(.8rem, #fff);
            font-weight: bold;
            width: 100%;
            margin-bottom: 0.3rem;
          }
          .description_text{
            @include sc(.5rem, #fff);
            margin-bottom: 0.3rem;
          }
          .description_promotion{
            @include sc(.5rem, #fff);
            width: 11.5rem;
          }
        }
        .description_arrow{
          @include ct;
          right: 0.3rem;
          z-index: 11;
        }
      }
      .description_footer{
        @include fj;
        margin-top: 0.5rem;
        padding-right: 1rem;
        p{
          @include sc(.5rem, #fff);
          span{
            color: #fff;
          }
          .tip_icon{
            padding: 0 .04rem;
            border: 0.025rem solid #fff;
            border-radius: 0.1rem;
            font-size: .4rem;
            display: inline-block;
          }
        }
        .ellipsis{
          width: 84%;
        }
        .footer_arrow{
          @include wh(.45rem, .45rem);
          position: absolute;
          right: .3rem;
        }
      }
    }
  }
  .activities_details{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #262626;
    z-index: 200;
    padding: 1.25rem;
    .activities_shoptitle{
      text-align: center;
      @include sc(.8rem, #fff);
    }
    .activities_ratingstar{
      display: flex;
      justify-content: center;
      transform: scale(2.2);
      margin-top: .7rem;
    }
    .activities_list{
      margin-top: 1.5rem;
      margin-bottom: 1rem;
      @include sc(.5rem, #fff);
      li{
        margin-bottom: .2rem;
        .activities_icon{
          padding: 0 .02rem;
          display: inline-block;
          border: 0.025rem solid #fff;
          border-radius: 0.1rem;
        }
        span{
          color: #fff;
          line-height: .6rem;
        }
      }
    }
    .activities_shopinfo{
      p{
        line-height: .7rem;
        @include sc(.5rem, #fff);
      }
    }
    .activities_title_style{
      text-align: center;
      margin-bottom: 1rem;
      span{
        @include sc(.5rem, #fff);
        border: 0.025rem solid #555;
        padding: .2rem .4rem;
        border-radius: 0.5rem;
      }

    }
    .close_activities{
      position: absolute;
      bottom: 1rem;
      @include cl;
    }
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
    .gotopay_acitvity{
      background-color: #4cd964;
    }
  }
  .cart_food_list{
    position: fixed;
    width: 100%;
    padding-bottom: 2rem;
    z-index: 12;
    bottom: 0;
    left: 0;
    background-color: #fff;
    header{
      @include fj;
      align-items: center;
      padding: .3rem .6rem;
      background-color: #eceff1;
      svg{
        @include wh(.6rem,.6rem);
        vertical-align: middle;
      }
      h4{
        @include sc(.7rem, #666);
      }
      .clear_cart{
        @include sc(.6rem, #666);
      }
    }
    .cart_food_details{
      background-color: #fff;
      max-height: 20rem;
      overflow-y: auto;
      .cart_food_li{
        @include fj;
        padding: .6rem .5rem;
        .cart_list_num{
          width: 55%;
          p:nth-of-type(1){
            @include sc(.7rem, #666);
            font-weight: bold;
          }
          p:nth-of-type(2){
            @include sc(.4rem, #666);
          }
        }
        .cart_list_price{
          font-size: 0;
          span:nth-of-type(1){
            @include sc(.6rem, #f60);
            font-family: Helvetica Neue,Tahoma;

          }
          span:nth-of-type(2){
            @include sc(.7rem, #f60);
            font-family: Helvetica Neue,Tahoma;
            font-weight: bold;
          }
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
      }
    }
  }
  .screen_cover{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0,0,0,.3);
    z-index: 11;
  }
  .change_show_type{
    display: flex;
    background-color: #fff;
    padding: .3rem 0 .6rem;
    border-bottom: 1px solid #ebebeb;
    div{
      flex: 1;
      text-align: center;
      span{
        @include sc(.65rem, #666);
        padding: .2rem .1rem;
        border-bottom: 0.12rem solid #fff;
      }
      .activity_show{
        color: $mtOrange;
        border-color: $mtOrange;
      }
    }
  }
  .rating_container{
    flex: 1;
    overflow-y: hidden;
    flex-direction: column;
    p, span, li, time{
      font-family: Helvetica Neue,Tahoma,Arial;
    }
    .rating_header{
      display: flex;
      background-color: #fff;
      padding: .8rem .5rem;
      margin-bottom: 0.5rem;
      .rating_header_left{
        flex: 3;
        text-align: center;
        p:nth-of-type(1){
          @include sc(1.2rem, #f60);
        }
        p:nth-of-type(2){
          @include sc(.65rem, #666);
          margin-bottom: .1rem;
        }
        p:nth-of-type(3){
          @include sc(.4rem, #999);
        }
      }
      .rating_header_right{
        flex: 4;
        p{
          font-size: .65rem;
          line-height: 1rem;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          span:nth-of-type(1){
            color: #666;
            margin-right: .5rem;
          }
          .rating_num{
            width: 3rem;
            @include sc(.55rem, #f60);
          }
          .delivery_time{
            @include sc(.4rem, #999);
          }
        }
      }
    }
    .tag_list_ul{
      display: flex;
      flex-wrap: wrap;
      background-color: #fff;
      padding: .5rem;
      li{
        @include sc(.6rem, #6d7885);
        padding: .3rem .3rem;
        background-color: #ebf5ff;
        border-radius: 0.2rem;
        border: 1px;
        margin: 0 .4rem .2rem 0;
      }
      .unsatisfied{
        background-color: #f5f5f5;
        color: #aaa;
      }
      .tagActivity{
        background-color: $mtOrange;
        color: #fff;
      }
    }
    .rating_list_ul{
      background-color: #fff;
      padding: 0 .5rem;
      .rating_list_li{
        border-top: 1px solid #f1f1f1;
        display: flex;
        padding: .6rem 0;
        .user_avatar{
          @include wh(1.5rem, 1.5rem);
          border: 0.025rem;
          border-radius: 50%;
          margin-right: .8rem;
        }
        .rating_list_details{
          flex: 1;
          header{
            display: flex;
            flex: 1;
            justify-content: space-between;
            margin-bottom: .3rem;
            .username_star{
              @include sc(.55rem, #666);
              .username{
                color: #666;
                margin-bottom: .2rem;
              }
              .star_desc{
                display: flex;
                align-items: center;
                .time_spent_desc{
                  @include sc(.55rem, #666)
                  margin-left: .15rem;
                }
              }
            }
            .rated_at{
              @include sc(.4rem, #999);
            }
          }
          .food_img_ul{
            display: flex;
            flex-wrap: wrap;
            margin-bottom: .4rem;
            li{
              img{
                @include wh(3rem, 3rem);
                margin-right: .4rem;
                display: block;
              }
            }
          }
          .food_name_ul{
            display: flex;
            flex-wrap: wrap;
            li{
              @include sc(.55rem, #999);
              width: 2.2rem;
              padding: .2rem;
              border: 0.025rem solid #ebebeb;
              border-radius: 0.15rem;
              margin-right: .3rem;
              margin-bottom: 4px;
            }
          }
        }
      }
    }
  }
  .specs_cover{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,.4);
    z-index: 17;
  }
  .specs_list{
    position: fixed;
    top: 35%;
    left: 15%;
    width: 70%;
    background-color: #fff;
    z-index: 18;
    border: 1px;
    border-radius: 0.2rem;
    .specs_list_header{
      h4{
        @include sc(.7rem, #222);
        font-weight: normal;
        text-align: center;
        padding: .5rem;
      }
      .specs_cancel{
        position: absolute;
        right: .5rem;
        top: .5rem;
      }
    }
    .specs_details{
      padding: .5rem;
      .specs_details_title{
        @include sc(.6rem, #666);
      }
      ul{
        display: flex;
        flex-wrap: wrap;
        padding: .4rem 0;
        li{
          font-size: .6rem;
          padding: .3rem .5rem;
          border: 0.025rem solid #ddd;
          border-radius: .2rem;
          margin-right: .5rem;
          margin-bottom: .2rem;
        }
        .specs_activity{
          border-color: $mtOrange;
          color: $mtOrange;
        }
      }
    }
    .specs_footer{
      @include fj;
      align-items: center;
      background-color: #f9f9f9;
      padding: 0.5rem;
      border: 1px;
      border-bottom-left-radius: .2rem;
      border-bottom-right-radius: .2rem;
      .specs_price{
        span{
          color: #ff6000;
        }
        span:nth-of-type(1){
          font-size: .5rem;
        }
        span:nth-of-type(2){
          font-size: .8rem;
          font-weight: bold;
          font-family: Helvetica Neue,Tahoma;
        }
      }
      .specs_addto_cart{
        @include wh(4rem, 1.3rem);
        background-color: $mtOrange;
        border: 1px;
        border-radius: 0.15rem;
        @include sc(.6rem, #fff);
        text-align: center;
        line-height: 1.3rem;
      }
    }
  }
  .show_delete_tip{
    position: fixed;
    top: 50%;
    left: 15%;
    width: 70%;
    transform: translateY(-50%);
    background-color: rgba(0,0,0,.8);
    z-index: 18;
    @include sc(.65rem, #fff);
    text-align: center;
    padding: .5rem 0;
    border: 1px;
    border-radius: 0.25rem;
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
