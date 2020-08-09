/* 全局变量,应用于所有页面和组件 */
const WXStore = {};

/* 栈集合: 记录所有已加载的页面栈和组件栈 */
const pageList = [];

/*
  将所打开的页面记录在 pageList 页面栈中,
  并将状态管理 WXStore 数据保存到当前页面的 data.$wxstate 中
*/
function loadWxStore () {
  console.log('current page::', this.route);
  pageList.push(this);
  this.$wxstate = WXStore;
  this.setData({ $wxstate: WXStore });
}

/* 从栈集合中移除当前页面(组件)实例 */
function unLoadStore () {
  const index = pageList.findIndex(page => { page === this })
  console.log(index)
  if (index > -1) { pageList.splice(index, 1); }
}

/* 
  实现数据状态改变(API 语法, 两种方式具备同等效果)
  currentPage.setWXState({ key, value })
  this.setData({ [`$wxstate.key`]: value })
*/
function setWXState (obj) {
  let keys = Object.keys(obj)
  let newObj = {}
  keys.forEach(key => {
    newObj['$wxstate.' + key] = obj[key]
  })
  // 更新所有的组件和页面
  pageList.forEach(item => {
    item.setData(newObj)
  })
}

/* 在页面实例 onload 函数之前, 且 data 已初始化时触发 */
function initPage () {
  let oldPage = Page;
  Page = function (obj) {
    let oldOnLoad = obj.onLoad || function () {};
    let oldOnUnLoad = obj.onUnload || function () {};

    obj.onLoad = function () {
      /* 实现 store 功能,在该周期把 store 对象赋值给 Page 对象的属性 data */
      loadWxStore.call(this);
      /* 实现 setState 功能 */
      this.setWXState = function (obj) {
        setWXState.call(this, obj);
      };
      oldOnLoad.call(this, ...arguments);
    };

    obj.onUnload = function () {
      unLoadStore.call(this);
      oldOnUnLoad.call(this, ...arguments);
    };
    return oldPage(obj);
  };
}

/* 在组件实例 attached 函数之前, 且 data 已初始化时触发 */
function initComponent () {
  let oldComponent = Component;
  Component = function (obj) {
    let oldAttached = obj.attached || function () {};
    let oldDetached = obj.detached || function () {};

    obj.attached = function () {
      loadWxStore.call(this);
      /* 实现 setState 功能 */
      this.setWXState = function (obj) {
        setWXState.call(this, obj);
      };
      oldAttached.call(this, ...arguments);
    };

    obj.detached = function () {
      unLoadStore(this);
      oldDetached.call(this, ...arguments);
    };
    return oldComponent(obj);
  };
}

initPage();
initComponent();