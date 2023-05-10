import '../shake.css';

const shake = app => {
    app.directive('shake', {
        mounted: el => {
            //节流, 实现连续点击丝滑抖动
            let shakeOver = true;
            el.addEventListener(
                'click',
                e => {
                    if (shakeOver) {
                        shakeOver = false;
                        e.target.classList.add('apply-shake');
                        let timer = setTimeout(() => {
                            clearTimeout(timer);
                            e.target.classList.remove('apply-shake');
                            shakeOver = true;
                        }, 820); //因为动画是820ms播放完毕
                    }
                },
                false
            );
        }
    });
};
export default shake;
