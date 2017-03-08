<template>
  <div class="explore">
    <div class="left-half">
      <ul class="back">
        <li>
          <a href="javascript:void(0);" v-on:click="btnBack">返回</a>
        </li>
      </ul>
      <ul class="dirs">
        <li v-for="dirItem in dirs" track-by="$index">
          <a href="javascript:void(0);" v-on:click="selectPath($index)">{{dirItem.path | unEncrypt}}</a>
        </li>
      </ul>
      <ul class="imgs">
        <li v-for="imgItem in imgs | limitBy 50" track-by="$index">
          <a href="javascript:void(0);" v-on:click="selectImg($index)"><img :src="imgItem.path"></a>
        </li>
      </ul>
    </div>

    <div class="right-half">
      <ul class="back">
        <li>
          <a href="javascript:void(0);" v-on:click="btnBack">返回</a>
        </li>
      </ul>
      <ul class="dirs">
        <li v-for="dirItem in dirs" track-by="$index">
          <!--<a href="javascript:void(0);" v-on:click="selectPath($index)">{{dirItem.path.split("/").reverse()[1]}}</a>          -->
          <a href="javascript:void(0);" v-on:click="selectPath($index)">{{dirItem.path | unEncrypt}}</a>
        </li>
      </ul>
      <ul class="imgs">
        <li v-for="imgItem in imgs | limitBy 50" track-by="$index">
          <a href="javascript:void(0);" v-on:click="selectImg($index)"><img :src="imgItem.path"></a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import wilddog from 'wilddog'

  var config = {
    //填写合适的 wilddog URL 如：https://xxxxxxxxxx.wilddogio.com
    syncURL: "XXX"
  };
  var wilddogApp = wilddog.initializeApp(config)
  var sync = wilddogApp.sync()

  var ref = wilddog.sync().ref("/");


  export default {
    data()
    {
      return {
        // note: changing this line won't causes changes
        // with hot-reload because the reloaded component
        // preserves its current state and we are modifying
        // its initial state.
        dirs: [],
        imgs: [],
        previousPath: null,
        page: -1,
        pageLength: null,
        winHeight: null,
        // historyPageNum: null,
      }
    },
    methods: {
      flashData: function ()
      {
        this.dirs = this.$parent.dirs;
        //显示全部图片
        this.imgs = this.$parent.imgs;
        // //显示全部图片会卡住，只显示一部分36个
        //let wantLength=this.$parent.imgs.length<36?this.$parent.imgs.length:36;
        //this.imgs=this.$parent.imgs.slice(0,wantLength);

        this.previousPath = this.$parent.previousPath;
      },
      selectPath: function (index)
      {
        console.log("this.dirs[index].path:" + this.dirs[index].path);
        //?       
        this.$parent.getData(this.dirs[index].path)

        this.flashData();
        //根据li数目确定页面数，并设置视图高度以使页面操作适应
        //等待li渲染完毕，才能正确获取li数目
        setTimeout(this.setView, 600);
      },
      selectImg: function (index)
      {

        this.$parent.clickPicIndex = index;

        this.$dispatch('showThisPic', 0);
      },
      btnBack: function ()
      {

        this.$parent.getData(this.$parent.previousPath);

        this.flashData();

        //根据li数目确定页面数，并设置视图高度以使页面操作适应
        //等待li渲染完毕，才能正确获取li数目
        setTimeout(this.setView, 600);
        

      },
      pageAdd: function ()
      {
        this.page = this.page + 1;
        if (this.page > this.pageLength)
        {
          this.page = this.page - 1;
        }
        console.log("this.page:" + this.page);
      },
      pageDec: function ()
      {
        this.page = this.page - 1;
        if (this.page < 0)
        {
          this.page = this.page + 1;
        }
        console.log("this.page:" + this.page);
      },
      pageAddOrDec: function (pageNum)
      {
        
        window.scrollTo(0, pageNum * document.documentElement.clientHeight);
        // console.log("document.documentElement.clientHeight:" + document.documentElement.clientHeight)
      },
      setView: function ()
      {
        //var liNum = Math.ceil(document.getElementsByTagName("li").length / 2);
        var liNum =this.dirs.length+this.imgs.length;
        console.log("liNum:" + liNum)
        this.pageLength = parseInt(liNum / 12);
        console.log("this.pageLength:" + this.pageLength)
        //只需设置一边的高度
        document.getElementsByClassName("left-half")[0].style.height = (this.pageLength + 1) * document.documentElement.clientHeight + 'px';
        //重置this.page
        this.page = -1;
        // //回复page
        // if (this.historyPageNum != null)
        // {
        //   console.log("this.historyPageNum:" + this.historyPageNum)
        //   //this.pageAddOrDec(this.historyPageNum);
        //   this.page=this.historyPageNum;
        // }
      },
      wildSelectClick: function (clickNum)
      {
        console.log("this.page1:" + this.page);
        console.log("clickNum1:" + clickNum);
        if (this.page == -1)
        {
          this.page = 0;
        }
        //如果出错则返回上一层目录，比如点击了超过图片数目的按钮，则返回上一层
        // try
        // {
        if ((clickNum == 0)&&(this.page<=0))
        {
          this.btnBack();
        } else
        {
          try
          {
            document.getElementsByClassName("left-half")[0].getElementsByTagName('li')[this.page * 12 + clickNum].getElementsByTagName('a')[0].click();
          }
          catch (err)
          {
            //在此处理错误
            this.btnBack();
          }
        }

      }
    },
    computed: {
      displayName: function ()
      {

      }
    },
    events: {
      'upData': function ()
      {

        console.log("子组件响应：upData")
        this.flashData();

      }

    },
    ready: function ()
    {
      this.flashData();

      // child() 用来定位到某个节点。
      ref.child("App").set({
        "currentView": "Explore",
      });

      //
      var _wildSelectClick = this.wildSelectClick;
      var selectRef = wilddog.sync().ref("/Explore/select");
      selectRef.on('value', function (snapshot, error)
      {
        if (error == null)
        {
          //
          console.log("select:" + snapshot.val());
          //触发相应li的click事件,对-1不作反应
          if (snapshot.val() !== -1)
          {
            _wildSelectClick(snapshot.val());
          }
        } else
        {
          console.log(error);
        }
      });


      var _pageDec = this.pageDec;
      var pagePreRef = wilddog.sync().ref("/Explore/pagePre");
      pagePreRef.on('value', function (snapshot, error)
      {
        if (error == null)
        {
          //
          console.log("pagePre:" + snapshot.val());
          _pageDec();

        } else
        {
          console.log(error);
        }
      });

      var _pageAdd = this.pageAdd;
      var pageNextRef = wilddog.sync().ref("/Explore/pageNext");
      pageNextRef.on('value', function (snapshot, error)
      {
        if (error == null)
        {
          //
          console.log("pageNext:" + snapshot.val());
          _pageAdd()
        } else
        {
          console.log(error);
        }
      });

      // 获取窗口高度

        this.winHeight = window.document.body.clientHeight;


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

      // 根据li数目确定页面数，并设置视图高度以使页面操作适应
      // 等待li渲染完毕，才能正确获取li数目
      setTimeout(this.setView, 200);

    },

    watch: {
      page: function (curVal, oldVal)
      {
        console.log('cur&old:', curVal, oldVal)
        if (oldVal != -1)
        {
          // if(curVal>oldVal){
          //   //下一页面

          // }else{
          //   //上一页面

          // }
          this.pageAddOrDec(curVal);
        }
      },
    },
    // beforeDestroy: function ()
    // {
    //   //
    //   console.log("beforeDestroy,page:" + this.page)
    //   this.historyPageNum = this.page;
    // },

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .explore ul {
    margin-left: 6vw;
    /*margin-top: 3vw;*/
  }
  
  .explore li>a {
    display: block;
    width: 12vw;
    height: 24vh;
    float: left;
    background-color: gray;
    margin-right: 0.5vw;
    margin-bottom: 1vh;
    text-wrap: normal;
    word-wrap: break-word;
    word-break: normal;
  }
  
  .explore img {
    width: 100%;
    height: 100%;
  }
  
  .left-half {
    display: block;
    position: absolute;
    left: 0px;
    width: 50%;
    min-height: 500px;
  }
  
  .right-half {
    display: block;
    position: absolute;
    right: 0px;
    width: 50%;
    min-height: 500px;
  }
</style>