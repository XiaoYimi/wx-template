// components/language/index.js
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
    languages: [
      { id: 0, name: '简体中文', file: 'zh_CN' },
      { id: 1, name: '英语', file: 'en' },
      { id: 2, name: '日语', file: 'ja' }
    ],
    index: 0,
  },

  

  /**
   * 组件的方法列表
   */
  methods: {
    /* 语种切换 */
    languageChange(e)  {
      const index = e.detail.value;
      this.setData({ index });

      wx.setStorage({
        key: 'language',
        data: this.data.languages[index].file
      });
    },
  }
})
