<template>
  <div class="pic-view">
    <a href="javascript:void(0);" v-on:click="previous"><img class="left-half" :src="currentPic"></a>
    <a href="javascript:void(0);" v-on:click="next"><img class="right-half" :src="currentPic"></a>
  </div>
  <button v-on:click="btnBack"></button>
</template>

<script>

  import wilddog from 'wilddog'

  export default {
    data()
    {
      return {
        // note: changing this line won't causes changes
        // with hot-reload because the reloaded component
        // preserves its current state and we are modifying
        // its initial state.
        currentPic: null
      }
    },
    compiled: function ()
    {
      //this.currentPic=this.$parent.imgData.items[this.$parent.clickPicIndex].pic_url;
      this.currentPic = this.$parent.imgs[this.$parent.clickPicIndex].path;

    },
    ready: function ()
    {

      var config = {
        //填写合适的 wilddog URL 如：https://xxxxxxxxxx.wilddogio.com
        syncURL: "XXX"
      };
      var wilddogApp = wilddog.initializeApp(config)
      var sync = wilddogApp.sync()

      var ref = wilddog.sync().ref("/");

      ref.child("App").set({
        "currentView": "ShowPic",
      });
      // child() 用来定位到某个节点。
      ref.child("events").set({
        "previous": 0,
        "next": 0,
        "back": 0
      });

      var _next = this.next;
      var refNext = wilddog.sync().ref("/events/next");
      refNext.on('value', function (snapshot, error)
      {
        if (error == null)
        {
          //
          _next();
        } else
        {
          console.log(error);
        }
      });

      var refPre = wilddog.sync().ref("/events/previous");
      var _previous = this.previous;
      refPre.on('value', function (snapshot, error)
      {
        if (error == null)
        {
          //
          console.log(snapshot.val())
          _previous();
        } else
        {
          console.log(error);
        }
      });

      var _btnBack = this.btnBack;
      var refBack = wilddog.sync().ref("/events/back");
      refBack.on('value', function (snapshot, error)
      {
        if ((error == null) && (snapshot.val() != 0))
        {
          //
          _btnBack();
        } else
        {
          //console.log(error);
        }
      });

      var _pageScroll = this.pageScroll;
      var pagePreRef = wilddog.sync().ref("/ShowPic/down");
      pagePreRef.on('value', function (snapshot, error)
      {
        if (error == null)
        {
          //
          console.log("pagePre:" + snapshot.val());
          _pageScroll(1000);

        } else
        {
          console.log(error);
        }
      });

      var pagePreRef = wilddog.sync().ref("/ShowPic/top");
      pagePreRef.on('value', function (snapshot, error)
      {
        if (error == null)
        {
          //
          console.log("pagePre:" + snapshot.val());
          _pageScroll(0);

        } else
        {
          console.log(error);
        }
      });
      //在chrome开发调试时，应注销这段代码，开始
      //全屏切换
      // 1在htc e9+（android 5.0）有效，但在sony z5 premium（android 6）中无效
      //1
      try
      {
        screen.orientation.lock("landscape-secondary");
        screen.lockOrientation('landscape');
      }
      catch (e)
      {
        console.log("screen Orientation api err!")
      }

      //保持屏幕常亮
      window.plugins.insomnia.keepAwake();
      // Hide system UI until user interacts 
      AndroidFullScreen.immersiveMode(function () { console.info("It worked!"); }, function (error) { console.error(error); });
      //
      StatusBar.hide();
      //在chrome开发调试时，应注销这段代码，结束


      //使可视部分在页面最前
      window.scrollTo(0, 0);
    },
    events: {
      reveiveAndshow: function ()
      {

        console.log("子组件响应：")


      }
    },
    methods: {
      previous: function ()
      {
        console.log("previous")
        var thisIndex = this.$parent.clickPicIndex - 1;
        if (thisIndex >= 0)
        {
          //this.currentPic=this.$parent.imgData.items[--this.$parent.clickPicIndex].pic_url;
          this.currentPic = this.$parent.imgs[--this.$parent.clickPicIndex].path;

        }
        else
        {
          console.log("No Pic")
        }

        //使可视部分在页面最前
        window.scrollTo(0, 0);
      },
      next: function ()
      {
        console.log("next")
        //console.log(this.$parent.imgData.items.length)
        var thisIndex = this.$parent.clickPicIndex + 1;
        if (thisIndex < this.$parent.imgs.length)
        {
          //this.currentPic=this.$parent.imgData.items[++this.$parent.clickPicIndex].pic_url;
          this.currentPic = this.$parent.imgs[++this.$parent.clickPicIndex].path;

        }
        else
        {
          console.log("No Pic")
        }
        //使可视部分在页面最前
        window.scrollTo(0, 0);
      },
      btnBack: function ()
      {
        this.$dispatch('backHome');
      },
      pageScroll: function (px)
      {
        window.scrollTo(0, px);
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pic-view{
    display: flex;
    align-items: center;
    min-height: 100vh;
    background-color: black;
}
  button {
    position: fixed;
    display: block;
    height: 82px;
    width: 100%;
    margin: 0;
    z-index: 20;
    overflow: hidden;
    top: 0;
    left: 0;
    background: transparent;
    border: 0;
  }
  
  button:active {
    background: red;
    border: 0;
    opacity: 0.2;
  }
  
  .left-half {
    display: block;
    /* position: absolute; */
    left: 0px;
    width: 100%;
  }
  
  .right-half {
    display: block;
    /* position: absolute; */
    right: 0px;
    width: 100%;
    /* min-height: 500px; */
  }
</style>