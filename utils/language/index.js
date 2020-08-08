
/* 获取小程序语言版本 */
const getWXLanguage = () => {
  const { language } = wx.getSystemInfoSync();
  wx.getStorageSync({
    key: 'language',
    data: language
  })
  return language;
};

/* 获取当前语言版本(中英日韩法,默认中国) */
const getCurrentLanguage = () => {
  return wx.wx.getStorageSync('language') || 'zh_CN';
};

/* 获取语言映射字段集 */
const getLanguageMap = () => {
  return require('./' + getCurrentLanguage()).languageMap;
};

/* 将中文翻译成指定语言版本的文字 */
const translateText = text => {
  return getLanguageMap()[text] || text;
};

module.exports = {
  getWXLanguage,
  getCurrentLanguage,
  getLanguageMap,
  translateText
};
