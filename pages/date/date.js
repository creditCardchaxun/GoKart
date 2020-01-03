var app=getApp()
// const date = new Date()
// const years = []
// const months = []
// const days = []

// for (let i = 1990; i <= date.getFullYear(); i++) {
//      years.push(i)
// }

// for (let i = 1; i <= 12; i++) {
//   months.push(i)
// }

// for (let i = 1; i <= 31; i++) {
//   days.push(i)
// }

Page({
  data: {
    // years: years,
    // year: date.getFullYear(),
    // months: months,
    // month: 2,
    // days: days,
    // day: 2,
    // value: [9999, 1, 1],
    start:"",
    end:"",

    strsmonth:[],
    strsday:[],

    // changeBg:'',
    clickDay:'',
    shows:false,
    // changeColor:'',
     alldates:[],
    color: [
      //  {
      //   month: 'current',//要标记的日期所属月份，有效值有prev（上个月）,current（当前月），next（下个月）
      //   day:'',//要标记的日期
      //   color: 'white',//日期文字的颜色，格式为“#HEX”或CSS颜色名
      //   background: "pink",//日期单元格的颜色，格式为“#HEX”或CSS颜色名
      //  },
      
    ],
    timeDuans:[],
    timeName:'',
    timestart:'',
    timechuo:'',
    timeShow:false

  },
  // bindChange: function (e) {
  //   const val = e.detail.value
  //   this.setData({
  //     year: this.data.years[val[0]],
  //     month: this.data.months[val[1]],
  //     day: this.data.days[val[2]]
  //   })
  // },
  dayClick:function(e) {
    var that=this
    console.log("点击日历的某一天：", e)
    let clickDay = e.detail.day;
    let clickMonth=e.detail.month;
    let clickYear = e.detail.year;
    let changeColor = [];
    var aa = {month: 'current', day: clickDay, color: 'white', background: 'pink' };
    changeColor.push(aa);

     that.setData({
       color: changeColor
     })
    if (clickMonth<10){
      clickMonth = '0' + clickMonth
    }
    if(clickDay<10){
      clickDay = '0' + clickDay
    }
    var allDate = clickYear + '-' + clickMonth + '-' + clickDay

    var allmin=[]
    var allmin2 = []
    var days = []
    var hourss=[]
    var keys = '';
    for (var key in that.data.start){ 
       var item = that.data.start[key].day 
       days.push(item)
       if (item == allDate){
         keys = key;
      }
    }
  
    if (days.indexOf(allDate) != -1) {
      hourss = that.data.start[keys].itmes
      for (var i in hourss) {
        var h = hourss[i].start_end
        var s = hourss[i].value
        allmin.push(h)
        allmin2.push(s)
      }

      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];
      prevPage.setData({
        timeValue: allDate,
        accounts: allmin,
        accountChuo: allmin2
      })
      wx.navigateBack({
        delta: 1,
      })
    } else{
      wx.showToast({
        title: '此时间段没有活动,请点击以下活动时间',
        duration: 2000,
        mask: true,
        icon: 'none',
        success: function () { },
        fail: function () { },
        complete: function () { }
      })
    }
  },
  onShow: function () {
    wx.setNavigationBarTitle({ title: app.data.common_pages_title.date });
   },
  onLoad:function(options){
    var that=this;
    var allTime = '';
    var showtime=''
    if (options.time !='undefined'||options.time!=''){
      allTime=JSON.parse(options.time)
    }
    var saiName = options.name
    var aa = {}
    var strs = []
    var timeDuan=''
    var timedian=[]
    var dates=''
    var chuo=''
    // var strsmonth = that.data.strsmonth
    // var strsday = that.data.strsday
    var strs2=[]
    for (var key in allTime) {
      that.data.start = allTime
      timedian = allTime[key].itmes
      for (var keys in timedian){
        dates = timedian[keys].start_end
        chuo = timedian[keys].value
        // console.log('每个时间点', timedian[keys].start_end)
        // console.log('每个时间戳', timedian[keys].value)
      }
      strs2.push(allTime[key].day)
      
      // timeDuan += ", "  + allTime[key].day;
      // that.data.end = allTime[key].end_time
      // that.data.start = that.timestampToTime(allTime[key].start_time)
      // that.data.end = that.timestampToTime(allTime[key].end_time)
      // that.data.alldates.push(that.data.start)
      // strs = this.data.start.split('-')
      // console.log("日期", strs)
      // strsmonth+=strs[1]
      // strsday.push(strs[2]) 

    }
    // console.log(strs2)
    // timeDuan = timeDuan.substr(1)
     timeDuan = strs2
    that.setData({
      timeDuans: timeDuan,
      timeName:saiName,
      timestart: dates,
      timechuo: chuo,
      // timeShow:showtime
    })
  },

  tochooseTime:function(e){
    var that=this;
    var value = e.currentTarget.dataset.value;
    var othersHours='';
    var allmins = [];
    var allmin2s = [];
    var othersday=[];
    var keyss=''     
    for (var key in that.data.start) { 
      othersHours = that.data.start[key].day 
      othersday.push(othersHours)
      if (othersHours == value){
         keyss = key
      }
    }
    var allOthers = that.data.start[keyss].itmes
    for (var i in allOthers) {
      var hs = allOthers[i].start_end
      var ss = allOthers[i].value
      allmins.push(hs)
      allmin2s.push(ss)
     }

    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      timeValue: value,
      accounts: allmins,
      accountChuo: allmin2s
    })
    wx.navigateBack({
      delta: 1,
    })

  },

  timestampToTime: function (timestamp) {
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1) + '-';
    var D = (date.getDate());
    // var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    // var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
    // var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    // var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    // var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    return Y + M + D 
  },
})