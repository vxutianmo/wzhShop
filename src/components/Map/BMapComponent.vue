<template>
  <!--<div id="allmap" style="width: 100%; height: {{mapHeight}}px"></div>-->
  <!--<div id="allmap":style="{width: '100%', height: mapHeight + 'px'}"></div>-->
  <div id="allmap" v-bind:style="mapStyle"></div>

</template>
<script>

  export default {
    name: "BMapComponent",
    data:function(){
      return{
        mapStyle:{
          width:'100%',
          height:this.mapHeight +'px'
        }
      }
    },
    props:{
      // 地图在该视图上的高度
      mapHeight:{
        type:Number,
        default:500
      },
      // 经度
      longitude:{
        type:Number,
        default:116.404
      }
      // ,
      // // 纬度
      // latitude:{
      //     type:Number,
      //     default:39.915
      // },
      // description:{
      //     type:String,
      //     default:'天安门'
      // }
    },

    ready:function(){
      var map =newBMap.Map("allmap");
      var point =newBMap.Point(this.longitude,this.latitude);
      var marker =newBMap.Marker(point);
      map.addOverlay(marker);
      map.centerAndZoom(point,15);
      // 信息窗的配置信息
      var opts ={
        width :250,
        height:75,
        title :"地址：",
      }
      var infoWindow =newBMap.InfoWindow(this.description, opts);// 创建信息窗口对象
      marker.addEventListener("click",function(){
        map.openInfoWindow(infoWindow,point);
      });
      map.enableScrollWheelZoom(true);
      map.openInfoWindow(infoWindow,point);//开启信息窗口
    },
    mounted(){
      var map = new BMap.Map("allmap");
      var geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition(function(r){
        var point = new BMap.Point(r.point.lng,r.point.lat);
        map.centerAndZoom(point,12);
        if(this.getStatus() == BMAP_STATUS_SUCCESS){
          var mk = new BMap.Marker(r.point);
          map.addOverlay(mk);
          map.panTo(r.point);

          function myFun(result){
            var cityName = result.name;
            map.setCenter(cityName);
            alert("当前定位城市:"+cityName);
          }
        }

        else {
          alert('failed'+this.getStatus());
        }
      });
    }

  }
</script>

<style scoped>

</style>
