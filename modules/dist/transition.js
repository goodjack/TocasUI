// Generated by CoffeeScript 2.0.0-beta4
// Transition

// 過場效果。
var Transition;

Transition = (function() {
  class Transition {
    constructor() {
      
      this.init = this.init.bind(this);
      
      //if options.animation isnt null

      // Until Visible

      // 此函式會以 `await` 的方式持續阻擋，直到頁面在客戶端上可見為止。
      // 這是避免瀏覽器在不可見的時候會進行重繪，導致動畫亂序。
      this.untilVisible = this.untilVisible.bind(this);
      
      this.delayCheck = this.delayCheck.bind(this);
      
      this.data = this.data.bind(this);
      
      this.push = this.push.bind(this);
      
      this.play = this.play.bind(this);
      
      this.getAnimation = this.getAnimation.bind(this);
      
      this.animate = this.animate.bind(this);
      this.untilAnimated = this.untilAnimated.bind(this);
      
      this.simplePush = this.simplePush.bind(this);
      
      this.destroy = this.destroy.bind(this);
      // 模組可用的方法。
      this.methods = this.methods.bind(this);
    }

    init(options) {
      
      //data = @data().get()

      //if data is undefined
      //    @data().save
      //        stacks: {}
      return ts.fn;
    }

    untilVisible() {
      return new Promise((resolve) => {
        var check;
        check = () => {
          
          if (document.visibilityState !== 'visible') {
            return;
          }
          
          resolve();
          
          return document.removeEventListener('visibilitychange', check);
        };
        
        document.addEventListener('visibilitychange', check);
        
        return check();
      });
    }

    delayCheck(interval) {
      return new Promise(async(resolve) => {
        var timer;
        timer = setInterval(async() => {
          var data;
          data = this.data().get();
          if (!data.skip) {
            return;
          }
          this.$elements.removeAttr('data-animating-hidden').removeAttr('data-animation').removeAttr('data-animating').css('animation-duration', '').off('animationend.animation');
          
          resolve();
          // 清除偵測計時器。
          clearInterval(timer);
          
          await this.delay(interval);
          
          data.skip = false;
          return this.data().save(data);
        }, 10);
        await this.delay(interval);
        return resolve();
      });
    }

    data(selector) {
      var data;
      data = $selector('body').data('animationData');
      if (data === void 0) {
        data = {};
        $selector('body').data('animationData', {});
      }
      if (data[this.$elements.selector] === void 0) {
        data[this.$elements.selector] = {
          looping: false,
          index: 0,
          queue: [],
          animated: 0
        };
        $selector('body').data('animationData', data);
      }
      return {
        
        save: (newData) => {
          data[this.$elements.selector] = newData;
          return $selector('body').data('animationData', data);
        },
        
        get: () => {
          return data[this.$elements.selector];
        }
      };
    }

    async push(options) {
      var data;
      options.duration = options.duration || 1000;
      options.onComplete = options.onComplete || function() {};
      
      data = this.data().get();
      // 將本次的動畫推入至選擇器內的動畫佇列中。
      // 預設的動畫選項。
      // 加上使用者自訂的選項。
      data.queue.push(Object.assign({}, this.props, options, {
        
        skip: false
      }));
      // 將這個變更保存到主要中心。
      this.data().save(data);
      
      await this.delay();
      
      if (data.index === 0) {
        return this.play();
      }
    }

    async play() {
      var animation;
      animation = this.getAnimation();
      if (animation === void 0) {
        return;
      }
      await this.animate(animation);
      
      return this.play();
    }

    getAnimation() {
      var animation, data;
      // 從中心取得主要資料。
      data = this.data().get();
      
      animation = data.queue[data.index];
      
      data.index++;
      
      if (data.queue[data.index] === void 0) {
        
        data.index = 0;
        
        if (data.looping) {
          animation = data.queue[data.index];
        } else {
          
          data.queue = [];
        }
      }
      this.data().save(data);
      return animation;
    }

    animate({animation, reverse, forceOrder, interval, duration, onComplete, onAllComplete, onStart}) {
      return new Promise(async(resolve) => {
        var $element, element, elements, fn, i, index, len, results;
        // 將元素選擇器轉換為陣列，這樣才能以迴圈遞迴。
        // 因為 `await` 只能在 `for` 中使用，而不能用在 `.each` 或 `.forEach`。
        elements = this.$elements.toArray();
        // 如果這個動畫要反序播放就反轉選擇器陣列。
        if (reverse) {
          elements = elements.reverse();
        }
        //switch animation
        //    when 'delay', 'show', 'hide', 'toggle', 'show visibility', 'hide visibility', 'toggle visibility'
        //        elements = []
        switch (animation) {
          case 'delay':
            await this.delay(duration);
            break;
          case 'show':
            this.$elements.removeAttr('data-animating-hidden');
            break;
          case 'hide':
            this.$elements.attr('data-animating-hidden', 'true');
            break;
          case 'toggle':
            if (this.$this.attr('data-animating-hidden') === 'true') {
              this.$this.removeAttr('data-animating-hidden');
            } else {
              this.$this.attr('data-animating-hidden', 'true');
            }
        }
        //when 'show visibility'
        //when 'hide visibility'
        //when 'toggle visibility'
        switch (animation) {
          case 'delay':
          case 'show':
          case 'hide':
          case 'toggle':
          case 'show visibility':
          case 'hide visibility':
          case 'toggle visibility':
            resolve();
            return;
        }
// 遞迴元素選擇器陣列，這樣才能透過 `await` 一個一個逐一執行其動畫。
        
        fn = async($element, index) => {
          
          onStart.call($element.get());
          // 如果動畫名稱中有 `in` 就表示這個動畫會顯示元素，所以就移除元素的隱藏標籤。
          if (animation.indexOf('in') !== -1) {
            $element.removeAttr('data-animating-hidden');
          }
          // 套用動畫名稱、動畫速度。
          $element.attr('data-animation', animation).css('animation-duration', `${duration}ms`);
          // 稍微等待一下才套用執行動畫的標籤，這樣才會有動作。
          await this.delay();
          // 套用執行動畫的標籤。
          $element.attr('data-animating', true);
          // 當這個元素的動畫執行結束時。
          return $element.one('animationend.animation', () => {
            // 呼叫完成函式，並且傳遞自己作為 `this`。
            onComplete.call($element.get());
            //data = @data().get()

            //data.animated++
            //@data().save(data)
            $element.removeAttr('data-animation').removeAttr('data-animating').css('animation-duration', '');
            // 如果動畫名稱中有 `out` 就表示這個動畫會隱藏元素，所以就在動畫結束後加上元素隱藏標籤。
            if (animation.indexOf('out') !== -1) {
              $element.attr('data-animating-hidden', 'true');
            }
            
            if (index === elements.length - 1) {
              onAllComplete();
              return resolve();
            }
          });
        };
        results = [];
        for (index = i = 0, len = elements.length; i < len; index = ++i) {
          element = elements[index];
          $element = $selector(element);
          // 持續以 `await` 阻擋，直到此頁面在螢幕上可見。
          // 這可以避免瀏覽器因為重新繪製而打亂動畫的順序，如果移除此方法會雜亂無章。
          await this.untilVisible();
          fn($element, index);
          //await @delay interval

          // 等待使用者指定的間隔毫秒。
          results.push((await this.delayCheck(interval)));
        }
        return results;
      });
    }

    untilAnimated() {
      return new Promise((resolve) => {
        var timer;
        return timer = setInterval(() => {
          var data;
          data = this.data().get();
          console.log(data.animated, data.queue.length);
          if (data.animated < data.queue.length) {
            return;
          }
          data.animated = 0;
          this.data().save(data);
          resolve();
          // 清除偵測計時器。
          return clearInterval(timer);
        }, 50);
      });
    }

    simplePush(animation, duration, onComplete) {
      if (this.index !== 0) {
        return ts.fn;
      }
      this.push({
        animation: animation,
        duration: duration,
        onComplete: onComplete
      });
      return ts.fn;
    }

    destroy() {}

    methods() {
      return {
        // Delay

        // 延遲指定時間才執行下一個動畫。
        delay: (duration, onComplete) => {
          return this.simplePush('delay', duration, onComplete);
        },
        // Stop

        // 停止目前的這個動畫，執行下一個。
        stop: async() => {
          var data;
          this.$elements.removeAttr('data-animating-hidden').removeAttr('data-animation').removeAttr('data-animating').css('animation-duration', '').off('animationend.animation');
          await this.delay();
          data = this.data().get();
          data.skip = true;
          this.data().save(data);
          return ts.fn;
        },
        // Stop All

        // 停止目前的動畫並且移除整個動畫佇列。
        'stop all': async() => {
          var data;
          data = this.data().get();
          data.looping = false;
          data.index = 0;
          data.queue = [];
          this.data().save(data);
          this.$elements.removeAttr('data-animating-hidden').removeAttr('data-animation').removeAttr('data-animating').css('animation-duration', '').off('animationend.animation');
          await this.delay();
          data.skip = true;
          this.data().save(data);
          return ts.fn;
        },
        // Clear Queue

        // 執行完目前的動畫後就停止並且移除整個動畫佇列。
        'clear queue': () => {
          var data;
          data = this.data().get();
          data.looping = false;
          data.index = 0;
          data.queue = [];
          this.data().save(data);
          return ts.fn;
        },
        // Show

        // 不透過動畫顯示一個元素。
        show: (duration, onComplete) => {
          return this.simplePush('show', duration, onComplete);
        },
        // Hide

        // 不透過動畫隱藏一個元素。
        hide: (duration, onComplete) => {
          return this.simplePush('hide', duration, onComplete);
        },
        // Toggle

        // 不透過動畫切換一個元素的顯示或隱藏狀態。
        toggle: (duration, onComplete) => {
          return this.simplePush('toggle', duration, onComplete);
        },
        // Show Visibility

        // 不透過動畫顯示一個元素的可見狀態。
        'show visibility': (duration, onComplete) => {
          return this.simplePush('show visibility', duration, onComplete);
        },
        // Hide Visibility

        // 不透過動畫隱藏一個元素的可見狀態，這不會移除元素所佔用的空間。
        'hide visibility': (duration, onComplete) => {
          return this.simplePush('hide visibility', duration, onComplete);
        },
        // Toggle Visibility

        // 不透過動畫切換一個元素的顯示或隱藏可見狀態，這會令元素持續佔用其原本的空間。
        'toggle visibility': (duration, onComplete) => {
          return this.simplePush('toggle visibility', duration, onComplete);
        },
        // Set Looping

        // 允許動畫佇列執行到底之後重頭開始，不斷地循環。
        'set looping': () => {
          var data;
          data = this.data().get();
          data.looping = true;
          this.data().save(data);
          return ts.fn;
        },
        // Remove Looping

        // 移除動畫佇列的循環效果。
        'remove looping': () => {
          var data;
          data = this.data().get();
          data.looping = false;
          this.data().save(data);
          return ts.fn;
        },
        // Is Visible

        // 取得一個元素是否可見的布林值。
        'is visible': () => {},
        // Is Animating

        // 取得一個元素是否正在進行動畫的布林值。
        'is animating': () => {},
        // Is Looping

        // 取得一個元素的動畫佇列是否允許循環的布林值。
        'is looping': () => {},
        // Fade Out Down

        bounce: (duration, onComplete) => {
          return this.simplePush('bounce', duration, onComplete);
        },
        // Fade Out Down

        flash: (duration, onComplete) => {
          return this.simplePush('flash', duration, onComplete);
        },
        // Fade Out Down

        pulse: (duration, onComplete) => {
          return this.simplePush('pulse', duration, onComplete);
        },
        // Fade Out Down

        'rubber band': (duration, onComplete) => {
          return this.simplePush('rubber band', duration, onComplete);
        },
        // Fade Out Down

        shake: (duration, onComplete) => {
          return this.simplePush('shake', duration, onComplete);
        },
        // Fade Out Down

        'head shake': (duration, onComplete) => {
          return this.simplePush('head shake', duration, onComplete);
        },
        // Fade Out Down

        swing: (duration, onComplete) => {
          return this.simplePush('swing', duration, onComplete);
        },
        // Fade Out Down

        tada: (duration, onComplete) => {
          return this.simplePush('tada', duration, onComplete);
        },
        // Fade Out Down

        wobble: (duration, onComplete) => {
          return this.simplePush('wobble', duration, onComplete);
        },
        // Fade Out Down

        jello: (duration, onComplete) => {
          return this.simplePush('jello', duration, onComplete);
        },
        // Fade Out Down

        'bounce in': (duration, onComplete) => {
          return this.simplePush('bounce in', duration, onComplete);
        },
        // Fade Out Down

        'bounce in down': (duration, onComplete) => {
          return this.simplePush('bounce in down', duration, onComplete);
        },
        // Fade Out Down

        'bounce in left': (duration, onComplete) => {
          return this.simplePush('bounce in left', duration, onComplete);
        },
        // Fade Out Down

        'bounce in right': (duration, onComplete) => {
          return this.simplePush('bounce in right', duration, onComplete);
        },
        // Fade Out Down

        'bounce in up': (duration, onComplete) => {
          return this.simplePush('bounce in up', duration, onComplete);
        },
        // Fade Out Down

        'bounce out': (duration, onComplete) => {
          return this.simplePush('bounce out', duration, onComplete);
        },
        // Fade Out Down

        'bounce down': (duration, onComplete) => {
          return this.simplePush('bounce down', duration, onComplete);
        },
        // Fade Out Down

        'bounce out left': (duration, onComplete) => {
          return this.simplePush('bounce out left', duration, onComplete);
        },
        // Fade Out Down

        'bounce out right': (duration, onComplete) => {
          return this.simplePush('bounce out right', duration, onComplete);
        },
        // Fade Out Down

        'bounce out up': (duration, onComplete) => {
          return this.simplePush('bounce out up', duration, onComplete);
        },
        // Fade Out Down

        'fade in': (duration, onComplete) => {
          return this.simplePush('fade in', duration, onComplete);
        },
        // Fade Out Down

        'fade in down': (duration, onComplete) => {
          return this.simplePush('fade in down', duration, onComplete);
        },
        // Fade Out Down

        'fade in down heavily': (duration, onComplete) => {
          return this.simplePush('fade in down heavily', duration, onComplete);
        },
        // Fade Out Down

        'fade in left': (duration, onComplete) => {
          return this.simplePush('fade in left', duration, onComplete);
        },
        // Fade Out Down

        'fade in left heavily': (duration, onComplete) => {
          return this.simplePush('fade in left heavily', duration, onComplete);
        },
        // Fade Out Down

        'fade in right': (duration, onComplete) => {
          return this.simplePush('fade in right', duration, onComplete);
        },
        // Fade Out Down

        'fade in right heavily': (duration, onComplete) => {
          return this.simplePush('fade in right heavily', duration, onComplete);
        },
        // Fade Out Down

        'fade in up': (duration, onComplete) => {
          return this.simplePush('fade in up', duration, onComplete);
        },
        // Fade Out Down

        'fade in up heavily': (duration, onComplete) => {
          return this.simplePush('fade in up heavily', duration, onComplete);
        },
        // Fade Out Down

        'fade out down': (duration, onComplete) => {
          return this.simplePush('fade out down', duration, onComplete);
        },
        // Fade Out Down

        'fade out down heavily': (duration, onComplete) => {
          return this.simplePush('fade out down heavily', duration, onComplete);
        },
        // Fade Out Down

        'fade out left': (duration, onComplete) => {
          return this.simplePush('fade out left', duration, onComplete);
        },
        // Fade Out Down

        'fade out left heavily': (duration, onComplete) => {
          return this.simplePush('fade out left heavily', duration, onComplete);
        },
        // Fade Out Down

        'fade out right': (duration, onComplete) => {
          return this.simplePush('fade out right', duration, onComplete);
        },
        // Fade Out Down

        'fade out right heavily': (duration, onComplete) => {
          return this.simplePush('fade out right heavily', duration, onComplete);
        },
        // Fade Out Down

        'fade out up': (duration, onComplete) => {
          return this.simplePush('fade out up', duration, onComplete);
        },
        // Fade Out Down

        'fade out up heavily': (duration, onComplete) => {
          return this.simplePush('fade out up heavily', duration, onComplete);
        },
        // Fade Out Down

        'flip': (duration, onComplete) => {
          return this.simplePush('flip', duration, onComplete);
        },
        // Fade Out Down

        'flip in x': (duration, onComplete) => {
          return this.simplePush('flip in x', duration, onComplete);
        },
        // Fade Out Down

        'flip in y': (duration, onComplete) => {
          return this.simplePush('flip in y', duration, onComplete);
        },
        // Fade Out Down

        'flip out x': (duration, onComplete) => {
          return this.simplePush('flip out x', duration, onComplete);
        },
        // Fade Out Down

        'flip out y': (duration, onComplete) => {
          return this.simplePush('flip out y', duration, onComplete);
        },
        // Fade Out Down

        'light speed in': (duration, onComplete) => {
          return this.simplePush('light speed in', duration, onComplete);
        },
        // Fade Out Down

        'light speed out': (duration, onComplete) => {
          return this.simplePush('light speed out', duration, onComplete);
        },
        // Fade Out Down

        'rotate in': (duration, onComplete) => {
          return this.simplePush('rotate in', duration, onComplete);
        },
        // Fade Out Down

        'rotate in down left': (duration, onComplete) => {
          return this.simplePush('rotate in down left', duration, onComplete);
        },
        // Fade Out Down

        'rotate in down right': (duration, onComplete) => {
          return this.simplePush('rotate in down right', duration, onComplete);
        },
        // Fade Out Down

        'rotate in up left': (duration, onComplete) => {
          return this.simplePush('rotate in up left', duration, onComplete);
        },
        // Fade Out Down

        'rotate in up right': (duration, onComplete) => {
          return this.simplePush('rotate in up right', duration, onComplete);
        },
        // Fade Out Down

        'rotate out': (duration, onComplete) => {
          return this.simplePush('rotate out', duration, onComplete);
        },
        // Fade Out Down

        'rotate out down left': (duration, onComplete) => {
          return this.simplePush('rotate out down left', duration, onComplete);
        },
        // Fade Out Down

        'rotate out down right': (duration, onComplete) => {
          return this.simplePush('rotate out down right', duration, onComplete);
        },
        // Fade Out Down

        'rotate out up left': (duration, onComplete) => {
          return this.simplePush('rotate out up left', duration, onComplete);
        },
        // Fade Out Down

        'rotate out up right': (duration, onComplete) => {
          return this.simplePush('rotate out up right', duration, onComplete);
        },
        // Fade Out Down

        'hinge': (duration, onComplete) => {
          return this.simplePush('hinge', duration, onComplete);
        },
        // Fade Out Down

        'roll in': (duration, onComplete) => {
          return this.simplePush('roll in', duration, onComplete);
        },
        // Fade Out Down

        'roll out': (duration, onComplete) => {
          return this.simplePush('roll out', duration, onComplete);
        },
        // Fade Out Down

        'zoom in': (duration, onComplete) => {
          return this.simplePush('zoom in', duration, onComplete);
        },
        // Fade Out Down

        'zoom in down': (duration, onComplete) => {
          return this.simplePush('zoom in down', duration, onComplete);
        },
        // Fade Out Down

        'zoom in left': (duration, onComplete) => {
          return this.simplePush('zoom in left', duration, onComplete);
        },
        // Fade Out Down

        'zoom in up': (duration, onComplete) => {
          return this.simplePush('zoom in up', duration, onComplete);
        },
        // Fade Out Down

        'zoom in right': (duration, onComplete) => {
          return this.simplePush('zoom in right', duration, onComplete);
        },
        // Fade Out Down

        'zoom out': (duration, onComplete) => {
          return this.simplePush('zoom out', duration, onComplete);
        },
        // Fade Out Down

        'zoom out down': (duration, onComplete) => {
          return this.simplePush('zoom out down', duration, onComplete);
        },
        // Fade Out Down

        'zoom out left': (duration, onComplete) => {
          return this.simplePush('zoom out left', duration, onComplete);
        },
        // Fade Out Down

        'zoom out right': (duration, onComplete) => {
          return this.simplePush('zoom out right', duration, onComplete);
        },
        // Fade Out Down

        'zoom out up': (duration, onComplete) => {
          return this.simplePush('zoom out up', duration, onComplete);
        },
        // Fade Out Down

        'slide in down': (duration, onComplete) => {
          return this.simplePush('slide in down', duration, onComplete);
        },
        // Fade Out Down

        'slide in left': (duration, onComplete) => {
          return this.simplePush('slide in left', duration, onComplete);
        },
        // Fade Out Down

        'slide in right': (duration, onComplete) => {
          return this.simplePush('slide in right', duration, onComplete);
        },
        // Fade Out Down

        'slide in up': (duration, onComplete) => {
          return this.simplePush('slide in up', duration, onComplete);
        },
        // Fade Out Down

        'slide out down': (duration, onComplete) => {
          return this.simplePush('slide out down', duration, onComplete);
        },
        // Fade Out Down

        'slide out left': (duration, onComplete) => {
          return this.simplePush('slide out left', duration, onComplete);
        },
        // Fade Out Down

        'slide out right': (duration, onComplete) => {
          return this.simplePush('slide out right', duration, onComplete);
        },
        // Fade Out Down

        'slide out up': (duration, onComplete) => {
          return this.simplePush('slide out up', duration, onComplete);
        }
      };
    }

  };

  // 模組名稱。
  Transition.module = 'transition';

  Transition.prototype.props = {
    // 欲執行的動畫名稱。
    animation: null,
    // 這個動畫是否要反序執行。
    reverse: false,
    // 強制逐序進行，等元素動畫結束後才執行下一個，
    // 而不是元素動畫開始後相隔數毫秒就執行下一個元素的動畫（啟用此功能會看起來較不順暢）。
    forceOrder: false,
    // 此動畫的元素間隔毫秒。
    interval: 80,
    // 此動畫的速度毫秒。
    duration: 1000,
    // 當此動畫完成時所會呼叫的函式。
    onComplete: function() {},
    // 當此動畫的所有元素都完成播放時所會呼叫的函式。
    onAllComplete: function() {},
    // 此動畫開始演繹時所會呼叫的函式。
    onStart: function() {}
  };

  return Transition;

})();

ts(Transition);