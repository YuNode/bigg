<template>
  <div id="app">
    <component :is="currentView"></component>
  </div>
</template>

<script>
  import Explore from './components/Explore'
  import ShowPic from './components/ShowPic'

  export default {
    components: {
      Explore,
      ShowPic
    },
    data()
    {
      return {

        currentView: "Explore",
        dirs: [],
        imgs: [],
        clickPicIndex: null, //被点击的图片
        previousPath: null,
        exitTime: 720,
      }

    },
    methods: {
      getData(pathStr)
      {
        /*
         var self=this;
         this.$http.jsonp(pathStr).then((response) => {
          success callback
           console.log(response.data)
          self.imgData=response.data;
           self.$set("dirs", response.data.tngou);
           console.log(self.dirs)
           this.currentView = 'Explore'
           
           通知子组件更新数据
           this.$broadcast('upData');
        
          }, (response) => {
           error callback
         }); 
         */

        // //伪数据开始
        // this.dirs = [];
        // this.imgs = [];
        // if (pathStr == "/")
        // {
        //   this.dirs.push({ path: "musics" }, { path: "pics/musics" }, { path: "musics" }, { path: "pics" }, { path: "musics" }, { path: "pics" }, { path: "musics" }, { path: "pics" }, { path: "musics" }, { path: "pics" }, { path: "musics" }, { path: "pics" }, { path: "musics" },
        //     { path: "pics" }, { path: "musics" }, { path: "pics/musics" }, { path: "musics" }, { path: "pics" }, { path: "musics" }, { path: "pics" }, { path: "musics" }, { path: "musics" }, { path: "pics/musics" }, { path: "musics" }, { path: "pics" }, { path: "musics" }, { path: "pics" }, { path: "musics" });
        //   this.imgs.push({ path: "http://image18-c.poco.cn/mypoco/myphoto/20161221/23/6429547220161221234401078.jpg" }, { path: "http://pic.hanfuhui.cn/shop/2015/4/19/4/81927f28c7f44de1b049592f50f0cd05.jpg" }, { path: "http://d01.res.meilishuo.net/pic/_o/72/f3/cbc5de2792148bb5f305c762870e_900_1331.jpg" });
        //   this.previousPath = '/';
        // }

        // if (pathStr == "pics")
        // {
        //   this.dirs.push({ path: "flows" });
        //   this.imgs.push({ path: "http://www.bz55.com/uploads/allimg/160310/140-160310104509.jpg" }, { path: "http://d01.res.meilishuo.net/pic/_o/72/f3/cbc5de2792148bb5f305c762870e_900_1331.jpg" }, { path: "http://img1.3lian.com/2015/w23/3/d/1.jpg" });
        //   this.previousPath = '/';
        // }
        // //伪数据结束


        //排序 
        //by函数接受一个成员名字符串做为参数
        //并返回一个可以用来对包含该成员的对象数组进行排序的比较函数
        var compare = function (prop)
        {
          return function (obj1, obj2)
          {
            var a = obj1[prop]+"";
            var b = obj2[prop]+"";
            var reg = /[0-9]+/g;
            var lista = a.match(reg);
            var listb = b.match(reg);
            if (!lista || !listb)
            {
              return a.localeCompare(b);
            }
            for (var i = 0, minLen = Math.min(lista.length, listb.length); i < minLen; i++)
            {
              //数字所在位置序号
              var indexa = a.indexOf(lista[i]);
              var indexb = b.indexOf(listb[i]);
              //数字前面的前缀
              var prefixa = a.substring(0, indexa);
              var prefixb = a.substring(0, indexb);
              //数字的string
              var stra = lista[i];
              var strb = listb[i];
              //数字的值
              var numa = parseInt(stra);
              var numb = parseInt(strb);
              //如果数字的序号不等或前缀不等，属于前缀不同的情况，直接比较
              if (indexa != indexb || prefixa != prefixb)
              {
                return a.localeCompare(b);
              }
              else
              {
                //数字的string全等
                if (stra === strb)
                {
                  //如果是最后一个数字，比较数字的后缀
                  if (i == minLen - 1)
                  {
                    return a.substring(indexa).localeCompare(b.substring(indexb));
                  }
                  //如果不是最后一个数字，则循环跳转到下一个数字，并去掉前面相同的部分
                  else
                  {
                    a = a.substring(indexa + stra.length);
                    b = b.substring(indexa + stra.length);
                  }
                }
                //如果数字的string不全等，但值相等
                else if (numa == numb)
                {
                  //直接比较数字前缀0的个数，多的更小
                  return strb.lastIndexOf(numb + '') - stra.lastIndexOf(numa + '');
                }
                else
                {
                  //如果数字不等，直接比较数字大小
                  return numa - numb;
                }
              }
            }
          }
        }


        //cordova读取文件
        //cordova.file.externalRootDirectory
        window.resolveLocalFileSystemURL("file:///storage/", getDir, function (evt) { console.log("read file fail: " + evt); });
        this.dirs = [];
        this.imgs = [];
        this.previousPath = null;
        var _dirs = this.dirs;
        var _imgs = this.imgs;
        //var _previousPath=this.previousPath;
        var _this = this;
        function getDir(fileSystem)
        {

          function success(entries)
          {
            console.log("entries.length:" + entries.length)

            entries.sort(compare("name"));
            var i;
            for (i = 0; i < entries.length; i++)
            {
              console.log("path:" + " " + entries[i].name)
              // displayImageByFileURL(entries[2]);

              if (entries[i].isDirectory)
              {
                console.log("dirpath:" + " " + entries[i].fullPath)
                _dirs.push({ path: entries[i].fullPath })
              } else
              {
                //fliePathArray.push(entries[i].fullPath)
                if (/\.(gif|jpg|jpeg|png|GIF|JPG|PNG|JPEG)$/.test(entries[i].toURL()))
                {
                  _imgs.push({ path: entries[i].toURL() })
                }
              }
            }
          }
          fileSystem.getDirectory(pathStr, { create: true }, function (dirEntry)
          {

            console.log("dirEntry.fullPath:" + dirEntry.fullPath)

            dirEntry.getParent(function (parent)
            {
              _this.previousPath = parent.fullPath;
              console.log("parent.fullPath:" + parent.fullPath)
            }, function () { console.log("getParent path fail") });

            var dirReader = dirEntry.createReader();
            dirReader.readEntries(success, function (error)
            {
              console.log("read dir fail" + error)
            })
          }, function (evt) { console.log("read file fail: " + evt); });
        }

        // _imgs.sort(by("path"));
        //cordova读取文件结束

        //通知子组件更新数据
        this.$broadcast('upData');
        //重置退出计时
        this.exitTime = 720;

      }
    },
    ready: function ()
    {
      this.getData('/');

      var that = this;
      setInterval(function ()
      {
        if (that.exitTime >= 1)
        {
          that.exitTime--;
        }
      }, 1000);
    },
    events: {
      showThisPic: function (index)
      {


        // 事件回调内的 `this` 自动绑定到注册它的实例上
        console.log("父组件收到消息：" + index)

        // 在路由处理器中切换页面
        this.currentView = 'ShowPic'
        //传送信息到ShowPic组件
        // this.$broadcast('reveiveAndshow');

      },
      backHome: function ()
      {
        this.currentView = 'Explore';
        //通知子组件更新数据
        this.$broadcast('upData');

      }
    },
    watch: {
      exitTime: function (curVal, oldVal)
      {
        if (curVal == 0)
        {
          console.log("exitAPP");
          navigator.app.exitApp();
        }
      }
    }
  }
</script>

<style>
  * {
    padding: 0;
    margin: 0;
  }
  
  ul {
    list-style-type: none;
  }
  
  a {
    text-decoration: none;
  }
  
  #app {

  }
</style>