let notifyView: plus.nativeObj.View | null = null;

let startY = 0;
let startTop = 0;
let dragging = false;

export function showNotify(message: string) {

  const barH = plus.navigator.getStatusbarHeight();
  const height = 80;
  const fullHeight = barH + height;
  const hideTop = -fullHeight;

  if (!notifyView) {

    notifyView = new plus.nativeObj.View(
      'notify',
      {
        top: hideTop + 'px',
        left: '0px',
        width: '100%',
        height: fullHeight + 'px'
      },
      [
        {
          tag: 'rect',
          id: 'bg',
          position: { top: '0px', left: '0px', width: '100%', height: fullHeight + 'px' },
          color: 'rgba(0,0,0,0.88)'
        },
        {
          tag: 'font',
          id: 'txt',
          text: message,
          position: { top: barH + 40 + 'px', left: '16px', width: '80%', height: '20px' },
          size: '16px',
          color: '#fff'
        }
      ]
    );

    // === 🎉 iOS/Android 都支持 nativeObj.View 的 touch ===
    
    notifyView.addEventListener('touchstart', (e) => {
      dragging = true;

      // 关键点：必须使用 screenY，不要用 clientY！！
      startY = e.screenY;

      startTop = parseFloat(notifyView!.getStyle().top);
    });

    notifyView.addEventListener('touchmove', (e) => {
      if (!dragging) return;

      // 同样必须用 screenY
      const dy = e.screenY - startY;

      let newTop = startTop + dy;

      if (newTop > 0) newTop = 0;
      if (newTop < hideTop) newTop = hideTop;

      notifyView!.setStyle({
        top: newTop + 'px',
        transition: { duration: 0 }
      });
    });

    notifyView.addEventListener('touchend', () => {
      dragging = false;

      const top = parseFloat(notifyView!.getStyle().top);

      if (top < hideTop / 2) {
        hide();
      } else {
        show();
      }
    });
  }

  notifyView.show();
  show();

  function show() {
    notifyView!.setStyle({
      top: '0px',
      transition: { duration: 150 }
    });
  }

  function hide() {
    notifyView!.setStyle({
      top: hideTop + 'px',
      transition: { duration: 150 }
    });
  }
}
