
/* 语言映射表文件 */
/* 语言映射表集合 */
const languages = {
  zh_CN: require('./zh_CN'),
  en: require('./en'),
  ja: require('./ja'),
};

/* 导出语言选项列表 */
const languagesPickerList = [];
Object.entries(languages).forEach(item => {
  const [key, val] = item;
  const option = { key, name: val.name };
  languagesPickerList.push(option);
});

/* 获取当前语言版本(中英日韩法,默认中国) */
const getCurrentLanguage = () => {
  return wx.getStorageSync('deviceInfo').language || 'zh_CN';
};

/* 获取语言映射字段集 */
const getLanguageMap = (key = 'zh_CN') => {
  return languages[key].languageMap;
};

/* 将中文翻译成指定语言版本的文字 */
const translateText = text => {
  return getLanguageMap()[text] || text;
};

module.exports = {
  languagesPickerList,

  getCurrentLanguage,
  getLanguageMap,
  translateText
};
