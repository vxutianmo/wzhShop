<template>
  <section id='foot_guide'>

    <section @click = "gotoAddress('/classify')" class="guide_item">
      <div class="icon_style">
        <i class="icon-w icon-wclassify" :class="{on:'classify'===active}"></i>
      </div>
      <span>分类</span>
    </section>
    <div class="red_circle" v-if="totalNum">{{totalNum}}</div>
    <section @click = "gotoAddress('/cart')" class="guide_item">
      <div class="icon_style">
        <i class="icon-w icon-wCart1" v-if="active ==='cart'"></i>
        <i class="icon-w icon-wCart"></i>
      </div>
      <span>购物车</span>
    </section>
    <section @click = "gotoAddress('/order')" class="guide_item">
      <div class="icon_style">
        <i class="icon-w icon-wweibiaoti1" :class="{on:'order'===active}"></i>
      </div>
      <span>订单</span>
    </section>
  </section>
</template>
<script>
  import {mapState, mapMutations,mapActions} from 'vuex'
  import {getStore, setStore, removeStore} from 'src/config/mUtils'
  import {getCartInfo} from 'src/service/getData'
  export default {
    data(){
      return{
        active: 'cart',
      }
    },
    created(){

    },
    mounted(){
      this.active = this.$route.path.slice(1);
    },
    computed: {
      ...mapState([
        'geohash','cartList','openId',
      ]),
      totalNum: function (){
        let num = 0;
        // console.log(this.cartList)
        this.cartList.forEach((item) => {
          if(item.checked&&item.goodsQuantity){
            num+=parseInt(item.goodsQuantity);
          }

        })
        return num
      },
    },
    methods: {
      ...mapMutations([
        'RECORD_CART'
      ]),
      ...mapActions([
      ]),
      gotoAddress(path){
        this.$router.push(path+'?dataTime='+new Date().getTime())
      },
      // gotoAddressCart(){
      //   this.$router.push({
      //     path:'/cart'
      //   })
      //   getCartInfo(this.openId).then((res)=>{
      //     this.RECORD_CART(res.response);
      //     // console.log(this.cartList);
      //   })
      // },
    },

  }

</script>
<style lang="scss" scoped>
  @import '../../style/mixin';
  @import '../../style/icons/iconfont.css';
  .on{
    color: #95C61C;
  }
  .red_circle{
    width: 1rem;
    height: 1rem;
    background-color: red;
    border-radius: 50%;
    position: absolute;
    /*top:.3rem;*/
    left: 8.6rem;
    color: #fff;
    text-align: center;
    vertical-align: center;
    font-size: 16px;
    font-weight: bolder;
  }
  .cart{
    @include wh(.8rem, .8rem);
    background: url('../../images/Cart_n.svg') repeat;
    background-size: .8rem .8rem;
    margin-top: .3rem;
  }
  #foot_guide{
    background-color: #fff;
    position: fixed;
    z-index: 100;
    left: 0;
    right: 0;
    bottom: 0;
    @include wh(100%, 1.95rem);
    display: flex;
    box-shadow: 0 -0.026667rem 0.053333rem rgba(0,0,0,.1);
  }
  .guide_item{
    flex: 1;
    display: flex;
    text-align: center;
    flex-direction: column;
    align-items: center;
    .icon_style{
      @include wh(1rem, 1rem);
      margin-bottom: .2rem;
      margin-right: .1rem;
      img{
        width: 1rem;
        height: 1rem;
      }
    }
    span{
      @include sc(.45rem, #666);
    }
  }

</style>
