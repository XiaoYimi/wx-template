// components/calendar/index.js
/*
 注意事项: 
   由于苹果对于时间格式(2020-08-08)的支持不太友好,开发者可通过 timestamp 自行转换.
*/

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  /**
   * 组件的初始数据
   */
  data: {

    /* 星期列表(不可变) */ 
    barList: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],

    /* 临时手势滑动对象,用于判断左右滑动 */
    startTouch: {},

    /* 日历对象 */
    calendar: {
      year: 0,
      month: 0, /* 0 1月份*/
      date: 0, 
      day: 0, /* 0 星期天 */
      dateStr: '0000年 00月',
      /* 选中值 */
      selected: {
        year: 0,
        month: 0,
        date: 0
      },
    },

    /* 初始化默认值必定为 true, 否则日历组件错乱(设置不可变) */
    isInit: true,

    /* 日期列表 */
    dateList: [],
    /* 用于选中状态的样式显示(1~31) */
    activeDate: 0,
  },

  // 属性监听
  observers: {
    'calendar.year,calendar.month,calendar.date,calendar.selected.year,calendar.selected.month,calendar.selected.date'(cyear, cmonth, cdate, syear, smonth, sdate) {
      if (syear === cyear && smonth === cmonth) {
        this.setData({activeDate: sdate})
      } else {
        this.setData({activeDate: 0})
      }
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 初始化日历
    initCalendar (timestamp = undefined) {
      const now = timestamp ? new Date(timestamp) : new Date();
      const year = now.getFullYear();
      const month = now.getMonth();
      const date = now.getDate();
      const day = now.getDay();

      let dateListLen = this.getDateListLen(year, month);
      const oneNumberWeekDay = this.getOneNumberWeekDay(year, month);
      dateListLen = dateListLen + day;

      const dateList = [];
      for (let i=0; i<dateListLen; i++) {
        const item = {};
        item.value = i < oneNumberWeekDay ? '' : i - oneNumberWeekDay + 1;
        dateList.push(item);
      }

      // 初始化加载选中日期默认值默认值
      if (this.data.isInit) {
        this.setData({
          [`calendar.selected.year`]: year,
          [`calendar.selected.month`]: month,
          [`calendar.selected.date`]: date,
          isInit: false,
        })
      }

      this.setData({
        [`calendar.year`]: year,
        [`calendar.month`]: month,
        [`calendar.date`]: date,
        [`calendar.day`]: day,
        [`calendar.title`]: year + '年 ' + this.addPreZero(month + 1) + '月',
        [`calendar.dateList`]: dateList,
      })
    },
    // 获取指定年月的天数(月份索引 0 开始)
    getDateListLen (year, month) {
      return (new Date(year, month + 1, 0)).getDate();
    },
    // 获取年月下的 1 号为周几(月份索引 0 开始)
    getOneNumberWeekDay (year, month) {
      return (new Date(year, month, 1)).getDay();
    },
    // 月值变化,处理年月变化(true 月值+1， false 月值-1)
    dealYearMonth (year, month, state = true) {
      month = state ? month + 1 : month - 1;
      if (month === -1) {
        year = year - 1;
        month = 11;
      } else if (month === 12) {
        year = year + 1;
        month = 0;
      }
      return { Y: year, M: month };
    },
    // 日期选择(返回字段 年,月,日,时间戳和字符串值)
    selectDate (e) {
      const date = parseInt(e.currentTarget.dataset.date);
      if (date === '0') { return; }
      let { year, month } = this.data.calendar;
      const selectedDate = [year, month, date].join('-')
      this.setData({
        [`calendar.year`]: year,
        [`calendar.month`]: month,
        [`calendar.date`]: date,
        [`calendar.selected.year`]: year,
        [`calendar.selected.month`]: month,
        [`calendar.selected.date`]: date,
      });

      this.triggerEvent('select', {
        year,
        month,
        date,
        value: [year, this.addPreZero(month + 1), this.addPreZero(date)].join('-'),
        timestamp: +new Date(year, month, date),
      });
    },
    // 开始滑动
    touchStart (e) {
      const { clientX, clientY } = e.changedTouches[0];
      this.setData({
        [`startTouch.clientX`]: clientX,
        [`startTouch.clientY`]: clientY
      });
    },
    // 结束滑动
    touchEnd (e) {
      const { clientX } = e.changedTouches[0];
      const sx = this.data.startTouch.clientX;      
      const toRight = clientX - sx > 60;
      const toLeft = clientX - sx < -60;
      if (toRight) { this.prevMonth(); }
      if (toLeft) { this.nextMonth(); }
    },
    // 上一年
    prevYear () {
      const { year, month } = this.data.calendar;
      this.initCalendar(+new Date(year - 1, month, 1));
    },
    // 上一月
    prevMonth () {
      const { year, month } = this.data.calendar;
      const { Y, M } = this.dealYearMonth(year, month, false);
      this.initCalendar(+new Date(Y, M, 1))
    },
    // 下一年
    nextYear () {
      const { year, month } = this.data.calendar;
      this.initCalendar(+new Date(year + 1, month, 1))
    },
    // 下个月
    nextMonth () {
      const { year, month } = this.data.calendar;
      const { Y, M } = this.dealYearMonth(year, month, true);
      this.initCalendar(+new Date(Y, M, 1))
    },
    // 是否添加前缀字符 0 
    addPreZero (n) {
      return String(n)[1]? n : '0' + n;
    },
  },
  // 生命周期
  lifetimes: {
    /* 组件初始化值 */
    attached () { this.initCalendar(); },
  },
})
