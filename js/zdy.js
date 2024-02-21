var CURSOR;

Math.lerp = (a, b, n) => (1 - n) * a + n * b;

const getStyle = (el, attr) => {
    try {
        return window.getComputedStyle
            ? window.getComputedStyle(el)[attr]
            : el.currentStyle[attr];
    } catch (e) {}
    return "";
};

class Cursor {
    constructor() {
        this.pos = {curr: null, prev: null};
        this.pt = [];
        this.create();
        this.init();
        this.render();
    }

    move(left, top) {
        this.cursor.style["left"] = `${left}px`;
        this.cursor.style["top"] = `${top}px`;
    }

    create() {
        if (!this.cursor) {
            this.cursor = document.createElement("div");
            this.cursor.id = "cursor";
            this.cursor.classList.add("hidden");
            document.body.append(this.cursor);
        }

        var el = document.getElementsByTagName('*');
        for (let i = 0; i < el.length; i++)
            if (getStyle(el[i], "cursor") == "pointer")
                this.pt.push(el[i].outerHTML);

        document.body.appendChild((this.scr = document.createElement("style")));
        this.scr.innerHTML = `* {cursor: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8' width='8px' height='8px'><circle cx='4' cy='4' r='4' opacity='.5'/></svg>") 4 4, auto}`;
    }

    refresh() {
        this.scr.remove();
        this.cursor.classList.remove("hover");
        this.cursor.classList.remove("active");
        this.pos = {curr: null, prev: null};
        this.pt = [];

        this.create();
        this.init();
        this.render();
    }

    init() {
        document.onmouseover  = e => this.pt.includes(e.target.outerHTML) && this.cursor.classList.add("hover");
        document.onmouseout   = e => this.pt.includes(e.target.outerHTML) && this.cursor.classList.remove("hover");
        document.onmousemove  = e => {(this.pos.curr == null) && this.move(e.clientX - 8, e.clientY - 8); this.pos.curr = {x: e.clientX - 8, y: e.clientY - 8}; this.cursor.classList.remove("hidden");};
        document.onmouseenter = e => this.cursor.classList.remove("hidden");
        document.onmouseleave = e => this.cursor.classList.add("hidden");
        document.onmousedown  = e => this.cursor.classList.add("active");
        document.onmouseup    = e => this.cursor.classList.remove("active");
    }

    render() {
        if (this.pos.prev) {
            this.pos.prev.x = Math.lerp(this.pos.prev.x, this.pos.curr.x, 0.15);
            this.pos.prev.y = Math.lerp(this.pos.prev.y, this.pos.curr.y, 0.15);
            this.move(this.pos.prev.x, this.pos.prev.y);
        } else {
            this.pos.prev = this.pos.curr;
        }
        requestAnimationFrame(() => this.render());
    }
}

(() => {
    CURSOR = new Cursor();
    // 需要重新获取列表时，使用 CURSOR.refresh()
})();

//首次访问弹窗 !!如果启用，公告栏欢迎就没了！！！
 /*if (localStorage.getItem("popWelcomeWindow") != "0") {
    if(document.referrer==undefined||document.referrer.indexOf("mt526.github.io")!=-1){ //改成自己域名，注意是referrer!!! qwq
        Snackbar.show({
            pos: "top-right",
            showAction: false,
            text: '欢迎访问本站！'
        })
    }else{
        Snackbar.show({
                pos: "top-right",
                showAction: false,
                text: `欢迎来自${document.referrer.split("://")[1].split("/")[0]}的童鞋访问本站！`
            })
        localStorage.setItem("popWelcomeWindow", "0");
    }
}
if (sessionStorage.getItem("popCookieWindow") != "0") {
    setTimeout(function () {
        Snackbar.show({
            text: '本站使用Cookie和本地/会话存储保证浏览体验和网站统计',
            pos: 'bottom-right',
            //actionText: "查看博客声明",*
            onActionClick: function (element) {
                window.open("/license")
            },
        })
    }, 3000)
}
//不在弹出Cookie提醒
sessionStorage.setItem("popCookieWindow", "0");
*/
//自带上文浏览器提示

function browserTC() {
    btf.snackbarShow("");
    Snackbar.show({
        text: '浏览器版本较低，网站样式可能错乱',
        actionText: '关闭',
        duration: '6000',
        pos: 'bottom-right'
    });
}
function browserVersion() {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
    var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
    var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //Edge浏览器
    var isFirefox = userAgent.indexOf("Firefox") > -1; //Firefox浏览器
    var isOpera = userAgent.indexOf("Opera")>-1 || userAgent.indexOf("OPR")>-1 ; //Opera浏览器
    var isChrome = userAgent.indexOf("Chrome")>-1 && userAgent.indexOf("Safari")>-1 && userAgent.indexOf("Edge")==-1 && userAgent.indexOf("OPR")==-1; //Chrome浏览器
    var isSafari = userAgent.indexOf("Safari")>-1 && userAgent.indexOf("Chrome")==-1 && userAgent.indexOf("Edge")==-1 && userAgent.indexOf("OPR")==-1; //Safari浏览器
    if(isEdge) {
        if(userAgent.split('Edge/')[1].split('.')[0]<90){
            browserTC()
        }
    } else if(isFirefox) {
        if(userAgent.split('Firefox/')[1].split('.')[0]<90){
            browserTC()
        }
    } else if(isOpera) {
        if(userAgent.split('OPR/')[1].split('.')[0]<80){
            browserTC()
        }
    } else if(isChrome) {
        if(userAgent.split('Chrome/')[1].split('.')[0]<90){
            browserTC()
        }
    } else if(isSafari) {
        //不知道Safari哪个版本是该淘汰的老旧版本
    }
}
//2022-10-29修正了一个错误：过期时间应使用toGMTString()，而不是toUTCString()，否则实际过期时间在中国差了8小时
function setCookies(obj, limitTime) {
    let data = new Date(new Date().getTime() + limitTime * 24 * 60 * 60 * 1000).toGMTString()
    for (let i in obj) {
        document.cookie = i + '=' + obj[i] + ';expires=' + data
    }
}
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}
if(getCookie('browsertc')!=1){
    setCookies({
        browsertc: 1,
    }, 1);
    browserVersion();
} 

//fps

// if(window.localStorage.getItem("fpson")=="1"){
//如果要使博客设置上面的设置项能生效，就把上面一行取消注释
var rAF = function () {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        }
    );
}();
var frame = 0;
var allFrameCount = 0;
var lastTime = Date.now();
var lastFameTime = Date.now();
var loop = function () {
    var now = Date.now();
    var fs = (now - lastFameTime);
    var fps = Math.round(1000 / fs);
 
    lastFameTime = now;
    // 不置 0，在动画的开头及结尾记录此值的差值算出 FPS
    allFrameCount++;
    frame++;
 
    if (now > 1000 + lastTime) {
        var fps = Math.round((frame * 1000) / (now - lastTime));
        if(fps<=6){
            var kd=`<span style="color:#bd0000">卡成ppt</span>`
        }
        else if(fps<=10){
            var kd=`<span style="color:red">电竞级帧率</span>`
        }
        else if(fps<=14){
            var kd=`<span style="color:yellow">难受</span>`
        }
        else if(fps<24){
            var kd=`<span style="color:orange">卡</span>`
        }
        else if(fps<=40){
            var kd=`<span style="color:green">正常</span>`
        }
        else if(fps<=90){
            var kd=`<span style="color:#425aef">流畅</span>`
        }
        else {
            var kd=`<span style="color:#4dffb2">丝滑</span>`
        }
        document.getElementById("fps").innerHTML=`FPS:${fps} ${kd}`;
        frame = 0;
        lastTime = now;
    };
 
    rAF(loop);
}

loop();
// }
// else{$("#fps").hide()}

//如果要使博客设置上面的设置项能生效，就把上面两行取消注释



//\\
//welcome

document.addEventListener('pjax:complete', todis);
document.addEventListener('DOMContentLoaded', todis);
function todis(){
$.ajax({
    type: 'get',
    url: 'https://apis.map.qq.com/ws/location/v1/ip',
    data: {
        key: 'T3EBZ-TJ7LI-YRBG2-5ZLUR-KD3OS-U6BJO',
        output: 'jsonp',
    },
    dataType: 'jsonp',
    success: function (res) {
        ipLoacation = res;
        function getDistance(e1, n1, e2, n2) {
            const R = 6371
            const { sin, cos, asin, PI, hypot } = Math
        
            let getPoint = (e, n) => {
                e *= PI / 180
                n *= PI / 180
                return { x: cos(n) * cos(e), y: cos(n) * sin(e), z: sin(n) }
            }
        
            let a = getPoint(e1, n1)
            let b = getPoint(e2, n2)
            let c = hypot(a.x - b.x, a.y - b.y, a.z - b.z)
            let r = asin(c / 2) * 2 * R
            return Math.round(r);
        }
        
        function showWelcome() {
        
            let dist = getDistance(116, 36, ipLoacation.result.location.lng, ipLoacation.result.location.lat);
        
            let pos = ipLoacation.result.ad_info.nation;
            let posdesc;
            switch (ipLoacation.result.ad_info.nation) {
                case "日本":
                    posdesc = "よろしく，一起去看樱花吗";
                    break;
                case "美国":
                    posdesc = "Make America Great Again!";
                    break;
                case "英国":
                    posdesc = "想同你一起夜乘伦敦眼";
                    break;
                case "俄罗斯":
                    posdesc = "干了这瓶伏特加！";
                    break;
                case "法国":
                    posdesc = "C'est La Vie";
                    break;
                case "德国":
                    posdesc = "Die Zeit verging im Fluge.";
                    break;
                case "澳大利亚":
                    posdesc = "一起去大堡礁吧！";
                    break;
                case "加拿大":
                    posdesc = "拾起一片枫叶赠予你";
                    break;
                case "中国":
                    pos = ipLoacation.result.ad_info.province + " " + ipLoacation.result.ad_info.city;
                    switch (ipLoacation.result.ad_info.province) {
                        case "北京市":
                            posdesc = "北——京——欢迎你~~~";
                            break;
                        case "天津市":
                            posdesc = "讲段相声吧。";
                            break;
                        case "重庆市":
                            posdesc = "老乡！！！"
                            break;
                        case "河北省":
                            posdesc = "山势巍巍成壁垒，天下雄关。铁马金戈由此向，无限江山。";
                            break;
                        case "山西省":
                            posdesc = "展开坐具长三尺，已占山河五百余。";
                            break;
                        case "内蒙古自治区":
                            posdesc = "天苍苍，野茫茫，风吹草低见牛羊。";
                            break;
                        case "辽宁省":
                            posdesc = "我想吃烤鸡架！";
                            break;
                        case "吉林省":
                            posdesc = "状元阁就是东北烧烤之王。";
                            break;
                        case "黑龙江省":
                            posdesc = "很喜欢哈尔滨大剧院。";
                            break;
                        case "上海市":
                            posdesc = "众所周知，中国只有两个城市。";
                            break;
                        case "江苏省":
                            switch (ipLoacation.result.ad_info.city) {
                                case "南京市":
                                    posdesc = "欢迎来自安徽省南京市的小伙伴。";
                                    break;
                                case "苏州市":
                                    posdesc = "上有天堂，下有苏杭。";
                                    break;
                                default:
                                    posdesc = "散装是必须要散装的。";
                                    break;
                            }
                            break;
                        case "浙江省":
                            posdesc = "东风渐绿西湖柳，雁已还人未南归。";
                            break;
                        case "安徽省":
                            posdesc = "蚌埠住了，芜湖起飞。";
                            break;
                        case "福建省":
                            posdesc = "井邑白云间，岩城远带山。";
                            break;
                        case "江西省":
                            posdesc = "落霞与孤鹜齐飞，秋水共长天一色。";
                            break;
                        case "山东省":
                            posdesc = "遥望齐州九点烟，一泓海水杯中泻。";
                            break;
                        case "湖北省":
                            posdesc = "来碗热干面！";
                            break;
                        case "湖南省":
                            posdesc = "74751，长沙斯塔克。";
                            break;
                        case "广东省":
                            posdesc = "老板来两斤福建人。";
                            break;
                        case "广西壮族自治区":
                            posdesc = "桂林山水甲天下。";
                            break;
                        case "海南省":
                            posdesc = "朝观日出逐白浪，夕看云起收霞光。";
                            break;
                        case "四川省":
                            posdesc = "康康川妹子。";
                            break;
                        case "贵州省":
                            posdesc = "茅台，学生，再塞200。";
                            break;
                        case "云南省":
                            posdesc = "玉龙飞舞云缠绕，万仞冰川直耸天。";
                            break;
                        case "西藏自治区":
                            posdesc = "躺在茫茫草原上，仰望蓝天。";
                            break;
                        case "陕西省":
                            posdesc = "来份臊子面加馍。";
                            break;
                        case "甘肃省":
                            posdesc = "羌笛何须怨杨柳，春风不度玉门关。";
                            break;
                        case "青海省":
                            posdesc = "牛肉干和老酸奶都好好吃。";
                            break;
                        case "宁夏回族自治区":
                            posdesc = "大漠孤烟直，长河落日圆。";
                            break;
                        case "新疆维吾尔自治区":
                            posdesc = "驼铃古道丝绸路，胡马犹闻唐汉风。";
                            break;
                        case "台湾省":
                            posdesc = "我在这头，大陆在那头。";
                            break;
                        case "香港特别行政区":
                            posdesc = "永定贼有残留地鬼嚎，迎击光非岁玉。";
                            break;
                        case "澳门特别行政区":
                            posdesc = "性感荷官，在线发牌。";
                            break;
                        default:
                            posdesc = "社会主义好。";
                            break;
                    }
                    break;
                default:
                    posdesc = "带我去你的国家逛逛吧。";
                    break;
            }
        
            //判断时间
            let timeChange;
            let date = new Date();
            if (date.getHours()>= 5 && date.getHours() < 11) timeChange = "<span>上午好</span>，一日之计在于晨";
            else if (date.getHours()>= 1 && date.getHours() < 13) timeChange = "<span>中午好</span>，该摸鱼吃午饭了";
            else if (date.getHours() >= 13 && date.getHours() < 15) timeChange = "<span>下午好</span>，懒懒地睡个午觉吧！";
            else if (date.getHours() >= 15 && date.getHours() < 16) timeChange = "<span>三点几啦</span>，饮茶先啦！";
            else if (date.getHours() >= 16 && date.getHours() < 19) timeChange = "<span>夕阳无限好！</span>";
            else if (date.getHours() >= 19 && date.getHours() < 24) timeChange = "<span>晚上好</span>，夜生活嗨起来！";
            else timeChange = "夜深了，早点休息，少熬夜";
        
            document.getElementsByClassName("announcement_content")[0].innerHTML =
                `欢迎来自<span>${pos}</span>的小伙伴，${timeChange}<br>
        你距离本作者约有<span>${dist}</span>公里。<br>${posdesc}
        <br>
        `;
        }
        showWelcome()
    }
})
    function switchPostChart () {
    let color = document.documentElement.getAttribute('data-theme') === 'light' ? '#4C4948' : 'rgba(255,255,255,0.7)'
    if (document.getElementById('posts-chart') && postsOption) {
      try {
        let postsOptionNew = postsOption
        postsOptionNew.title.textStyle.color = color
        postsOptionNew.xAxis.nameTextStyle.color = color
        postsOptionNew.yAxis.nameTextStyle.color = color
        postsOptionNew.xAxis.axisLabel.color = color
        postsOptionNew.yAxis.axisLabel.color = color
        postsOptionNew.xAxis.axisLine.lineStyle.color = color
        postsOptionNew.yAxis.axisLine.lineStyle.color = color
        postsOptionNew.series[0].markLine.data[0].label.color = color
        postsChart.setOption(postsOptionNew)
      } catch (error) {
        console.log(error)
      }
    }
    if (document.getElementById('tags-chart') && tagsOption) {
      try {
        let tagsOptionNew = tagsOption
        tagsOptionNew.title.textStyle.color = color
        tagsOptionNew.xAxis.nameTextStyle.color = color
        tagsOptionNew.yAxis.nameTextStyle.color = color
        tagsOptionNew.xAxis.axisLabel.color = color
        tagsOptionNew.yAxis.axisLabel.color = color
        tagsOptionNew.xAxis.axisLine.lineStyle.color = color
        tagsOptionNew.yAxis.axisLine.lineStyle.color = color
        tagsOptionNew.series[0].markLine.data[0].label.color = color
        tagsChart.setOption(tagsOptionNew)
      } catch (error) {
        console.log(error)
      }
    }
    if (document.getElementById('categories-chart') && categoriesOption) {
      try {
        let categoriesOptionNew = categoriesOption
        categoriesOptionNew.title.textStyle.color = color
        categoriesOptionNew.legend.textStyle.color = color
        if (!categoryParentFlag) { categoriesOptionNew.series[0].label.color = color }
        categoriesChart.setOption(categoriesOptionNew)
      } catch (error) {
        console.log(error)
      }
    }
    }
    document.querySelector(".rightMenu-item:has(.fa-moon)").addEventListener("click", function () { setTimeout(switchPostChart, 100) })
    document.getElementById("con-mode").addEventListener("click", function () { setTimeout(switchPostChart, 100) })}
    //