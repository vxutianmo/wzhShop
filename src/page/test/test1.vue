<template>
  <div class="order_page">
    <head-top head-title="测试" go-back='true'></head-top>

    <!--<template>-->
      <!--<baidu-map class="map" :center="{lng: 116.404, lat: 39.915}" :zoom="15" @click="test">-->
        <!--<bm-marker :position="{lng: 116.404, lat: 39.915}" :dragging="true" animation="BMAP_ANIMATION_BOUNCE" >-->
          <!--&lt;!&ndash;<bm-label content="我爱北京天安门" :labelStyle="{color: 'red', fontSize : '24px'}" :offset="{width: -35, height: 30}" />&ndash;&gt;-->
        <!--</bm-marker>-->
      <!--</baidu-map>-->
    <!--</template>-->
    <!--<template>-->
      <!--<div>-->
        <!--<div class="m_lng">-->
          <!--<input v-model.number="center.lng">-->
          <!--<input v-model.number="center.lat">-->
          <!--<input v-model.number="zoom">-->
        <!--</div>-->
        <!--<baidu-map-->
          <!--class="map"-->
          <!--:scroll-wheel-zoom="true"-->
          <!--:center="center"-->
          <!--:zoom="zoom"-->
          <!--@moving="syncCenterAndZoom"-->
          <!--@moveend="syncCenterAndZoom"-->
          <!--@zoomend="syncCenterAndZoom">-->
        <!--</baidu-map>-->
       <!--</div>-->
    <!--</template>-->
    <template>
      <div class="m_key">
        <label>关键词：<input v-model="keyword"></label>
        <label>地区：<input v-model="location"></label>
      </div>

      <baidu-map>
        <bm-view class="map"></bm-view>
        <bm-local-search :keyword="keyword" :auto-viewport="true" :location="location"></bm-local-search>
      </baidu-map>
    </template>

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
  import headTop from 'src/components/header/head'
  import footGuide from 'src/components/footer/footGuide'
  import loading from 'src/components/common/loading'
  import {loadMore} from 'src/components/common/mixin'

  export default {
    data(){
      return{
        showLoading: false, //显示加载动画
        center: {
          lng: 116.404,
          lat: 39.915
        },
        zoom: 15,
        location: '山东',
        keyword: '山东大学'
      }
    },
    mixins: [loadMore],
    components:{
      headTop,
      footGuide,
      loading,
    },
    methods:{
      test(type, target, point, pixel, overlay){
        alert("11");
        console.log(type, target, point, pixel, overlay);
      },
      syncCenterAndZoom (e) {
        const {lng, lat} = e.target.getCenter()
        this.center.lng = lng
        this.center.lat = lat
        this.zoom = e.target.getZoom()
      }
    }
  }
</script>
<style>
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
</style>
