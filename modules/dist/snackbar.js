// Generated by CoffeeScript 2.0.0-beta4
// Snackbar

// 點心條。
var Snackbar;

Snackbar = (function() {
  class Snackbar {
    constructor() {
      // 元素初始化函式。
      this.init = this.init.bind(this);
      // 元素摧毀函式。
      this.destroy = this.destroy.bind(this);
      
      this.show = this.show.bind(this);
      this.hide = this.hide.bind(this);
      // 模組可用的方法。
      this.methods = this.methods.bind(this);
    }

    init() {
      var $action;
      
      $action = this.$this.find(this.selector.ACTION);
      $action.on('click.snackbar', () => {
        return this.hide('action');
      });
      
      if (this.$this.data('hoverStay') === true) {
        this.$this.on('mouseenter.snackbar', () => {
          return this.$this.attr('data-mouseon', 'true');
        });
        this.$this.on('mouseleave.snackbar', () => {
          return this.$this.attr('data-mouseon', 'false');
        });
      }
      this.show();
      return ts.fn;
    }

    destroy() {
      var $action;
      
      $action = this.$this.find(this.selector.ACTION);
      $action.off('click.snackbar');
      this.$this.off('mouseenter.snackbar');
      return this.$this.off('mouseleave.snackbar');
    }

    show() {
      var $action, $content, action, content, timer;
      // 移除啟用和動畫效果，並且重新套用一次。
      // 在動畫結束後移除動畫樣式。
      this.$this.removeClass(`${this.className.ACTIVE} ${this.className.ANIMATING}`).addClass(`${this.className.ACTIVE} ${this.className.ANIMATING}`).one('animationend', () => {
        return this.$this.removeClass(this.className.ANIMATING);
      }).emulate('animationend', 300).attr('data-mouseon', 'false');
      // 替換點心條的 HTML 內容。
      content = this.$this.data('content');
      if (content !== '') {
        $content = this.$this.find(this.selector.CONTENT);
        $content.html(this.$this.data('content'));
      }
      // 取得動作設置資料。
      action = this.$this.data('action');
      $action = this.$this.find(this.selector.ACTION);
      // 替換動作按鈕的文字。
      if (((action != null ? action.text : void 0) != null) && action.text !== '') {
        $action.html(action.text);
      }
      // 替換動作按鈕的語意。
      if ((action != null ? action.emphasis : void 0) && action.emphasis !== '') {
        $action.removeClass(`${this.className.PRIMARY} ${this.className.INFO} ${this.className.WARNING} ${this.className.NEGATIVE} ${this.className.POSITIVE}`).addClass(action.emphasis);
      }
      
      if (this.$this.data('delay') !== 0) {
        // 保存一個計時器物件，這樣才能不斷地重複利用它。
        timer = {
          name: 'snackbar',
          callback: async() => {
            // 如果時間到了，但是使用者的滑鼠還在點心條上，而且使用者又希望避免自動消失。
            if (this.$this.attr('data-mouseon') === 'true' && this.$this.data('hoverStay') === true) {
              // 稍後一下讓計時器被消除。
              await this.delay();
              // 不斷地重設這個計時器，直到使用者滑鼠移開為止才繼續。
              this.$this.setTimer(timer);
              return;
            }
            // 隱藏此點心條，並以「忽略」模式進行。
            return this.hide('ignore');
          },
          interval: this.$this.data('delay'),
          visible: true
        };
        // 初始化一個延遲計時器，時間到了就會隱藏此點心條。
        return this.$this.setTimer(timer);
      }
    }

    hide(type) {
      
      if (!this.$this.hasClass(this.className.ACTIVE)) {
        return;
      }
      
      this.$this.removeTimer('snackbar');
      
      switch (type) {
        
        case 'action':
          if (this.$this.data('onAction').call(this.$this.get()) === false) {
            return;
          }
          break;
        
        case 'ignore':
          this.$this.data('onIgnore').call(this.$this.get());
      }
      
      if (this.$this.data('onClose').call(this.$this.get()) === false) {
        return;
      }
      
      return this.$this.removeClass(this.className.ACTIVE).addClass(this.className.ANIMATING).one('animationend', () => {
        return this.$this.removeClass(this.className.ANIMATING);
      });
    }

    methods() {
      return {
        // Toggle

        // 切換點心條的顯示、隱藏。
        toggle: () => {
          if (this.$this.hasClass(this.className.ACTIVE)) {
            this.hide();
          } else {
            this.show();
          }
          return ts.fn;
        },
        // Show

        // 顯示一個已存在的點心條。
        show: () => {
          this.show();
          return ts.fn;
        },
        // Hide

        // 隱藏一個已存在的點心條。
        hide: () => {
          this.hide();
          return ts.fn;
        },
        // Is Visible

        // 回傳一個點心條是否可見的布林值。
        'is visible': () => {
          return this.$this.hasClass(this.className.ACTIVE);
        },
        // Is Hidden

        // 回傳一個點心條是否正在隱藏中的布林值。
        'is hidden': () => {
          return !this.$this.hasClass(this.className.ACTIVE);
        }
      };
    }

  };

  // 模組名稱。
  Snackbar.module = 'snackbar';

  // 模組屬性。
  Snackbar.prototype.props = {
    // 主要內容文字。
    content: '',
    // 動作設置。
    action: {
      // 動作按鈕的文字。
      text: '',
      // 動作按鈕的語意。
      emphasis: ''
    },
    // 當點心條關閉時所會呼叫的回呼函式。
    onClose: () => {},
    // 當點心條因為放置而自動關閉時所會呼叫的回呼函式。
    onIgnore: () => {},
    // 當動作按鈕被按下時所呼叫的回呼函式。
    onAction: () => {},
    // 點心條到自動消失所耗費的毫秒時間，如果設為 `0` 則表示永不自動消失。
    delay: 3500,
    // 點心條可否手動忽略，例如：滑開。
    closable: true,
    // 點心條是否應該在滑鼠指向時，持續顯示避免自動消失。
    hoverStay: true
  };

  // 類別樣式名稱。
  Snackbar.prototype.className = {
    ACTIVE: 'active',
    ANIMATING: 'animating',
    PRIMARY: 'primary',
    INFO: 'info',
    WARNING: 'warning',
    POSITIVE: 'positive',
    NEGATIVE: 'negative'
  };

  // 選擇器名稱。
  Snackbar.prototype.selector = {
    CONTENT: '.content',
    ACTION: '.action'
  };

  return Snackbar;

})();

ts(Snackbar);

ts.snackbar = (options) => {};