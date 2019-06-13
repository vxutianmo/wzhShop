<template>
	<div>
		<transition name="router-fade" mode="out-in">
			<keep-alive>
			    <router-view v-if="$route.meta.keepAlive"></router-view>
			</keep-alive>
    	</transition>
    	<transition name="router-fade" mode="out-in">
			<router-view v-if="!$route.meta.keepAlive"></router-view>
		</transition>
		<svg-icon></svg-icon>
    </div>
</template>

<script>
	import svgIcon from './components/common/svg';
  	export default {
      provide () {
        return {
          reload: this.reload
        }
      },
      data () {
        return {
          isRouterAlive: true
        }
      },
    	components:{
            svgIcon
      },
      methods: {
        reload () {
          this.isRouterAlive = false
          this.$nextTick(function () {
            this.isRouterAlive = true
          })
        }
      }

  	}

</script>

<style lang="scss">
  	@import './style/common';
	.router-fade-enter-active, .router-fade-leave-active {
	  	transition: opacity .3s;
	}
	.router-fade-enter, .router-fade-leave-active {
	  	opacity: 0;
	}
</style>
