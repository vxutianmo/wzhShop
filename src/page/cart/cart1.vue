<template>
  <div class="cart_page">
    <head-top head-title="购物车" go-back='true'>
      <span slot="edit-cart" class="edit" @click="editStatus = true;" v-if="!editStatus">编辑</span>
      <span slot="cancel-edit-cart" class="edit" @click="editStatus = false;" v-else>取消</span>
    </head-top>

    <div class="empty-cart" v-if="emptyCart">
      <div class="info-container">
        <img src="../../images/nothing.png">
        <span class="text">购物车空空如也，快去逛逛吧</span>
        <router-link class="redirect-classify" to="/classify"><span>去逛逛</span></router-link>
      </div>
    </div>

    <section class="menu_right" ref="menuFoodList">
      <ul>
        <!--<li v-for="(item,index) in menuList" :key="index">-->
        <li>

          <!--<section v-for="(foods,foodindex) in item.foods" :key="foodindex" class="menu_detail_list">-->
          <section  class="menu_detail_list">
            <!--<router-link  :to="{path: 'shop/foodDetail', query:{image_path:foods.image_path, description: foods.description, month_sales: foods.month_sales, name: foods.name, rating: foods.rating, rating_count: foods.rating_count, satisfy_rate: foods.satisfy_rate, foods, shopId}}" tag="div" class="menu_detail_link">-->
            <div  class="menu_detail_link">
              <section class="menu_food_img">
                <!--<img :src="imgBaseUrl + foods.image_path">-->
                <img src="../../images/activity.png">
              </section>
              <section class="menu_food_description">
                <h3 class="food_description_head">
                  <!--<strong class="description_foodname">{{foods.name}}</strong>-->
                  <strong class="description_foodname">ggggggggggg水水水水水水水水水水</strong>
                  <!--<ul v-if="foods.attributes.length" class="attributes_ul">-->
                  <ul  class="attributes_ul">
                    <!--<li v-if="attribute" v-for="(attribute, foodindex) in foods.attributes" :key="foodindex" :style="{color: '#' + attribute.icon_color,borderColor:'#' + attribute.icon_color}" :class="{attribute_new: attribute.icon_name == '新'}">-->
                    <!--<li>-->
                      <!--<p :style="{color: attribute.icon_name == '新'? '#fff' : '#' + attribute.icon_color}">{{attribute.icon_name == '新'? '新品':attribute.icon_name}}</p>-->
                      <!--<p >ddddd水水水水水水水水水水水水</p>-->
                    <!--</li>-->
                  </ul>

                </h3>
                <!--<p class="food_description_content">{{foods.description}}</p>-->
                <p class="food_description_content">aaaaaaaaa</p>
                <!--<p class="food_description_sale_rating">-->
                  <!--<span>月售{{foods.month_sales}}份</span>-->
                  <!--<span>月售fggggg份</span>-->
                  <!--<span>好评率{{foods.satisfy_rate}}%</span>-->
                  <!--<span>好评率ggggf%</span>-->
                <!--</p>-->
                <!--<p v-if="foods.activity" class="food_activity">-->
                <p class="food_activity">
                  <!--<span :style="{color: '#' + foods.activity.image_text_color,borderColor:'#' +foods.activity.icon_color}">{{foods.activity.image_text}}</span>-->
                  <span>ddddddddddddddddddddd</span>
                </p>
              </section>
            </div>
            <footer class="menu_detail_footer">
              <section class="food_price">
                <span>¥</span>
                <!--<span>{{foods.specfoods[0].price}}</span>-->
                <span>赌东道赌东道的</span>
                <!--<span v-if="foods.specifications.length">起</span>-->
              </section>
              <!--<buy-cart :shopId='shopId' :foods='foods' @moveInCart="listenInCart" @showChooseList="showChooseList" @showReduceTip="showReduceTip" @showMoveDot="showMoveDotFun"></buy-cart>-->
              <buy-cart  :shopId='shopId' :foods='foods'  @moveInCart="listenInCart" @showChooseList="showChooseList" @showReduceTip="showReduceTip" @showMoveDot="showMoveDotFun"></buy-cart>
            </footer>
          </section>
        </li>
      </ul>
    </section>


    <foot-guide></foot-guide>
  </div>
</template>
<script>
  import headTop from 'src/components/header/head'
  import footGuide from 'src/components/footer/footGuide'
  import loading from 'src/components/common/loading'
  import {loadMore} from 'src/components/common/mixin'
  import {mapGetters} from 'vuex'
  import buyCart from 'src/components/common/buyCart'

  export default {
    computed: {
      ...mapGetters(['cartList'])
    },
    data(){
      return{
        showActivities: false, //是否显示活动详情
        shopDetailData: null, //商铺详情
        shopId: null, //商店id值

        showLoading: false, //显示加载动画
        totalPrice: 0,
        selectFood: {},   //选中列表
        deleteSelectFood: {},   //选中删除列表
        editStatus: false,      //编辑状态
        emptyCart: false          //购物车为空

      }
    },
    mixins: [loadMore],
    components:{
      headTop,
      footGuide,
      loading,
      buyCart,
    },
    methods: {
      cancelSelect(restaurant_id, foodKey) {    //取消选中商品
        this.selectFood[restaurant_id][foodKey] = false;    //该商品取消选中
        this.selectFood[restaurant_id]['allSelect'] = false;    //全选标志为false
        let cartFoodData = this.cartList[restaurant_id][foodKey];  //购物车中 该商品信息
        this.selectFood[restaurant_id]['totalPrice'] -= cartFoodData['num'] * cartFoodData['price'];  //修改价格
        this.selectFood = {...this.selectFood};   //拓展运算符使vue更新视图
      },
      cancelSelectDelete(restaurant_id, foodKey) {  //取消删除选中
        this.deleteSelectFood[restaurant_id][foodKey] = false;      //该商品删除选中为false
        this.deleteSelectFood[restaurant_id]['allSelect'] = false;    //全选标志为false
        this.deleteSelectFood = {...this.deleteSelectFood};   //拓展运算符使vue更新视图
      },
      select(restaurant_id, foodKey) {      //选中商品
        this.selectFood[restaurant_id][foodKey] = true;   //该商品选中置true
        let cartFoodData = this.cartList[restaurant_id][foodKey];  //购物车中 该商品信息
        this.selectFood[restaurant_id]['totalPrice'] += cartFoodData['num'] * cartFoodData['price'];  //修改价格

        //判读是否全选
        let newObj = {...this.selectFood[restaurant_id]};
        let allSelect = this.isAllSelect(newObj, restaurant_id);
        this.selectFood[restaurant_id]['allSelect'] = allSelect;
        this.selectFood = {...this.selectFood};   //拓展运算符使vue更新视图
      },
      selectDelete(restaurant_id, foodKey) {  //选中删除商品
        this.deleteSelectFood[restaurant_id][foodKey] = true; //该商品选中置为true
        //判读是否全选
        let newObj = {...this.deleteSelectFood[restaurant_id]};
        let allSelect = this.isAllSelect(newObj, restaurant_id);
        this.deleteSelectFood[restaurant_id]['allSelect'] = allSelect;
        this.deleteSelectFood = {...this.deleteSelectFood};   //拓展运算符使vue更新视图
      },
      isAllSelect(newObj, restaurant_id) {      //判断商品是否全选中了 如果全选中那么商家头像左边的按钮对应选中
        delete newObj.allSelect;
        let values = Object.values(newObj);
        let noAllSelect = values.some((el) => {
          if (el === false)
            return true;
        });
        return !noAllSelect;
      },
      allSelect(restaurant_id, boolean) {     //全选
        this.selectFood[restaurant_id]['allSelect'] = boolean;  //全选标志
        Object.keys(this.selectFood[restaurant_id]).forEach(el => { //每个商品都选中
          if (Number(el))
            this.selectFood[restaurant_id][el] = boolean;
        })

        if (boolean) {    //如果是选中 计算价格
          let restaurant = this.cartList[restaurant_id];
          Object.keys(restaurant).forEach(el => {
            if (Number(el)) {
              this.selectFood[restaurant_id]['totalPrice'] += restaurant[el]['num'] * restaurant[el]['price'];
            }
          });
        } else {    //取消全选
          this.selectFood[restaurant_id]['totalPrice'] = 0;
        }
        this.selectFood = {...this.selectFood};   //拓展运算符使vue更新视图
      },
      allSelectDelete(restaurant_id, boolean) {   //删除状态下的全选
        this.deleteSelectFood[restaurant_id]['allSelect'] = boolean;
        Object.keys(this.deleteSelectFood[restaurant_id]).forEach(el => {
          if (Number(el))
            this.deleteSelectFood[restaurant_id][el] = boolean;
        })
        this.deleteSelectFood = {...this.deleteSelectFood};   //拓展运算符使vue更新视图
      },
      submit(restaurant_id) { //提交订单
        if (!this.selectFood[restaurant_id].totalPrice)   //如果没有选中食物 不能提交订单
          return;
        let restaurant = this.selectFood[restaurant_id];    //选中食物的餐馆
        let foods = {
          totalPrice: 0,
          totalNum: 0
        };
        Object.keys(restaurant).forEach(el => {   //计算价格
          if (Number(el) && restaurant[el]) {
            let food = this.cartList[restaurant_id][el];
            foods[el] = food;
            foods['totalPrice'] += food.num * food.price;
            foods['totalNum'] += food.num;
          }
        })
        let data = {
          restaurant_id,
          foods
        };
        localStorage.setItem('confirmOrderData', JSON.stringify(data));
        this.$router.push({path: '/confirmOrder'});
      },
      deleteCart() {       //删除购物车
        Object.keys(this.deleteSelectFood).forEach((restaurant_id) => {
          let restaurant = this.deleteSelectFood[restaurant_id];  //商店
          Object.keys(restaurant).forEach(food_id => {    //要删除的商品
            if (Number(food_id) && restaurant[food_id]) {   //删除购物车数据
              this.$store.dispatch('deleteFood', {restaurant_id, food_id})
              delete this.selectFood[restaurant_id][food_id];
            }
            this.allSelect(restaurant_id, false);      //重置选中列表为false
            delete restaurant[food_id];
          })
        })
        this.editStatus = false;
        this.emptyCart = !Object.keys(this.cartList).length;
      },


      test(type, target, point, pixel, overlay){
        alert("11");
        console.log(type, target, point, pixel, overlay);
      },
      syncCenterAndZoom (e) {
        const {lng, lat} = e.target.getCenter()
        this.center.lng = lng
        this.center.lat = lat
        this.zoom = e.target.getZoom()
      },
      //清除购物车
      clearCart(){
        this.toggleCartList();
        this.CLEAR_CART(this.shopId);
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

      //显示规格列表
      showChooseList(foods){
        if (foods) {
          this.choosedFoods = foods;
        }
        this.showSpecs = !this.showSpecs;
        this.specsIndex = 0;
      },
      //记录当前所选规格的索引值
      chooseSpecs(index){
        this.specsIndex = index;
      },
      //多规格商品加入购物车
      addSpecs(category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock){
        this.ADD_CART({shopid: this.shopId, category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock});
        this.showChooseList();
      },
      //显示提示，无法减去商品
      showReduceTip(){
        this.showDeleteTip = true;
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          clearTimeout(this.timer);
          this.showDeleteTip = false;
        }, 3000);
      },
    },
    created() {
      this.emptyCart = !Object.keys(this.cartList).length
      Object.keys(this.cartList).forEach(restaurant_id => {  //初始化选中列表
        this.selectFood[restaurant_id] = {
          allSelect: true,
          totalPrice: 0
        };
        this.deleteSelectFood[restaurant_id] = {
          allSelect: false
        }
        let restaurant = this.cartList[restaurant_id];
        Object.keys(restaurant).forEach(data => {
          if (Number(data)) {
            this.deleteSelectFood[restaurant_id][data] = false;
            this.selectFood[restaurant_id][data] = true;
            this.selectFood[restaurant_id]['totalPrice'] += Number(restaurant[data]['price']) * Number(restaurant[data]['num']);
          }
        })
      });
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "../../style/mixin";
  .info-container {
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .cart_page .edit {
    position: absolute;
    right: 15px;
    top: 10px;
    font-size: 0.4rem;
    font-weight: 600;
    color: #fff;
  }

  .menu_right{
    margin-top: 50px;
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



  img {
    width: 3rem;
    height: 3rem;
  }
  .text {
    display: block;
    font-size: 0.35rem;
  }
  .map {
    width: 100%;
    height: 400px;
  }
  .m_lng{
    margin-top: 35px;
  }
  .m_lng input{
    width:70px;
  }
  .m_key{
    margin-top: 45px;
  }
  .m_key label input{
    width: 70px;
  }
  .btn-delete{
    margin-top: 200px;
  }



  .cart_icon_activity{
    background-color: #3190e8;
  }
</style>
