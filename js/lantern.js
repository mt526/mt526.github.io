// 来源于张苹果博客：https://zhangpingguo.com/
// 创建并添加元素
function createDengContainer(customText) {
    const container = document.createElement('div');
    container.className = 'deng-container';

    // 将获取的文本分割为字符数组，如果没有提供文本，则使用默认的"新年快乐"
    // 固定只取前4个字符，如果不够4个则用默认值
    let texts = customText ? customText.split('') : ['新', '年', '快', '乐'];
    if (texts.length > 4) {
        texts = texts.slice(0, 4); // 只保留前4个字符
    } else if (texts.length < 4) {
        // 如果不足4个，用默认值补全
        const defaultTexts = ['新', '年', '快', '乐'];
        for (let i = texts.length; i < 4; i++) {
            texts.push(defaultTexts[i]);
        }
    }

    // 固定为4个灯笼，左右各2个
    const positions = [
        { side: 'left', index: 0, left: '5%' },   // 左侧第一个，距离左边缘5%
        { side: 'left', index: 1, left: '15%' },  // 左侧第二个，距离左边缘15%
        { side: 'right', index: 2, right: '15%' }, // 右侧第一个，距离右边缘15%
        { side: 'right', index: 3, right: '5%' }   // 右侧第二个，距离右边缘5%
    ];

    positions.forEach((pos, i) => {
        const box = document.createElement('div');
        box.className = `deng-box deng-box${i + 1}`;
        
        // 根据位置设置样式
        if (pos.side === 'left') {
            box.style.left = pos.left;
        } else {
            box.style.right = pos.right;
        }

        const deng = document.createElement('div');
        deng.className = 'deng';

        const xian = document.createElement('div');
        xian.className = 'xian';

        const dengA = document.createElement('div');
        dengA.className = 'deng-a';

        const dengB = document.createElement('div');
        dengB.className = 'deng-b';

        const dengT = document.createElement('div');
        dengT.className = 'deng-t';
        dengT.textContent = texts[i]; // 使用对应的文字

        dengB.appendChild(dengT);
        dengA.appendChild(dengB);
        deng.appendChild(xian);
        deng.appendChild(dengA);

        const shuiA = document.createElement('div');
        shuiA.className = 'shui shui-a';

        const shuiC = document.createElement('div');
        shuiC.className = 'shui-c';
        const shuiB = document.createElement('div');
        shuiB.className = 'shui-b';

        shuiA.appendChild(shuiC);
        shuiA.appendChild(shuiB);
        deng.appendChild(shuiA);
        box.appendChild(deng);
        container.appendChild(box);
    });

    document.body.appendChild(container);
}

// 添加CSS样式
function addStyles() {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.textContent = `
        .deng-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 150px;
            opacity: 0.9;
            z-index: 9999;
            pointer-events: none;
        }
        .deng-box {
            position: absolute;
            top: 10px;
        }
        .deng {
            position: relative;
            width: 110px;
            height: 85px;
            background: rgba(216, 0, 15, .8);
            border-radius: 50% 50%;
            animation: swing 3s infinite ease-in-out;
            box-shadow: -5px 5px 40px 4px #fa6c00;
            margin: 0 5px;
        }
        .deng-a { 
            width: 92px; 
            height: 85px; 
            background: rgba(216, 0, 15, .1); 
            border-radius: 50%;  
            border: 2px solid #dc8f03; 
            margin-left: 7px; 
            display: flex; 
            justify-content: center; 
        }
        .deng-b { 
            width: 60px; 
            height: 78px; 
            background: rgba(216, 0, 15, .1); 
            border-radius: 60%; 
            border: 2px solid #dc8f03; 
        }
        .xian { 
            position: absolute; 
            top: -18px; 
            left: 55px; 
            width: 2px; 
            height: 18px; 
            background: #dc8f03; 
        }
        .shui-a { 
            position: relative; 
            width: 4px; 
            height: 18px; 
            margin: -4px 0 0 54px; 
            animation: swing 4s infinite ease-in-out; 
            transform-origin: 50% -40px; 
            background: orange; 
            border-radius: 0 0 4px 4px; 
        }
        .shui-b { 
            position: absolute; 
            top: 12px; 
            left: -2px; 
            width: 8px; 
            height: 8px; 
            background: #dc8f03; 
            border-radius: 50%; 
        }
        .shui-c { 
            position: absolute; 
            top: 16px; 
            left: -2px; 
            width: 8px; 
            height: 30px; 
            background: orange; 
            border-radius: 0 0 0 4px; 
        }
        .deng:before, .deng:after { 
            content: " "; 
            display: block; 
            position: absolute; 
            border-radius: 4px; 
            border: solid 1px #dc8f03; 
            background: linear-gradient(to right, #dc8f03, orange, #dc8f03, orange, #dc8f03); 
        }
        .deng:before { 
            top: -6px; left: 25px; height: 10px; width: 58px; z-index: 999; 
        }
        .deng:after { 
            bottom: -6px; left: 8px; height: 10px; width: 58px; margin-left: 18px; 
        }
        .deng-t { 
            font-family: '华文行楷', Arial, Lucida Grande, Tahoma, sans-serif; 
            font-size: 2.8rem; 
            color: #dc8f03; 
            font-weight: 700; 
            line-height: 78px; 
            text-align: center; 
        }
        
        /* 为4个灯笼设置具体位置 */
        .deng-box1 { left: 5%; }
        .deng-box2 { left: 15%; }
        .deng-box3 { right: 15%; }
        .deng-box4 { right: 5%; }
        
        @media (max-width: 1200px) {
            .deng-box1 { left: 3%; }
            .deng-box2 { left: 13%; }
            .deng-box3 { right: 13%; }
            .deng-box4 { right: 3%; }
        }
        
        @media (max-width: 992px) {
            .deng {
                width: 95px;
                height: 75px;
            }
            .deng-a { 
                width: 80px; 
                height: 75px; 
                margin-left: 6px;
            }
            .deng-b { 
                width: 52px; 
                height: 69px; 
            }
            .deng-t { 
                font-size: 2.3rem; 
                line-height: 69px; 
            }
            .xian { 
                left: 47px; 
            }
            .shui-a { 
                margin-left: 46px; 
            }
            .deng:before { 
                left: 22px; width: 50px; 
            }
            .deng:after { 
                left: 7px; width: 50px; margin-left: 15px; 
            }
            .deng-box1 { left: 2%; }
            .deng-box2 { left: 12%; }
            .deng-box3 { right: 12%; }
            .deng-box4 { right: 2%; }
        }
        
        @media (max-width: 768px) {
            .deng-container {
                height: 120px;
            }
            .deng {
                width: 75px;
                height: 60px;
            }
            .deng-a { 
                width: 65px; 
                height: 60px; 
                margin-left: 5px;
            }
            .deng-b { 
                width: 42px; 
                height: 55px; 
            }
            .deng-t { 
                font-size: 1.9rem; 
                line-height: 55px; 
            }
            .xian { 
                left: 37px; 
                top: -15px;
                height: 15px;
            }
            .shui-a { 
                margin-left: 36px; 
                height: 15px;
            }
            .deng:before { 
                top: -5px; left: 17px; height: 8px; width: 40px; 
            }
            .deng:after { 
                bottom: -5px; left: 5px; height: 8px; width: 40px; margin-left: 12px; 
            }
            .deng-box {
                top: 15px;
            }
            .deng-box1 { left: 1%; }
            .deng-box2 { left: 11%; }
            .deng-box3 { right: 11%; }
            .deng-box4 { right: 1%; }
        }
        
        @media (max-width: 576px) {
            .deng-container {
                height: 100px;
            }
            .deng {
                width: 65px;
                height: 50px;
            }
            .deng-a { 
                width: 55px; 
                height: 50px; 
                margin-left: 4px;
            }
            .deng-b { 
                width: 36px; 
                height: 46px; 
            }
            .deng-t { 
                font-size: 1.6rem; 
                line-height: 46px; 
            }
            .xian { 
                left: 32px; 
            }
            .shui-a { 
                margin-left: 31px; 
            }
            .deng-box1 { left: 0; }
            .deng-box2 { left: 10%; }
            .deng-box3 { right: 10%; }
            .deng-box4 { right: 0; }
        }
        
        @keyframes swing { 
            0% { transform: rotate(-10deg); }  
            50% { transform: rotate(10deg); }  
            100% { transform: rotate(-10deg); }  
        }
    `;
    document.head.appendChild(style);
}

// 判断当前日期是否在腊月二十~次年正月二十之间
function isLunarFestivalPeriod() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    
    console.log(`当前公历日期: ${year}年${month}月${day}日`);
    
    // 获取农历日期
    const lunarDate = calendarFormatter.solar2lunar(year, month, day);
    
    if (!lunarDate || lunarDate === -1) {
        console.error('农历转换失败，请检查农历库是否正确加载');
        return false; // 农历转换失败，不显示灯笼
    }
    
    // 输出完整的农历信息以便核查
    console.log('农历日期信息:', {
        公历年: lunarDate.cYear,
        公历月: lunarDate.cMonth,
        公历日: lunarDate.cDay,
        农历年: lunarDate.lYear,
        农历月: lunarDate.lMonth,
        农历日: lunarDate.lDay,
        农历月名称: lunarDate.IMonthCn,
        农历日名称: lunarDate.IDayCn,
        生肖: lunarDate.Animal,
        干支年: lunarDate.gzYear,
        干支月: lunarDate.gzMonth,
        干支日: lunarDate.gzDay,
        是否闰月: lunarDate.isLeap,
        节气: lunarDate.Term || '无'
    });
    
    const lunarMonth = lunarDate.lMonth;
    const lunarDay = lunarDate.lDay;
    
    // 腊月是农历12月，正月是农历1月
    // 判断是否在腊月二十到除夕之间（农历12月20日-12月30日/29日）
    if (lunarMonth === 12 && lunarDay >= 20) {
        console.log(`当前日期农历${lunarMonth}月${lunarDay}日，在腊月二十之后，显示灯笼`);
        return true;
    }
    
    // 判断是否在正月初一到正月二十之间（农历1月1日-1月20日）
    if (lunarMonth === 1 && lunarDay <= 20) {
        console.log(`当前日期农历${lunarMonth}月${lunarDay}日，在正月二十之前，显示灯笼`);
        return true;
    }
    
    console.log(`当前日期农历${lunarMonth}月${lunarDay}日，不在腊月二十到正月二十期间，不显示灯笼`);
    return false;
}

// 从当前脚本的URL获取参数
function getScriptParam() {
    // 查找包含lantern.js的script标签
    const scripts = document.getElementsByTagName('script');
    for (let script of scripts) {
        if (script.src && script.src.includes('lantern.js')) {
            // 解析URL参数
            const url = new URL(script.src);
            const textParam = url.searchParams.get('text');
            console.log('从脚本URL获取的参数:', textParam);
            return textParam;
        }
    }
    console.log('未找到包含lantern.js的script标签，使用默认值');
    return null;
}

// 引入时调用
function init() {
    console.log('开始检查灯笼显示条件...');
    
    // 首先检查农历库是否可用
    if (typeof calendarFormatter === 'undefined') {
        console.error('农历库未加载，请确保lunar.js在lantern.js之前引入');
        return;
    }
    
    console.log('农历库已加载，正在获取农历日期...');
    
    // 检查是否在腊月二十~次年正月二十期间
    if (!isLunarFestivalPeriod()) {
        console.log('当前不在腊月二十到正月二十期间，不显示灯笼');
        return; // 不在节日期间，不初始化灯笼
    }
    
    console.log('在节日期间，开始创建灯笼...');
    
    // 获取脚本参数
    const customText = getScriptParam();
    
    addStyles();
    createDengContainer(customText);
    console.log('灯笼创建完成！');
}

// 在页面加载完成后执行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM加载完成，准备初始化灯笼');
        init();
    });
} else {
    console.log('DOM已加载完成，直接初始化灯笼');
    init();
}