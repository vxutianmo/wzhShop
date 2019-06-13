 <template>
    <section class="cart_module">
        <section class="cart_button">
            <transition name="showReduce">
                <!--<span @click="removeOutCart(foods.category_id, foods.item_id, foods.specfoods[0].food_id, foods.specfoods[0].name, foods.specfoods[0].price, '', foods.specfoods[0].packing_fee, foods.specfoods[0].sku_id, foods.specfoods[0].stock)" v-if="foodNum">-->
                <!--<span @click="removeOutCart(item.vdCode, item.goodsId,item.goodsQuantity)" v-if="foodNum">-->
                <span @click="removeOutCart(item.vdCode, item.goodsId,item.goodsQuantity)">
                    <svg>
                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-minus"></use>
                    </svg>
                </span>
            </transition>
            <transition name="fade">
                <span class="cart_num" v-if="foodNum">{{foodNum}}</span>
            </transition>
            <!--<svg class="add_icon" @click="addToCart(foods.category_id, foods.item_id, foods.specfoods[0].food_id, foods.specfoods[0].name, foods.specfoods[0].price, '', foods.specfoods[0].packing_fee, foods.specfoods[0].sku_id, foods.specfoods[0].stock, $event)">-->
            <svg class="add_icon" @click="addToCart(item.vdCode, item.goodsId,item.goodsQuantity)">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-add"></use>
            </svg>
        </section>
        <!--<section v-else class="choose_specification">-->
            <!--<section class="choose_icon_container">-->
                <!--<transition name="showReduce">-->
                    <!--<svg class="specs_reduce_icon" v-if="foodNum" @click="showReduceTip">-->
                        <!--<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-minus"></use>-->
                    <!--</svg>-->
                <!--</transition>-->
                <!--<transition name="fade">-->
                    <!--<span class="cart_num" v-if="foodNum">{{foodNum}}</span>-->
                <!--</transition>-->
                <!--<span class="show_chooselist" @click="showChooseList(foods)">选规格</span>-->
            <!--</section>-->
        <!--</section>-->
    </section>
</template>

<script>
    import {mapState, mapMutations} from 'vuex'
    export default {
    	data(){
            return{
               showMoveDot: [], //控制下落的小圆点显示隐藏
            }
        },
        mounted(){

        },
        computed: {
            ...mapState([
                'cartList'
            ]),
            /**
             * 监听cartList变化，更新当前商铺的购物车信息shopCart，同时返回一个新的对象
             */
            shopCart: function (){
                return Object.assign({},this.cartList[this.shopId]);
            },
            //shopCart变化的时候重新计算当前商品的数量
            // foodNum: function (){
            //     let category_id = this.item.category_id;
            //     let item_id = this.foods.item_id;
            //     if (this.shopCart&&this.shopCart[category_id]&&this.shopCart[category_id][item_id]) {
            //         let num = 0;
            //         Object.values(this.shopCart[category_id][item_id]).forEach((item,index) => {
            //             num += item.num;
            //         })
            //         return num;
            //     }else {
            //         return 0;
            //     }
            // },
            foodNum: function (){
                return 1;
            },
        },
        props:['item', 'openId'],
        methods: {
            ...mapMutations([
                'ADD_CART','REDUCE_CART',
            ]),
            //移出购物车
            // removeOutCart(category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock){
            //     if (this.foodNum > 0) {
            //         this.REDUCE_CART({shopid: this.shopId, category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock});
            //     }
            // },
           //移出购物车
            removeOutCart(vdCode, goodsId, goodsQuantity){
                if (this.foodNum > 0) {
                    this.REDUCE_CART({ openId:this.openId,vdCode, goodsId, goodsQuantity});
                }
            },
            //加入购物车，计算按钮位置。
            // addToCart(category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock, event){
            //     this.ADD_CART({shopid: this.shopId, category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock});
            //     let elLeft = event.target.getBoundingClientRect().left;
            //     let elBottom = event.target.getBoundingClientRect().bottom;
            //     this.showMoveDot.push(true);
            //     this.$emit('showMoveDot', this.showMoveDot, elLeft, elBottom);
            //
            // },
           addToCart(vdCode, goodsId, goodsQuantity, event){
                this.ADD_CART({openId:this.openId,vdCode, goodsId, goodsQuantity});
                let elLeft = event.target.getBoundingClientRect().left;
                let elBottom = event.target.getBoundingClientRect().bottom;
                this.showMoveDot.push(true);
                this.$emit('showMoveDot', this.showMoveDot, elLeft, elBottom);

            },

        },
    }
</script>

<style lang="scss" scoped>
    @import '../../style/mixin';
	.cart_module{
        .add_icon{
            position: relative;
            z-index: 999;
        }
        .cart_button{
            display: flex;
            align-items: center;
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
        .choose_specification{
            .choose_icon_container{
                display: flex;
                align-items: center;
                .show_chooselist{
                    display: block;
                    @include sc(.55rem, #fff);
                    padding: .1rem .2rem;
                    background-color: $mtOrange;
                    border-radius: 0.2rem;
                    border: 1px solid $mtOrange;
                }
            }
        }
    }
    .showReduce-enter-active, .showReduce-leave-active {
        transition: all .3s ease-out;
    }
    .showReduce-enter, .showReduce-leave-active {
        opacity: 0;
        transform: translateX(1rem);
    }
    .fade-enter-active, .fade-leave-active {
        transition: all .3s;
    }
    .fade-enter, .fade-leave-active {
        opacity: 0;
    }
    .fadeBounce-enter-active, .fadeBounce-leave-active {
        transition: all .3s;
    }
    .fadeBounce-enter, .fadeBounce-leave-active {
        opacity: 0;
        transform: scale(.7);
    }

</style>

