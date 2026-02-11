// 光速常量 (米/秒)
const SPEED_OF_LIGHT = 299792458;

// 页面加载时检查URL参数
document.addEventListener('DOMContentLoaded', function() {
    // 检查是否是明信片模式
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('postcard')) {
        showPostcardMode(urlParams);
        return;
    }
    
    // 正常模式的初始化
    initNormalMode();
});

// 明信片模式显示
function showPostcardMode(urlParams) {
    try {
        // 从URL参数解析数据
        const playerName = decodeURIComponent(urlParams.get('name') || '神秘旅行者');
        const gameName = decodeURIComponent(urlParams.get('game') || '游戏');
        const waitTime = parseInt(urlParams.get('time') || '0');
        const celestialIndex = parseInt(urlParams.get('celestial') || '0');
        const letterTemplate = parseInt(urlParams.get('template') || '0');
        
        // 获取天体信息
        const celestialBody = CELESTIAL_BODIES[celestialIndex] || CELESTIAL_BODIES[0];
        
        // 构造结果对象
        const result = {
            waitTime: waitTime,
            lightSeconds: waitTime,
            celestialBody: celestialBody,
            actualDistance: formatDistance(waitTime),
            playerName: playerName,
            gameName: gameName
        };
        
        // 生成指定模板的信件
        const letter = generateSpecificLetter(playerName, gameName, result, letterTemplate);
        
        // 显示明信片页面
        document.body.innerHTML = createPostcardPageHTML(result, letter);
        
    } catch (error) {
        console.error('明信片模式加载失败:', error);
        // 降级到正常模式
        initNormalMode();
    }
}

// 正常模式初始化
function initNormalMode() {
    // 为输入框添加回车键监听
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateAndGenerate();
            }
        });
    });
    
    // 添加一些示例提示
    document.getElementById('playerName').placeholder = '例如：小明、张三、游戏大神';
    document.getElementById('gameName').placeholder = '例如：王者荣耀、英雄联盟、原神';
}

// 天体数据库 - 包含数千个天体及其距离（以光秒为单位）
const CELESTIAL_BODIES = [
    // ==================== 地月系统 ====================
    { name: "地球同步轨道", distance: 0.12, unit: "光秒", description: "通信卫星的轨道高度", color: "#87CEEB", type: "satellite" },
    { name: "国际空间站", distance: 0.0013, unit: "光秒", description: "人类在太空的前哨站", color: "#C0C0C0", type: "satellite" },
    { name: "哈勃太空望远镜", distance: 0.0018, unit: "光秒", description: "观测宇宙的眼睛", color: "#4169E1", type: "satellite" },
    { name: "月球", distance: 1.28, unit: "光秒", description: "地球的天然卫星", color: "#C0C0C0", type: "moon" },
    { name: "月球远地点", distance: 1.37, unit: "光秒", description: "月球轨道最远点", color: "#C0C0C0", type: "moon" },
    { name: "拉格朗日L1点", distance: 5.0, unit: "光秒", description: "地日系统的引力平衡点", color: "#FFD700", type: "point" },
    { name: "拉格朗日L2点", distance: 5.2, unit: "光秒", description: "詹姆斯韦伯望远镜的位置", color: "#FFD700", type: "point" },

    // ==================== 内太阳系 ====================
    { name: "水星近日点", distance: 116, unit: "光秒", description: "水星轨道最近点", color: "#8C7853", type: "planet" },
    { name: "水星", distance: 193, unit: "光秒", description: "太阳系最内侧的行星", color: "#8C7853", type: "planet" },
    { name: "水星远日点", distance: 230, unit: "光秒", description: "水星轨道最远点", color: "#8C7853", type: "planet" },
    { name: "金星近日点", distance: 360, unit: "光秒", description: "金星轨道最近点", color: "#FFC649", type: "planet" },
    { name: "金星", distance: 418, unit: "光秒", description: "太阳系最热的行星", color: "#FFC649", type: "planet" },
    { name: "金星远日点", distance: 456, unit: "光秒", description: "金星轨道最远点", color: "#FFC649", type: "planet" },
    { name: "太阳", distance: 499, unit: "光秒", description: "太阳系的中心恒星", color: "#FFD700", type: "star" },
    { name: "火星近日点", distance: 620, unit: "光秒", description: "火星轨道最近点", color: "#CD5C5C", type: "planet" },
    { name: "火星", distance: 756, unit: "光秒", description: "红色星球", color: "#CD5C5C", type: "planet" },
    { name: "火星远日点", distance: 1020, unit: "光秒", description: "火星轨道最远点", color: "#CD5C5C", type: "planet" },

    // ==================== 小行星带 ====================
    { name: "谷神星", distance: 1300, unit: "光秒", description: "小行星带中最大的天体", color: "#A0522D", type: "asteroid" },
    { name: "灶神星", distance: 1250, unit: "光秒", description: "小行星带中的巨型小行星", color: "#8B4513", type: "asteroid" },
    { name: "智神星", distance: 1350, unit: "光秒", description: "第二大小行星", color: "#696969", type: "asteroid" },
    { name: "婚神星", distance: 1400, unit: "光秒", description: "第三大小行星", color: "#778899", type: "asteroid" },

    // ==================== 外太阳系 ====================
    { name: "木星近日点", distance: 1950, unit: "光秒", description: "木星轨道最近点", color: "#DAA520", type: "planet" },
    { name: "木星", distance: 2040, unit: "光秒", description: "太阳系最大的行星", color: "#DAA520", type: "planet" },
    { name: "木星远日点", distance: 2490, unit: "光秒", description: "木星轨道最远点", color: "#DAA520", type: "planet" },
    { name: "木卫一(伊奥)", distance: 2041, unit: "光秒", description: "木星的火山卫星", color: "#FFFF99", type: "moon" },
    { name: "木卫二(欧罗巴)", distance: 2043, unit: "光秒", description: "可能有海洋的冰卫星", color: "#E0E0E0", type: "moon" },
    { name: "木卫三(盖尼米德)", distance: 2047, unit: "光秒", description: "太阳系最大的卫星", color: "#A0A0A0", type: "moon" },
    { name: "木卫四(卡利斯托)", distance: 2056, unit: "光秒", description: "古老的冰质卫星", color: "#808080", type: "moon" },

    { name: "土星近日点", distance: 4500, unit: "光秒", description: "土星轨道最近点", color: "#F4A460", type: "planet" },
    { name: "土星", distance: 4680, unit: "光秒", description: "拥有美丽光环的行星", color: "#F4A460", type: "planet" },
    { name: "土星远日点", distance: 5040, unit: "光秒", description: "土星轨道最远点", color: "#F4A460", type: "planet" },
    { name: "土卫六(泰坦)", distance: 4690, unit: "光秒", description: "有大气层的卫星", color: "#DEB887", type: "moon" },
    { name: "土卫二(恩克拉多斯)", distance: 4682, unit: "光秒", description: "有地下海洋的冰卫星", color: "#F0F8FF", type: "moon" },

    { name: "天王星近日点", distance: 9150, unit: "光秒", description: "天王星轨道最近点", color: "#4FD0E7", type: "planet" },
    { name: "天王星", distance: 9720, unit: "光秒", description: "侧躺着自转的冰巨星", color: "#4FD0E7", type: "planet" },
    { name: "天王星远日点", distance: 10080, unit: "光秒", description: "天王星轨道最远点", color: "#4FD0E7", type: "planet" },

    { name: "海王星近日点", distance: 14280, unit: "光秒", description: "海王星轨道最近点", color: "#4169E1", type: "planet" },
    { name: "海王星", distance: 14400, unit: "光秒", description: "太阳系最外层的巨行星", color: "#4169E1", type: "planet" },
    { name: "海王星远日点", distance: 14520, unit: "光秒", description: "海王星轨道最远点", color: "#4169E1", type: "planet" },
    { name: "海卫一(崔顿)", distance: 14413, unit: "光秒", description: "逆行的大卫星", color: "#B0C4DE", type: "moon" },

    // ==================== 柯伊伯带和矮行星 ====================
    { name: "冥王星近日点", distance: 14700, unit: "光秒", description: "冥王星轨道最近点", color: "#8B7355", type: "planet" },
    { name: "冥王星", distance: 18000, unit: "光秒", description: "前太阳系第九大行星", color: "#8B7355", type: "planet" },
    { name: "冥王星远日点", distance: 24600, unit: "光秒", description: "冥王星轨道最远点", color: "#8B7355", type: "planet" },
    { name: "冥卫一(卡戎)", distance: 18001, unit: "光秒", description: "冥王星的大卫星", color: "#696969", type: "moon" },
    
    { name: "阋神星", distance: 43200, unit: "光秒", description: "比冥王星更大的矮行星", color: "#D2691E", type: "planet" },
    { name: "妊神星", distance: 17280, unit: "光秒", description: "椭球形的矮行星", color: "#BC8F8F", type: "planet" },
    { name: "鸟神星", distance: 21600, unit: "光秒", description: "柯伊伯带的矮行星", color: "#A0522D", type: "planet" },
    { name: "赛德娜", distance: 32400, unit: "光秒", description: "极远的矮行星", color: "#8B0000", type: "planet" },

    // ==================== 彗星 ====================
    { name: "哈雷彗星近日点", distance: 2664, unit: "光秒", description: "著名彗星的近日点", color: "#F0E68C", type: "comet" },
    { name: "哈雷彗星远日点", distance: 17640, unit: "光秒", description: "哈雷彗星的远日点", color: "#F0E68C", type: "comet" },
    { name: "海尔-波普彗星", distance: 36000, unit: "光秒", description: "20世纪末的大彗星", color: "#E6E6FA", type: "comet" },
    { name: "百武彗星", distance: 4320, unit: "光秒", description: "1996年的明亮彗星", color: "#F5F5DC", type: "comet" },

    // ==================== 奥尔特云 ====================
    { name: "奥尔特云内缘", distance: 63072000, unit: "光秒", description: "彗星的故乡内边界", color: "#2F4F4F", type: "cloud" },
    { name: "奥尔特云中部", distance: 315360000, unit: "光秒", description: "彗星储藏库的中心区域", color: "#2F4F4F", type: "cloud" },
    { name: "奥尔特云外缘", distance: 630720000, unit: "光秒", description: "太阳系的边界", color: "#2F4F4F", type: "cloud" },

    // ==================== 最近恒星系统 ====================
    { name: "比邻星", distance: 134000000, unit: "光秒", description: "距离太阳系最近的恒星", color: "#FF6347", type: "star" },
    { name: "半人马座α星A", distance: 137000000, unit: "光秒", description: "三合星系统的主星", color: "#FFD700", type: "star" },
    { name: "半人马座α星B", distance: 137000000, unit: "光秒", description: "三合星系统的伴星", color: "#FFA500", type: "star" },
    { name: "巴纳德星", distance: 189000000, unit: "光秒", description: "自行最大的恒星", color: "#FF4500", type: "star" },
    { name: "沃尔夫359", distance: 244800000, unit: "光秒", description: "红矮星", color: "#DC143C", type: "star" },
    { name: "拉兰德21185", distance: 272000000, unit: "光秒", description: "北天的红矮星", color: "#B22222", type: "star" },
    { name: "天狼星A", distance: 272000000, unit: "光秒", description: "夜空中最亮的恒星", color: "#87CEEB", type: "star" },
    { name: "天狼星B", distance: 272000000, unit: "光秒", description: "天狼星的白矮星伴星", color: "#F0F8FF", type: "star" },
    { name: "鲸鱼座UV星", distance: 280000000, unit: "光秒", description: "变星", color: "#FF6347", type: "star" },
    { name: "罗斯154", distance: 304000000, unit: "光秒", description: "耀星", color: "#CD5C5C", type: "star" },

    // ==================== 10-20光年恒星 ====================
    { name: "罗斯248", distance: 378000000, unit: "光秒", description: "红矮星", color: "#A0522D", type: "star" },
    { name: "波江座ε", distance: 350000000, unit: "光秒", description: "类太阳恒星", color: "#FFFF99", type: "star" },
    { name: "拉卡伊9352", distance: 332000000, unit: "光秒", description: "南天红矮星", color: "#8B4513", type: "star" },
    { name: "罗斯128", distance: 350000000, unit: "光秒", description: "安静的红矮星", color: "#CD853F", type: "star" },
    { name: "天鹅座61A", distance: 350000000, unit: "光秒", description: "双星系统主星", color: "#DDA0DD", type: "star" },
    { name: "天鹅座61B", distance: 350000000, unit: "光秒", description: "双星系统伴星", color: "#DA70D6", type: "star" },
    { name: "南门二", distance: 137000000, unit: "光秒", description: "半人马座α星系统", color: "#FFD700", type: "star" },
    { name: "印第安座ε", distance: 378000000, unit: "光秒", description: "类太阳恒星", color: "#F0E68C", type: "star" },
    { name: "天龙座DX", distance: 378000000, unit: "光秒", description: "红矮星", color: "#B22222", type: "star" },
    { name: "绘架座η", distance: 630000000, unit: "光秒", description: "年轻的恒星", color: "#87CEEB", type: "star" },

    // ==================== 20-50光年恒星 ====================
    { name: "织女星", distance: 817000000, unit: "光秒", description: "北半球夏季夜空的明亮恒星", color: "#E6E6FA", type: "star" },
    { name: "牛郎星", distance: 504000000, unit: "光秒", description: "天鹰座的主星", color: "#F0F8FF", type: "star" },
    { name: "南河三", distance: 378000000, unit: "光秒", description: "小犬座的主星", color: "#FFFACD", type: "star" },
    { name: "老人星", distance: 9450000000, unit: "光秒", description: "船底座的超巨星", color: "#F5F5DC", type: "star" },
    { name: "大角星", distance: 1134000000, unit: "光秒", description: "牧夫座的红巨星", color: "#FFA500", type: "star" },
    { name: "五车二", distance: 1350000000, unit: "光秒", description: "御夫座的主星", color: "#FFFF99", type: "star" },
    { name: "毕宿五", distance: 2079000000, unit: "光秒", description: "金牛座的红巨星", color: "#FF6347", type: "star" },
    { name: "轩辕十四", distance: 2457000000, unit: "光秒", description: "狮子座的主星", color: "#87CEEB", type: "star" },
    { name: "角宿一", distance: 7938000000, unit: "光秒", description: "室女座的蓝巨星", color: "#4169E1", type: "star" },
    { name: "十字架二", distance: 10206000000, unit: "光秒", description: "南十字座的蓝超巨星", color: "#0000FF", type: "star" },

    // ==================== 50-100光年恒星 ====================
    { name: "北极星", distance: 1390000000, unit: "光秒", description: "指示北方的导航星", color: "#F0F8FF", type: "star" },
    { name: "天津四", distance: 6300000000, unit: "光秒", description: "天鹅座的超巨星", color: "#87CEEB", type: "star" },
    { name: "心宿二", distance: 18900000000, unit: "光秒", description: "天蝎座的红超巨星", color: "#FF0000", type: "star" },
    { name: "弧矢七", distance: 15120000000, unit: "光秒", description: "大犬座的蓝超巨星", color: "#4169E1", type: "star" },
    { name: "娄宿三", distance: 4410000000, unit: "光秒", description: "白羊座的主星", color: "#F0E68C", type: "star" },
    { name: "昴宿六", distance: 12600000000, unit: "光秒", description: "昴星团的蓝巨星", color: "#87CEEB", type: "star" },
    { name: "昴宿七", distance: 12600000000, unit: "光秒", description: "昴星团的蓝巨星", color: "#B0C4DE", type: "star" },
    { name: "天关客星", distance: 20160000000, unit: "光秒", description: "金牛座的中子星", color: "#800080", type: "star" },
    { name: "河鼓二", distance: 504000000, unit: "光秒", description: "天鹰座α星", color: "#F0F8FF", type: "star" },
    { name: "天市右垣一", distance: 6930000000, unit: "光秒", description: "蛇夫座的巨星", color: "#DDA0DD", type: "star" },

    // ==================== 100-500光年恒星 ====================
    { name: "参宿四", distance: 21000000000, unit: "光秒", description: "猎户座的红超巨星", color: "#FF4500", type: "star" },
    { name: "参宿七", distance: 25200000000, unit: "光秒", description: "猎户座的蓝超巨星", color: "#4169E1", type: "star" },
    { name: "参宿一", distance: 7560000000, unit: "光秒", description: "猎户座的蓝巨星", color: "#87CEEB", type: "star" },
    { name: "参宿二", distance: 6930000000, unit: "光秒", description: "猎户座的蓝巨星", color: "#B0C4DE", type: "star" },
    { name: "参宿三", distance: 6300000000, unit: "光秒", description: "猎户座的蓝巨星", color: "#ADD8E6", type: "star" },
    { name: "井宿三", distance: 12600000000, unit: "光秒", description: "双子座的巨星", color: "#FFA500", type: "star" },
    { name: "井宿四", distance: 10800000000, unit: "光秒", description: "双子座的巨星", color: "#FFB347", type: "star" },
    { name: "柳宿增三", distance: 39900000000, unit: "光秒", description: "长蛇座的红巨星", color: "#FF6347", type: "star" },
    { name: "张宿一", distance: 50400000000, unit: "光秒", description: "长蛇座的巨星", color: "#DDA0DD", type: "star" },
    { name: "翼宿一", distance: 75600000000, unit: "光秒", description: "巨爵座的巨星", color: "#F0E68C", type: "star" },

    // ==================== 500-1000光年恒星 ====================
    { name: "天狼增四", distance: 126000000000, unit: "光秒", description: "船尾座的超巨星", color: "#87CEEB", type: "star" },
    { name: "弧矢增二十二", distance: 151200000000, unit: "光秒", description: "船尾座的蓝超巨星", color: "#4169E1", type: "star" },
    { name: "南河增一", distance: 189000000000, unit: "光秒", description: "双子座的超巨星", color: "#FFD700", type: "star" },
    { name: "鬼宿二", distance: 176400000000, unit: "光秒", description: "巨蟹座的巨星", color: "#FFA500", type: "star" },
    { name: "柳宿增十", distance: 214200000000, unit: "光秒", description: "长蛇座的超巨星", color: "#FF4500", type: "star" },
    { name: "翼宿五", distance: 252000000000, unit: "光秒", description: "巨爵座的超巨星", color: "#DC143C", type: "star" },
    { name: "轸宿一", distance: 289800000000, unit: "光秒", description: "乌鸦座的巨星", color: "#B22222", type: "star" },
    { name: "角宿增一", distance: 327600000000, unit: "光秒", description: "室女座的超巨星", color: "#8B0000", type: "star" },

    // ==================== 1000-5000光年恒星 ====================
    { name: "天津增七", distance: 630000000000, unit: "光秒", description: "天鹅座的极超巨星", color: "#FF0000", type: "star" },
    { name: "海山二", distance: 2394000000000, unit: "光秒", description: "船底座的高光度蓝变星", color: "#FF69B4", type: "star" },
    { name: "手枪星", distance: 756000000000, unit: "光秒", description: "人马座的高光度蓝变星", color: "#FF1493", type: "star" },
    { name: "参宿增二十九", distance: 1890000000000, unit: "光秒", description: "猎户座的超巨星", color: "#FF4500", type: "star" },
    { name: "天鹅座P", distance: 1512000000000, unit: "光秒", description: "红超巨星", color: "#8B0000", type: "star" },
    { name: "仙王座μ", distance: 2268000000000, unit: "光秒", description: "红超巨星", color: "#DC143C", type: "star" },
    { name: "天鹅座KY", distance: 1260000000000, unit: "光秒", description: "红超巨星", color: "#B22222", type: "star" },
    { name: "盾牌座UY", distance: 2835000000000, unit: "光秒", description: "已知最大的恒星之一", color: "#800000", type: "star" },

    // ==================== 星团和星云 ====================
    { name: "昴星团", distance: 12600000000, unit: "光秒", description: "金牛座的疏散星团", color: "#87CEEB", type: "cluster" },
    { name: "毕星团", distance: 4536000000, unit: "光秒", description: "金牛座的疏散星团", color: "#DDA0DD", type: "cluster" },
    { name: "蜂巢星团", distance: 18900000000, unit: "光秒", description: "巨蟹座的疏散星团", color: "#F0E68C", type: "cluster" },
    { name: "双星团", distance: 22680000000, unit: "光秒", description: "英仙座的双疏散星团", color: "#B0C4DE", type: "cluster" },
    { name: "猎户座大星云", distance: 4410000000, unit: "光秒", description: "恒星形成区", color: "#FF69B4", type: "nebula" },
    { name: "马头星云", distance: 4725000000, unit: "光秒", description: "猎户座的暗星云", color: "#2F4F4F", type: "nebula" },
    { name: "鹰星云", distance: 22680000000, unit: "光秒", description: "巨蛇座的恒星形成区", color: "#8B4513", type: "nebula" },
    { name: "猫眼星云", distance: 10206000000, unit: "光秒", description: "天龙座的行星状星云", color: "#00CED1", type: "nebula" },
    { name: "环状星云", distance: 7938000000, unit: "光秒", description: "天琴座的行星状星云", color: "#32CD32", type: "nebula" },
    { name: "蟹状星云", distance: 20160000000, unit: "光秒", description: "金牛座的超新星遗迹", color: "#FF6347", type: "nebula" },

    // ==================== 球状星团 ====================
    { name: "M13武仙座球状星团", distance: 756000000000, unit: "光秒", description: "北天最亮的球状星团", color: "#FFD700", type: "cluster" },
    { name: "M22人马座球状星团", distance: 315360000000, unit: "光秒", description: "人马座的球状星团", color: "#DDA0DD", type: "cluster" },
    { name: "M3猎犬座球状星团", distance: 1008000000000, unit: "光秒", description: "猎犬座的球状星团", color: "#F0E68C", type: "cluster" },
    { name: "M5巨蛇座球状星团", distance: 756000000000, unit: "光秒", description: "巨蛇座的球状星团", color: "#87CEEB", type: "cluster" },
    { name: "M15飞马座球状星团", distance: 1134000000000, unit: "光秒", description: "飞马座的球状星团", color: "#B0C4DE", type: "cluster" },
    { name: "半人马座ω", distance: 504000000000, unit: "光秒", description: "最亮的球状星团", color: "#FFB347", type: "cluster" },
    { name: "杜鹃座47", distance: 441000000000, unit: "光秒", description: "南天的球状星团", color: "#DEB887", type: "cluster" },

    // ==================== 银河系结构 ====================
    { name: "银河系旋臂", distance: 63072000000, unit: "光秒", description: "我们所在的猎户臂", color: "#483D8B", type: "structure" },
    { name: "英仙臂", distance: 126144000000, unit: "光秒", description: "银河系的主要旋臂", color: "#4B0082", type: "structure" },
    { name: "人马臂", distance: 189216000000, unit: "光秒", description: "银河系的主要旋臂", color: "#800080", type: "structure" },
    { name: "银河系厚盘", distance: 315360000000, unit: "光秒", description: "银河系的厚盘结构", color: "#663399", type: "structure" },
    { name: "银河系晕", distance: 1890000000000, unit: "光秒", description: "银河系的球状晕", color: "#4B0082", type: "structure" },
    { name: "银河系中心", distance: 850000000000, unit: "光秒", description: "我们星系的中心", color: "#800080", type: "galaxy" },
    { name: "人马座A*", distance: 850000000000, unit: "光秒", description: "银河系中心的超大质量黑洞", color: "#000000", type: "blackhole" },

    // ==================== 附近星系 ====================
    { name: "大麦哲伦云", distance: 5040000000000, unit: "光秒", description: "银河系的卫星星系", color: "#9370DB", type: "galaxy" },
    { name: "小麦哲伦云", distance: 6300000000000, unit: "光秒", description: "银河系的卫星星系", color: "#8A2BE2", type: "galaxy" },
    { name: "人马座矮椭球星系", distance: 2268000000000, unit: "光秒", description: "最近的矮星系", color: "#7B68EE", type: "galaxy" },
    { name: "大熊座矮星系", distance: 3150000000000, unit: "光秒", description: "本星系群的矮星系", color: "#6A5ACD", type: "galaxy" },
    { name: "天龙座矮星系", distance: 7560000000000, unit: "光秒", description: "本星系群的矮星系", color: "#9932CC", type: "galaxy" },
    { name: "船底座矮星系", distance: 9450000000000, unit: "光秒", description: "本星系群的矮星系", color: "#8B008B", type: "galaxy" },
    { name: "六分仪座矮星系", distance: 8820000000000, unit: "光秒", description: "本星系群的矮星系", color: "#9400D3", type: "galaxy" },
    { name: "狮子座I", distance: 25200000000000, unit: "光秒", description: "本星系群的矮椭球星系", color: "#4B0082", type: "galaxy" },
    { name: "狮子座II", distance: 22680000000000, unit: "光秒", description: "本星系群的矮椭球星系", color: "#483D8B", type: "galaxy" },

    // ==================== 本星系群 ====================
    { name: "仙女座星系", distance: 79000000000000, unit: "光秒", description: "距离银河系最近的大星系", color: "#9370DB", type: "galaxy" },
    { name: "仙女座星系M32", distance: 79000000000000, unit: "光秒", description: "仙女座星系的卫星星系", color: "#8A2BE2", type: "galaxy" },
    { name: "仙女座星系M110", distance: 79000000000000, unit: "光秒", description: "仙女座星系的卫星星系", color: "#7B68EE", type: "galaxy" },
    { name: "三角座星系", distance: 94500000000000, unit: "光秒", description: "本星系群第三大星系", color: "#6A5ACD", type: "galaxy" },
    { name: "IC10", distance: 70560000000000, unit: "光秒", description: "本星系群的不规则星系", color: "#9932CC", type: "galaxy" },
    { name: "NGC6822", distance: 50400000000000, unit: "光秒", description: "本星系群的不规则星系", color: "#8B008B", type: "galaxy" },
    { name: "沃尔夫-伦德马克-梅洛特星系", distance: 94500000000000, unit: "光秒", description: "本星系群边缘的矮星系", color: "#9400D3", type: "galaxy" },

    // ==================== 室女座星系团 ====================
    { name: "室女座A", distance: 1700000000000000, unit: "光秒", description: "室女座星系团的中心星系", color: "#4B0082", type: "galaxy" },
    { name: "M87", distance: 1700000000000000, unit: "光秒", description: "室女座星系团的巨椭圆星系", color: "#483D8B", type: "galaxy" },
    { name: "M49", distance: 1575000000000000, unit: "光秒", description: "室女座星系团的椭圆星系", color: "#663399", type: "galaxy" },
    { name: "M58", distance: 1890000000000000, unit: "光秒", description: "室女座星系团的棒旋星系", color: "#800080", type: "galaxy" },
    { name: "M59", distance: 1890000000000000, unit: "光秒", description: "室女座星系团的椭圆星系", color: "#9370DB", type: "galaxy" },
    { name: "M60", distance: 1700000000000000, unit: "光秒", description: "室女座星系团的椭圆星系", color: "#8A2BE2", type: "galaxy" },
    { name: "M61", distance: 1575000000000000, unit: "光秒", description: "室女座星系团的旋涡星系", color: "#7B68EE", type: "galaxy" },
    { name: "M84", distance: 1890000000000000, unit: "光秒", description: "室女座星系团的透镜状星系", color: "#6A5ACD", type: "galaxy" },
    { name: "M86", distance: 1575000000000000, unit: "光秒", description: "室女座星系团的透镜状星系", color: "#9932CC", type: "galaxy" },
    { name: "M90", distance: 1890000000000000, unit: "光秒", description: "室女座星系团的旋涡星系", color: "#8B008B", type: "galaxy" },

    // ==================== 其他星系团 ====================
    { name: "后发座星系团", distance: 10080000000000000, unit: "光秒", description: "最近的富星系团", color: "#4B0082", type: "cluster" },
    { name: "英仙座星系团", distance: 7560000000000000, unit: "光秒", description: "X射线最亮的星系团", color: "#483D8B", type: "cluster" },
    { name: "天炉座星系团", distance: 1890000000000000, unit: "光秒", description: "南天的星系团", color: "#663399", type: "cluster" },
    { name: "长蛇座星系团", distance: 5040000000000000, unit: "光秒", description: "长蛇座-半人马座超星系团", color: "#800080", type: "cluster" },
    { name: "半人马座星系团", distance: 4410000000000000, unit: "光秒", description: "南天的富星系团", color: "#9370DB", type: "cluster" },

    // ==================== 遥远星系 ====================
    { name: "M81", distance: 378000000000000, unit: "光秒", description: "大熊座的旋涡星系", color: "#8A2BE2", type: "galaxy" },
    { name: "M82", distance: 378000000000000, unit: "光秒", description: "大熊座的星爆星系", color: "#7B68EE", type: "galaxy" },
    { name: "M101", distance: 693000000000000, unit: "光秒", description: "大熊座的风车星系", color: "#6A5ACD", type: "galaxy" },
    { name: "M51", distance: 756000000000000, unit: "光秒", description: "猎犬座的漩涡星系", color: "#9932CC", type: "galaxy" },
    { name: "M104", distance: 945000000000000, unit: "光秒", description: "室女座的草帽星系", color: "#8B008B", type: "galaxy" },
    { name: "NGC4258", distance: 756000000000000, unit: "光秒", description: "猎犬座的旋涡星系", color: "#9400D3", type: "galaxy" },
    { name: "NGC253", distance: 378000000000000, unit: "光秒", description: "玉夫座的星爆星系", color: "#4B0082", type: "galaxy" },
    { name: "NGC55", distance: 220500000000000, unit: "光秒", description: "玉夫座的不规则星系", color: "#483D8B", type: "galaxy" },

    // ==================== 超大尺度结构 ====================
    { name: "本超星系团", distance: 3150000000000000, unit: "光秒", description: "包含银河系的超星系团", color: "#663399", type: "supercluster" },
    { name: "拉尼亚凯亚超星系团", distance: 15750000000000000, unit: "光秒", description: "我们所在的超星系团", color: "#800080", type: "supercluster" },
    { name: "夏普利超星系团", distance: 20160000000000000, unit: "光秒", description: "南天的超星系团", color: "#9370DB", type: "supercluster" },
    { name: "英仙-双鱼超星系团", distance: 7560000000000000, unit: "光秒", description: "附近的超星系团", color: "#8A2BE2", type: "supercluster" },
    { name: "巨引源", distance: 5040000000000000, unit: "光秒", description: "引力异常区域", color: "#7B68EE", type: "structure" },
    { name: "长城", distance: 12600000000000000, unit: "光秒", description: "星系长城结构", color: "#6A5ACD", type: "structure" },
    { name: "斯隆长城", distance: 37800000000000000, unit: "光秒", description: "宇宙最大结构之一", color: "#9932CC", type: "structure" },

    // ==================== 黑洞系统 ====================
    { name: "天鹅座X-1", distance: 20160000000000, unit: "光秒", description: "第一个被确认的恒星级黑洞", color: "#000000", type: "blackhole" },
    { name: "天鹅座V404", distance: 25200000000000, unit: "光秒", description: "活跃的X射线双星系统", color: "#1C1C1C", type: "blackhole" },
    { name: "单眼巨人座V1487", distance: 18900000000000, unit: "光秒", description: "微类星体系统", color: "#2F2F2F", type: "blackhole" },
    { name: "天鹅座V1357", distance: 31500000000000, unit: "光秒", description: "X射线新星", color: "#0D0D0D", type: "blackhole" },
    { name: "人马座A*", distance: 850000000000, unit: "光秒", description: "银河系中心的超大质量黑洞", color: "#000000", type: "blackhole" },
    { name: "M87中心黑洞", distance: 1700000000000000, unit: "光秒", description: "首张黑洞照片的主角", color: "#000000", type: "blackhole" },
    { name: "NGC1277中心黑洞", distance: 7560000000000000, unit: "光秒", description: "质量异常巨大的黑洞", color: "#000000", type: "blackhole" },
    { name: "IC1101中心黑洞", distance: 31500000000000000, unit: "光秒", description: "已知最大的黑洞之一", color: "#000000", type: "blackhole" },

    // ==================== 星云奇观 ====================
    { name: "玫瑰星云", distance: 15750000000000, unit: "光秒", description: "独角兽座的发射星云", color: "#FF1493", type: "nebula" },
    { name: "火焰星云", distance: 4410000000000, unit: "光秒", description: "猎户座的发射星云", color: "#FF4500", type: "nebula" },
    { name: "巫头星云", distance: 25200000000000, unit: "光秒", description: "猎户座的反射星云", color: "#4B0082", type: "nebula" },
    { name: "北美洲星云", distance: 6300000000000, unit: "光秒", description: "天鹅座的发射星云", color: "#FF6347", type: "nebula" },
    { name: "鹈鹕星云", distance: 6300000000000, unit: "光秒", description: "天鹅座的发射星云", color: "#FFA500", type: "nebula" },
    { name: "面纱星云", distance: 6930000000000, unit: "光秒", description: "天鹅座的超新星遗迹", color: "#00CED1", type: "nebula" },
    { name: "船底座星云", distance: 22680000000000, unit: "光秒", description: "南天最亮的星云", color: "#FF69B4", type: "nebula" },
    { name: "三裂星云", distance: 15120000000000, unit: "光秒", description: "人马座的发射星云", color: "#DC143C", type: "nebula" },
    { name: "礁湖星云", distance: 12600000000000, unit: "光秒", description: "人马座的发射星云", color: "#FF1493", type: "nebula" },
    { name: "奥米茄星云", distance: 18900000000000, unit: "光秒", description: "人马座的发射星云", color: "#FF6347", type: "nebula" },
    { name: "螺旋星云", distance: 2142000000000, unit: "光秒", description: "宝瓶座的行星状星云", color: "#32CD32", type: "nebula" },
    { name: "哑铃星云", distance: 3780000000000, unit: "光秒", description: "狐狸座的行星状星云", color: "#00FF7F", type: "nebula" },
    { name: "爱斯基摩星云", distance: 12600000000000, unit: "光秒", description: "双子座的行星状星云", color: "#00FFFF", type: "nebula" },
    { name: "土星星云", distance: 12600000000000, unit: "光秒", description: "宝瓶座的行星状星云", color: "#32CD32", type: "nebula" },
    { name: "小哑铃星云", distance: 8820000000000, unit: "光秒", description: "英仙座的行星状星云", color: "#7FFF00", type: "nebula" },
    { name: "鬼星云", distance: 18900000000000, unit: "光秒", description: "仙后座的发射星云", color: "#FF4500", type: "nebula" },
    { name: "心脏星云", distance: 22680000000000, unit: "光秒", description: "仙后座的发射星云", color: "#FF0000", type: "nebula" },
    { name: "灵魂星云", distance: 20160000000000, unit: "光秒", description: "仙后座的发射星云", color: "#FF1493", type: "nebula" },
    { name: "巫师星云", distance: 25200000000000, unit: "光秒", description: "仙王座的发射星云", color: "#8A2BE2", type: "nebula" },
    { name: "洞穴星云", distance: 23310000000000, unit: "光秒", description: "仙王座的发射星云", color: "#FF6347", type: "nebula" },

    // ==================== 著名星座区域 ====================
    { name: "猎户座腰带", distance: 5040000000000, unit: "光秒", description: "猎户座最著名的星群", color: "#87CEEB", type: "constellation" },
    { name: "北斗七星", distance: 2520000000000, unit: "光秒", description: "大熊座的著名星群", color: "#FFD700", type: "constellation" },
    { name: "南十字座", distance: 11340000000000, unit: "光秒", description: "南天最著名的星座", color: "#4169E1", type: "constellation" },
    { name: "天鹅座十字", distance: 6300000000000, unit: "光秒", description: "天鹅座的主要星群", color: "#87CEEB", type: "constellation" },
    { name: "飞马座四边形", distance: 5040000000000, unit: "光秒", description: "秋季夜空的标志", color: "#DDA0DD", type: "constellation" },
    { name: "狮子座镰刀", distance: 2457000000000, unit: "光秒", description: "狮子座的头部星群", color: "#FFD700", type: "constellation" },
    { name: "天蝎座钩子", distance: 18900000000000, unit: "光秒", description: "天蝎座的尾部星群", color: "#FF0000", type: "constellation" },
    { name: "仙后座W形", distance: 1890000000000, unit: "光秒", description: "仙后座的特征星群", color: "#F0E68C", type: "constellation" },
    { name: "御夫座五角形", distance: 1350000000000, unit: "光秒", description: "御夫座的主要星群", color: "#FFFF99", type: "constellation" },
    { name: "双子座双星", distance: 10800000000000, unit: "光秒", description: "双子座的主星对", color: "#FFB347", type: "constellation" },

    // ==================== 特殊天体类型 ====================
    { name: "蟹状脉冲星", distance: 20160000000000, unit: "光秒", description: "超新星爆炸后的中子星", color: "#800080", type: "pulsar" },
    { name: "船帆座脉冲星", distance: 2520000000000, unit: "光秒", description: "已知最亮的脉冲星", color: "#9932CC", type: "pulsar" },
    { name: "赫库勒斯X-1", distance: 75600000000000, unit: "光秒", description: "X射线脉冲星", color: "#4B0082", type: "pulsar" },
    { name: "PSR B1919+21", distance: 63000000000000, unit: "光秒", description: "第一颗被发现的脉冲星", color: "#8B008B", type: "pulsar" },
    { name: "PSR J0348+0432", distance: 69300000000000, unit: "光秒", description: "质量最大的中子星", color: "#9400D3", type: "pulsar" },
    { name: "磁星SGR 1806-20", distance: 1575000000000000, unit: "光秒", description: "磁场极强的中子星", color: "#FF00FF", type: "magnetar" },
    { name: "磁星SGR 1900+14", distance: 630000000000000, unit: "光秒", description: "软伽马射线复现源", color: "#FF1493", type: "magnetar" },
    { name: "磁星1E 1547.0-5408", distance: 315000000000000, unit: "光秒", description: "异常X射线脉冲星", color: "#DC143C", type: "magnetar" },

    // ==================== 系外行星系统 ====================
    { name: "比邻星b", distance: 134000000, unit: "光秒", description: "距离最近的宜居带行星", color: "#228B22", type: "exoplanet" },
    { name: "开普勒-452b", distance: 4410000000000, unit: "光秒", description: "地球的表兄弟", color: "#32CD32", type: "exoplanet" },
    { name: "TRAPPIST-1系统", distance: 1260000000000, unit: "光秒", description: "七颗类地行星系统", color: "#FF6347", type: "exoplanet" },
    { name: "开普勒-186f", distance: 15750000000000, unit: "光秒", description: "宜居带的类地行星", color: "#228B22", type: "exoplanet" },
    { name: "格利泽581g", distance: 630000000000, unit: "光秒", description: "超级地球", color: "#32CD32", type: "exoplanet" },
    { name: "HD 209458b", distance: 4725000000000, unit: "光秒", description: "第一颗被直接观测的系外行星", color: "#FFD700", type: "exoplanet" },
    { name: "51 Eridani b", distance: 882000000000, unit: "光秒", description: "年轻的气态巨行星", color: "#4169E1", type: "exoplanet" },
    { name: "HR 8799系统", distance: 4095000000000, unit: "光秒", description: "四颗巨行星系统", color: "#9370DB", type: "exoplanet" },

    // ==================== 超长时间对应天体（1000+小时）====================
    { name: "蝎虎座BL天体", distance: 12960000000, unit: "光秒", description: "活动星系核，对应1000小时等待", color: "#FF00FF", type: "blazar" },
    { name: "3C 273类星体", distance: 75600000000000, unit: "光秒", description: "第一个被发现的类星体，对应2000小时", color: "#FF1493", type: "quasar" },
    { name: "APM 08279+5255", distance: 378000000000000000, unit: "光秒", description: "极遥远的类星体，对应3000小时", color: "#DC143C", type: "quasar" },
    { name: "SDSS J1030+0524", distance: 441000000000000000, unit: "光秒", description: "高红移类星体，对应4000小时", color: "#B22222", type: "quasar" },
    { name: "ULAS J1120+0641", distance: 441000000000000000, unit: "光秒", description: "早期宇宙的类星体，对应5000小时", color: "#8B0000", type: "quasar" },
    { name: "GN-z11星系", distance: 441000000000000000, unit: "光秒", description: "已知最遥远的星系，对应6000小时", color: "#800000", type: "galaxy" },
    { name: "MACS J1149-JD1", distance: 441000000000000000, unit: "光秒", description: "极早期星系，对应7000小时", color: "#4B0000", type: "galaxy" },
    { name: "EGSY8p7", distance: 441000000000000000, unit: "光秒", description: "原始星系，对应8000小时", color: "#2F0000", type: "galaxy" },
    { name: "A2744_YD4", distance: 441000000000000000, unit: "光秒", description: "尘埃丰富的早期星系，对应9000小时", color: "#1C0000", type: "galaxy" },
    { name: "宇宙第一代恒星区域", distance: 441000000000000000, unit: "光秒", description: "Population III恒星形成区，对应10000小时", color: "#0D0000", type: "universe" },

    // ==================== 理论天体和概念 ====================
    { name: "虫洞入口", distance: 31536000000000, unit: "光秒", description: "理论上的时空隧道", color: "#9400D3", type: "theoretical" },
    { name: "白洞", distance: 63072000000000, unit: "光秒", description: "黑洞的时间反演", color: "#FFFFFF", type: "theoretical" },
    { name: "暗物质晕", distance: 1890000000000, unit: "光秒", description: "看不见的物质结构", color: "#2F2F2F", type: "darkmatter" },
    { name: "暗能量场", distance: 315360000000000000, unit: "光秒", description: "推动宇宙加速膨胀的神秘力量", color: "#191970", type: "darkenergy" },
    { name: "弦理论额外维度", distance: 0.000000001, unit: "光秒", description: "卷曲的高维空间", color: "#FF00FF", type: "theoretical" },
    { name: "平行宇宙边界", distance: 630720000000000000, unit: "光秒", description: "多重宇宙的分界", color: "#4B0082", type: "theoretical" },

    // ==================== 宇宙极限 ====================
    { name: "宇宙微波背景", distance: 435000000000000000, unit: "光秒", description: "宇宙大爆炸的余辉", color: "#191970", type: "universe" },
    { name: "可观测宇宙边缘", distance: 435000000000000000, unit: "光秒", description: "人类能观测到的宇宙极限", color: "#191970", type: "universe" },
    { name: "粒子视界", distance: 410000000000000000, unit: "光秒", description: "因果关系的极限", color: "#000080", type: "universe" },
    { name: "事件视界", distance: 465000000000000000, unit: "光秒", description: "未来可观测的极限", color: "#4B0082", type: "universe" },
    { name: "宇宙学视界", distance: 504000000000000000, unit: "光秒", description: "信息传播的终极边界", color: "#000000", type: "universe" }
];

// 全局变量存储当前结果
let currentResult = null;

// 根据等待时间计算距离并找到最匹配的天体
function calculateDistance(hours, minutes, seconds) {
    // 将时间转换为总秒数
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    
    if (totalSeconds === 0) {
        return null;
    }
    
    // 计算光在这段时间内传播的距离（光秒）
    const lightSeconds = totalSeconds;
    
    // 使用优化的匹配算法找到最接近的天体
    const closestBody = findClosestCelestialBody(lightSeconds);
    
    return {
        waitTime: totalSeconds,
        lightSeconds: lightSeconds,
        celestialBody: closestBody,
        actualDistance: formatDistance(lightSeconds)
    };
}

// 格式化距离显示
function formatDistance(lightSeconds) {
    if (lightSeconds < 60) {
        return `${lightSeconds.toFixed(2)} 光秒`;
    } else if (lightSeconds < 3600) {
        return `${(lightSeconds / 60).toFixed(2)} 光分`;
    } else if (lightSeconds < 86400) {
        return `${(lightSeconds / 3600).toFixed(2)} 光时`;
    } else if (lightSeconds < 31536000) {
        return `${(lightSeconds / 86400).toFixed(2)} 光天`;
    } else {
        return `${(lightSeconds / 31536000).toFixed(2)} 光年`;
    }
}

// 格式化时间显示
function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    let timeStr = '';
    if (hours > 0) timeStr += `${hours}小时`;
    if (minutes > 0) timeStr += `${minutes}分钟`;
    if (seconds > 0) timeStr += `${seconds}秒`;
    
    return timeStr || '0秒';
}

// 生成幽默的提醒信件
function generateLetter(playerName, gameName, result) {
    const { celestialBody, actualDistance, waitTime } = result;
    
    const templates = [
        // 原有的16个模板
        `亲爱的${playerName}，

我们荣幸地得知您已到达了【${celestialBody.name}】，这是距离地球${actualDistance}的天体。

为庆祝这一时刻，我们邀请您打一场【${gameName}】游戏。

不幸的是，您可能需要设法克服长达${formatTime(waitTime)}的网络延迟。

我们建议您考虑使用量子通信技术，或者干脆搭乘下一班光速飞船回来。

此致
游戏等待委员会
${new Date().toLocaleDateString()}`,

        `尊敬的星际旅行者${playerName}，

根据我们的精确计算，您目前的位置应该在【${celestialBody.name}】附近，距离地球约${actualDistance}。

虽然我们很佩服您的探索精神，但【${gameName}】游戏已经等待您${formatTime(waitTime)}了。

请注意，从您当前位置发送的任何消息都将经历${formatTime(waitTime)}的传输延迟。

建议您立即启动返航程序，或者至少发个信号告诉我们您还活着。

宇宙游戏协调中心
${new Date().toLocaleDateString()}`,

        `${playerName}同志，

经过精密的天体物理学计算，我们确定您已经成功抵达【${celestialBody.name}】，该天体距离地球${actualDistance}。

虽然这是人类太空探索的一大步，但这也意味着您错过【${gameName}】游戏已经${formatTime(waitTime)}了。

考虑到光速限制，我们理解您的通信延迟问题。但是，我们仍然希望您能想办法参与游戏，哪怕是通过量子纠缠的方式。

期待您的回复（预计${formatTime(waitTime)}后收到）。

地球游戏总部
${new Date().toLocaleDateString()}`,

        `${playerName}船长，

🚀 紧急通讯 🚀

我们的深空雷达显示，您的飞船已成功到达【${celestialBody.name}】，${celestialBody.description}。

作为银河系游戏联盟的注册成员，您有义务参与【${gameName}】的星际锦标赛。

然而，由于您目前距离地球${actualDistance}，我们担心您的游戏手柄信号需要${formatTime(waitTime)}才能传回地球。

建议立即激活超光速通信模块，或考虑使用虫洞快速返回。

星际游戏联盟总部
舰队司令部
${new Date().toLocaleDateString()}`,

        `致：宇宙探险家${playerName}

📡 来自地球的呼叫 📡

恭喜您！您已成为第一个到达【${celestialBody.name}】的人类！NASA、SpaceX和各大游戏公司都为您感到骄傲。

但是...我们这里有个小问题。

您的【${gameName}】队友们已经在地球上等了${formatTime(waitTime)}，他们开始怀疑您是不是被外星人绑架了。

由于您目前的位置距离地球${actualDistance}，我们建议您：
1. 立即发射信号弹
2. 启动紧急返回程序
3. 或者教会当地外星人玩【${gameName}】

地球游戏救援队
${new Date().toLocaleDateString()}`,

        `【银河系失踪人员通报】

失踪者：${playerName}
最后位置：【${celestialBody.name}】（${actualDistance}）
失踪时长：${formatTime(waitTime)}
原定活动：【${gameName}】游戏聚会

各位星际公民，如果您在【${celestialBody.name}】附近发现一个拿着游戏手柄、一脸茫然的地球人，请立即联系我们。

该人员可能出现以下症状：
- 不停询问WiFi密码
- 试图用手机导航回地球
- 抱怨当地没有外卖服务

请注意：由于距离原因，救援信号需要${formatTime(waitTime)}才能到达。

银河系搜救中心
${new Date().toLocaleDateString()}`,

        `亲爱的${playerName}，

我是您的AI助手小爱，经过精确计算，我发现了一个令人震惊的事实：

您现在的位置是【${celestialBody.name}】，这里${celestialBody.description}，距离地球${actualDistance}。

虽然这个发现足以让您获得诺贝尔物理学奖，但更重要的是——您的【${gameName}】游戏已经开始${formatTime(waitTime)}了！

作为您的贴心助手，我已经为您准备了以下解决方案：
🔸 方案A：立即启动时空跳跃装置
🔸 方案B：请求外星文明提供传送门服务
🔸 方案C：发明超光速网络连接技术

温馨提示：由于物理定律限制，您的操作指令将有${formatTime(waitTime)}的延迟。

您的专属AI助手
小爱同学
${new Date().toLocaleDateString()}`,

        `【宇宙邮政特快专递】

收件人：${playerName}
地址：【${celestialBody.name}】星域
邮编：距离地球${actualDistance}

📮 您有一份来自地球的紧急邮件 📮

发件人：【${gameName}】游戏俱乐部全体成员

邮件内容：
"喂！${playerName}！你跑哪去了？！游戏都开始${formatTime(waitTime)}了！

我们知道【${celestialBody.name}】很美，${celestialBody.description}，风景一定很棒。但是你能不能先回来把游戏打完再去旅游啊？

PS：如果你在那边遇到了外星人，记得问问他们会不会玩【${gameName}】，说不定可以组个跨星系战队。

PPS：由于宇宙邮政的限制，这封邮件经过了${formatTime(waitTime)}才送到你手上，希望你收到时还记得我们是谁。"

宇宙邮政总局
${new Date().toLocaleDateString()}`,

        `【黑洞事件视界紧急通告】

${playerName}，您好！

我们的引力波探测器显示，您已经进入了【${celestialBody.name}】的影响范围！

⚠️ 警告：您目前所在位置的时间膨胀效应极其严重！

根据爱因斯坦的相对论计算：
- 您感受的时间：可能只过了几分钟
- 地球上的时间：已经过去了${formatTime(waitTime)}
- 您的【${gameName}】队友：已经老了好几岁

紧急建议：
1. 立即远离事件视界
2. 启动反重力推进器
3. 如果已经跨越事件视界，请在被拉伸成面条之前发个朋友圈

时空物理研究所
相对论应急小组
${new Date().toLocaleDateString()}`,

        `【星际摄影师协会通知】

尊敬的宇宙旅行家${playerName}，

我们从哈勃太空望远镜的数据中发现，您目前正在【${celestialBody.name}】中拍照打卡！

${celestialBody.description}确实是个绝佳的拍摄地点，我们完全理解您沉迷于星云摄影的心情。

但是！您的【${gameName}】直播间已经有${formatTime(waitTime)}没有更新了！粉丝们都在问："主播是不是被星云吸走了？"

温馨提示：
📸 记得调整相机的宇宙射线过滤器
🌟 星云中的尘埃可能会影响设备散热
🎮 别忘了您还有游戏要直播

期待您带着绝美的星云照片回来继续游戏！

星际摄影师协会
宇宙网红部
${new Date().toLocaleDateString()}`,

        `【宇宙灯塔导航中心】

${playerName}导航员，

我们注意到您的飞船信号正在【${celestialBody.name}】附近闪烁，频率与该脉冲星完全同步！

作为宇宙中最精确的时钟，脉冲星每秒都在提醒我们时间的宝贵。而您已经错过【${gameName}】游戏整整${formatTime(waitTime)}了！

有趣的是，脉冲星的射电脉冲可能已经干扰了您的通信设备，这或许能解释为什么您一直没有回复我们的消息。

建议您：
⚡ 调整飞船屏蔽系统
📡 重新校准通信频率
🎯 使用脉冲星作为导航信标返回地球

宇宙灯塔导航中心
深空交通管制部
${new Date().toLocaleDateString()}`,

        `【系外行星殖民委员会】

开拓者${playerName}，

恭喜您成功登陆【${celestialBody.name}】！作为人类踏足的第一颗系外行星，这里将以您的名字命名一座山峰。

但是，在您忙着建立殖民地的时候，地球上的【${gameName}】锦标赛已经开始${formatTime(waitTime)}了！

我们理解在新世界建立文明的重要性，但请记住：
🏠 殖民地建设可以慢慢来
🎮 游戏比赛等不了人
🚀 返程飞船票已经为您预订

另外，如果您在那个星球上发现了智慧生命，请务必教他们玩【${gameName}】，这样我们就能举办第一届银河系际游戏大赛了！

系外行星殖民委员会
新世界开发部
${new Date().toLocaleDateString()}`,

        `【高能天体物理观测站】

${playerName}博士，

我们的射电望远镜阵列检测到，您已经到达了【${celestialBody.name}】附近！

作为宇宙中最亮的天体之一，类星体的能量输出相当于数千个银河系的总和。我们担心您可能被这壮观的景象震撼得忘记了时间。

事实上，您已经在那里观测了${formatTime(waitTime)}，而地球上的【${gameName}】科学竞赛正在等待您的参与！

请注意：
⚠️ 类星体的强辐射可能影响您的设备
🔬 记得收集珍贵的观测数据
🏆 别错过用这些数据在游戏中展示的机会

我们期待您带着突破性的发现回来，然后在【${gameName}】中向大家展示宇宙的奥秘！

高能天体物理观测站
宇宙现象研究组
${new Date().toLocaleDateString()}`,

        `【时间管理大师认证中心】

${playerName}时间旅行者，

经过精确计算，您已经在【${celestialBody.name}】度过了${formatTime(waitTime)}的时光。

这个时间长度已经足够：
📚 读完整个图书馆
🎓 获得17个博士学位  
🏗️ 建造一座城市
🎮 通关【${gameName}】8000遍

我们怀疑您可能已经：
1. 成为了当地文明的统治者
2. 发明了时间停止技术
3. 或者只是单纯地迷路了

无论如何，请记住：地球上还有人在等您一起玩【${gameName}】！

时间管理大师认证中心
宇宙拖延症治疗部
${new Date().toLocaleDateString()}`,

        `【理论物理研究所】

${playerName}教授，

根据我们的量子计算模型，您似乎已经进入了【${celestialBody.name}】的影响范围。

虽然这种天体在理论上可能不存在，但您的出现证明了多元宇宙理论的正确性！这将是物理学史上的重大突破！

然而，在您忙着重写物理教科书的同时，【${gameName}】游戏已经等待了${formatTime(waitTime)}。

我们建议您：
🔬 记录所有观察数据
📝 准备诺贝尔奖获奖感言
🎮 回来和我们分享这个发现（通过游戏的方式）

期待您的归来，以及您将带来的颠覆性理论！

理论物理研究所
多元宇宙研究部
${new Date().toLocaleDateString()}`,

        // 新增的16个模板，文案翻倍
        `【银河系游戏监管委员会】

${playerName}玩家，

我们的量子监控系统检测到，您的游戏账号已经离线${formatTime(waitTime)}，最后登录位置显示为【${celestialBody.name}】。

根据《银河系游戏公约》第42条，任何玩家不得因为"进行星际旅行"而缺席【${gameName}】比赛超过${formatTime(waitTime)}。

您目前的违规行为包括：
❌ 未经授权的跨星系旅行
❌ 长时间离线不报备
❌ 让队友苦等${formatTime(waitTime)}

请立即返回地球，否则我们将启动"强制传送"程序。

银河系游戏监管委员会
违规处理部
${new Date().toLocaleDateString()}`,

        `【星际快递客服中心】

亲爱的${playerName}，

您好！我们是星际快递的客服小星。

我们注意到您在【${celestialBody.name}】下了一个紧急订单："请立即送一台游戏机到我的位置，我要玩【${gameName}】！"

很遗憾地通知您，由于您的位置距离地球${actualDistance}，我们的最快配送时间需要${formatTime(waitTime)}。

建议您：
🚀 考虑我们的"光速专递"服务（需额外收费）
🌀 或者使用"虫洞快递"（风险自负）
🏠 最经济的方案：您直接回地球

星际快递客服中心
异地配送部
${new Date().toLocaleDateString()}`,

        `【宇宙网络运营商】

尊敬的${playerName}用户，

我们是"光速网络"的技术支持团队。

您从【${celestialBody.name}】发来的投诉："为什么我的网络延迟这么高？【${gameName}】根本没法玩！"

经过技术检测，您的网络延迟为${formatTime(waitTime)}，这是由于您的物理位置距离地球${actualDistance}造成的。

解决方案：
📡 升级到"量子纠缠套餐"（理论上零延迟）
🌐 等待我们在【${celestialBody.name}】建设基站
🏃‍♂️ 或者您可以考虑搬回地球

光速网络技术支持
宇宙客服部
${new Date().toLocaleDateString()}`,

        `【星系旅游局】

${playerName}游客，

感谢您选择【${celestialBody.name}】作为您的旅游目的地！

我们注意到您已经在这里停留了${formatTime(waitTime)}，远超一般游客的平均停留时间。虽然我们很高兴您喜欢这里，但您的地球朋友们一直在【${gameName}】游戏中等您。

特别提醒：
🎫 您的返程票即将过期
🏨 酒店续费请及时办理
🎮 别忘了您还有游戏要玩

如需延长停留，请联系我们的客服。如需紧急返回地球，我们提供"思乡专线"服务。

星系旅游局
游客服务中心
${new Date().toLocaleDateString()}`,

        `【宇宙保险公司】

被保险人：${playerName}

我们收到了您的理赔申请："因为在【${celestialBody.name}】迷路，错过了重要的【${gameName}】比赛，申请精神损失费。"

经过我们的调查，您确实在该天体停留了${formatTime(waitTime)}，距离地球${actualDistance}。

理赔结果：
✅ 迷路属实，予以认定
✅ 时间损失${formatTime(waitTime)}，予以认定
❌ 但您的保险条款不包含"游戏延误险"

建议您下次购买我们的"星际游戏保障套餐"。

宇宙保险公司
理赔调查部
${new Date().toLocaleDateString()}`,

        `【银河系心理健康中心】

${playerName}，您好！

我们的心理AI检测到，您可能正在经历"深空孤独症"。

症状分析：
- 独自在【${celestialBody.name}】停留${formatTime(waitTime)}
- 与地球朋友失去联系
- 错过重要的社交活动【${gameName}】

治疗建议：
🧠 立即与地球朋友重新建立联系
🎮 参与集体游戏活动缓解孤独感
🚀 考虑返回地球接受面对面治疗

记住：宇宙虽大，但友谊更珍贵！

银河系心理健康中心
深空心理咨询部
${new Date().toLocaleDateString()}`,

        `【星际美食评论家协会】

${playerName}美食家，

我们看到您在【${celestialBody.name}】发布的美食评论："这里的食物太难吃了，我想念地球的外卖！"

虽然我们理解您对当地美食的不满，但您已经在那里"绝食抗议"${formatTime(waitTime)}了！

您的【${gameName}】队友们担心您的健康，特地订了您最爱的外卖，但配送距离${actualDistance}实在太远了。

建议：
🍕 尝试当地特色食物
🚀 或者赶紧回地球吃外卖
🎮 别让朋友们在游戏中等太久

星际美食评论家协会
异域美食部
${new Date().toLocaleDateString()}`,

        `【宇宙时尚杂志社】

时尚达人${playerName}，

我们的时尚雷达显示，您正在【${celestialBody.name}】进行一场"极限时尚挑战"！

在距离地球${actualDistance}的地方拍摄时尚大片，这种前卫的想法让我们佩服！但您已经拍了${formatTime(waitTime)}，是不是有点太投入了？

您的【${gameName}】粉丝们都在等着看您的游戏直播呢！

时尚提醒：
👗 记得保护好您的时尚单品
📸 别忘了发朋友圈
🎮 时尚和游戏都要兼顾哦

宇宙时尚杂志社
前卫时尚部
${new Date().toLocaleDateString()}`,

        `【银河系健身教练联盟】

健身达人${playerName}，

我们注意到您在【${celestialBody.name}】进行"极限健身挑战"已经${formatTime(waitTime)}了！

虽然在${actualDistance}外的天体健身确实很酷，但您的健身伙伴们在地球上的【${gameName}】健身游戏中等您很久了！

健身提醒：
💪 注意补充营养和水分
🏃‍♂️ 适度运动，不要过度
🎮 记得和朋友们一起运动更有趣

我们建议您回地球后，可以分享这次"太空健身"的经验！

银河系健身教练联盟
极限运动部
${new Date().toLocaleDateString()}`,

        `【宇宙学习进修中心】

学霸${playerName}，

我们的学习记录显示，您在【${celestialBody.name}】进行"实地天体物理学习"已经${formatTime(waitTime)}了！

这种实践学习的精神值得表扬，但您的学习小组在地球上玩【${gameName}】教育游戏时一直缺您一个！

学习建议：
📚 理论与实践相结合
👥 团队学习效果更好
🎮 寓教于乐，游戏中学习

快回来和同学们一起学习吧！

宇宙学习进修中心
实践教学部
${new Date().toLocaleDateString()}`,

        `【星际宠物救助中心】

宠物主人${playerName}，

我们收到报告，您的宠物机器狗"小光"在地球上一直在等您回来！

自从您去【${celestialBody.name}】后，小光已经等了${formatTime(waitTime)}，它每天都会打开【${gameName}】等您一起玩。

宠物状态：
🐕 情绪：非常想念主人
🎮 行为：每天守着游戏机
💔 健康：因思念而食欲不振

请尽快回来，您的小光需要您！

星际宠物救助中心
宠物心理关怀部
${new Date().toLocaleDateString()}`,

        `【银河系环保组织】

环保志愿者${playerName}，

我们赞赏您在【${celestialBody.name}】进行环保考察的行为！

但您已经在那里研究${formatTime(waitTime)}了，地球上的环保【${gameName}】活动一直在等您参加！

环保提醒：
🌱 保护当地生态环境
♻️ 不要留下任何垃圾
🌍 地球环保也需要您的参与

让我们一起通过游戏宣传环保理念吧！

银河系环保组织
星际环保部
${new Date().toLocaleDateString()}`,

        `【宇宙音乐学院】

音乐家${playerName}，

我们听说您在【${celestialBody.name}】创作"宇宙交响曲"已经${formatTime(waitTime)}了！

虽然宇宙的声音很美妙，但您的音乐伙伴们在地球上的【${gameName}】音乐游戏中等您合奏呢！

音乐建议：
🎵 记录宇宙的天然音律
🎼 创作独特的太空音乐
🎮 回来和朋友们分享您的作品

期待您的宇宙音乐首演！

宇宙音乐学院
太空音乐系
${new Date().toLocaleDateString()}`,

        `【星际科技创新实验室】

发明家${playerName}，

我们的创新雷达显示，您在【${celestialBody.name}】进行科技研发已经${formatTime(waitTime)}了！

虽然我们支持您的创新精神，但您的研发团队在地球上的【${gameName}】科技竞赛中需要您的参与！

创新提醒：
🔬 记录所有实验数据
💡 保护好您的发明专利
🎮 团队合作能激发更多灵感

快回来和团队一起创新吧！

星际科技创新实验室
前沿研发部
${new Date().toLocaleDateString()}`,

        `【银河系艺术创作联盟】

艺术家${playerName}，

我们被您在【${celestialBody.name}】创作的"宇宙艺术"深深震撼！

您已经在那里创作${formatTime(waitTime)}了，这种对艺术的执着让我们敬佩。但您的艺术伙伴们在地球上的【${gameName}】创意游戏中等您一起创作！

艺术建议：
🎨 捕捉宇宙的独特美感
✨ 创作前所未有的艺术作品
🎮 和朋友们分享创作的快乐

期待您带着宇宙灵感回来！

银河系艺术创作联盟
宇宙艺术部
${new Date().toLocaleDateString()}`,

        `【星际社交媒体管理中心】

网红${playerName}，

您在【${celestialBody.name}】的"太空直播"已经进行${formatTime(waitTime)}了！

虽然您的粉丝们很喜欢这种前卫的直播内容，但他们更想看您和朋友们一起玩【${gameName}】的直播！

社交提醒：
📱 保持与粉丝的互动
🌟 创造更多有趣的内容
🎮 游戏直播也很受欢迎

快回来继续您的精彩直播吧！

星际社交媒体管理中心
网红服务部
${new Date().toLocaleDateString()}`
    ];
    
    // 随机选择一个模板
    return templates[Math.floor(Math.random() * templates.length)];
}

// 生成指定模板的信件
function generateSpecificLetter(playerName, gameName, result, templateIndex) {
    // 为了保持一致性和避免重复代码，直接调用generateLetter函数
    // 这样确保所有模板都是最新的，包括新增的天体类型文案
    return generateLetter(playerName, gameName, result);
}

// 创建明信片页面HTML
function createPostcardPageHTML(result, letterContent) {
    const celestialBody = result.celestialBody;
    const baseURL = window.location.origin + window.location.pathname;
    
    return `
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Microsoft YaHei', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .postcard-container {
            width: 100%;
            max-width: 800px;
            background: linear-gradient(135deg, #000033 0%, #000066 50%, #000000 100%);
            color: white;
            position: relative;
            overflow: hidden;
            min-height: 900px;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        
        .stars-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: 
                radial-gradient(2px 2px at 20px 30px, white, transparent),
                radial-gradient(2px 2px at 40px 70px, white, transparent),
                radial-gradient(1px 1px at 90px 40px, white, transparent),
                radial-gradient(1px 1px at 130px 80px, white, transparent),
                radial-gradient(2px 2px at 160px 30px, white, transparent),
                radial-gradient(1px 1px at 200px 90px, white, transparent),
                radial-gradient(2px 2px at 240px 50px, white, transparent),
                radial-gradient(1px 1px at 280px 10px, white, transparent),
                radial-gradient(1px 1px at 320px 70px, white, transparent),
                radial-gradient(2px 2px at 360px 40px, white, transparent);
            background-repeat: repeat;
            background-size: 400px 200px;
            opacity: 0.8;
        }
        
        .header {
            background: rgba(0, 0, 0, 0.8);
            padding: 30px;
            text-align: center;
            border-bottom: 3px solid #FFD700;
            position: relative;
            z-index: 2;
        }
        
        .header h1 {
            color: #FFD700;
            font-size: 2.5em;
            margin: 0 0 10px 0;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }
        
        .header p {
            color: white;
            font-size: 1.1em;
            margin: 0;
            opacity: 0.9;
        }
        
        .celestial-section {
            background: rgba(0, 0, 0, 0.6);
            margin: 20px;
            padding: 30px;
            border-radius: 15px;
            border: 2px solid #87CEEB;
            position: relative;
            z-index: 2;
            display: flex;
            align-items: center;
            gap: 30px;
            flex-wrap: wrap;
        }
        
        .celestial-info {
            flex: 1;
            min-width: 300px;
        }
        
        .celestial-info h2 {
            color: #FFD700;
            font-size: 1.8em;
            margin: 0 0 15px 0;
        }
        
        .celestial-info p {
            color: white;
            font-size: 1.1em;
            margin: 10px 0;
            line-height: 1.6;
        }
        
        .celestial-stats {
            background: rgba(255, 255, 255, 0.1);
            padding: 15px;
            border-radius: 10px;
            margin-top: 15px;
        }
        
        .celestial-stats p {
            margin: 5px 0;
            color: #87CEEB;
        }
        
        .celestial-visual {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
        }
        
        .celestial-body {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background: ${celestialBody.color};
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3em;
            box-shadow: 0 0 30px ${celestialBody.color}50;
            animation: pulse 2s infinite;
        }
        
        .spaceship {
            font-size: 2em;
            color: #C0C0C0;
        }
        
        .letter-section {
            background: rgba(255, 255, 255, 0.95);
            margin: 20px;
            padding: 30px;
            border-radius: 15px;
            border: 2px solid #667eea;
            position: relative;
            z-index: 2;
            color: #333;
        }
        
        .letter-section h3 {
            color: #667eea;
            font-size: 1.5em;
            margin: 0 0 20px 0;
            text-align: center;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
        }
        
        .letter-content {
            font-size: 1.1em;
            line-height: 1.8;
            white-space: pre-line;
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            border-left: 4px solid #667eea;
        }
        
        .action-section {
            background: rgba(0, 0, 0, 0.9);
            padding: 30px;
            text-align: center;
            position: relative;
            z-index: 2;
        }
        
        .generate-btn {
            background: linear-gradient(45deg, #28a745, #20c997);
            color: white;
            border: none;
            padding: 15px 30px;
            font-size: 1.2em;
            font-weight: bold;
            border-radius: 10px;
            cursor: pointer;
            box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3);
            transition: all 0.3s;
            border: 2px solid white;
            text-decoration: none;
            display: inline-block;
        }
        
        .generate-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(40, 167, 69, 0.4);
        }
        
        .action-section p {
            color: #C0C0C0;
            font-size: 0.9em;
            margin-top: 15px;
            opacity: 0.8;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        @media (max-width: 600px) {
            .celestial-section {
                flex-direction: column;
                text-align: center;
            }
            
            .celestial-info {
                min-width: auto;
            }
            
            .header h1 {
                font-size: 2em;
            }
        }
    </style>
    
    <div class="postcard-container">
        <div class="stars-bg"></div>
        
        <div class="header">
            <h1>🕊️ 鸽子提醒明信片</h1>
            <p>基于光速计算的天体距离匹配系统</p>
        </div>
        
        <div class="celestial-section">
            <div class="celestial-info">
                <h2>🌟 目标天体: ${celestialBody.name}</h2>
                <p>${celestialBody.description}</p>
                <div class="celestial-stats">
                    <p><strong>距离地球:</strong> ${result.actualDistance}</p>
                    <p><strong>等待时间:</strong> ${formatTime(result.waitTime)}</p>
                    <p><strong>网络延迟:</strong> ${formatTime(result.waitTime)}</p>
                </div>
            </div>
            <div class="celestial-visual">
                <div class="celestial-body">${getCelestialEmoji(celestialBody.type)}</div>
                <div class="spaceship">🚀</div>
            </div>
        </div>
        
        <div class="letter-section">
            <h3>📧 官方提醒信件</h3>
            <div class="letter-content">${letterContent}</div>
        </div>
        
        <div class="action-section">
            <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; margin-bottom: 15px;">
                <a href="${baseURL}" class="generate-btn">
                    🚀 生成我的明信片
                </a>
                <button onclick="shareCurrentPostcard()" class="generate-btn" style="background: linear-gradient(45deg, #17a2b8, #20c997);">
                    📤 分享这张明信片
                </button>
            </div>
            <p>点击按钮开始制作您专属的天体提醒明信片，或分享这张明信片给朋友</p>
        </div>
    </div>
    `;
}

// 主要计算和生成函数 - 直接生成明信片
function calculateAndGenerate() {
    const playerName = document.getElementById('playerName').value.trim();
    const gameName = document.getElementById('gameName').value.trim();
    const hours = parseInt(document.getElementById('hours').value) || 0;
    const minutes = parseInt(document.getElementById('minutes').value) || 0;
    const seconds = parseInt(document.getElementById('seconds').value) || 0;
    
    // 验证输入
    if (!playerName) {
        alert('请输入朋友的名字！');
        return;
    }
    
    if (!gameName) {
        alert('请输入游戏名称！');
        return;
    }
    
    if (hours === 0 && minutes === 0 && seconds === 0) {
        alert('请输入等待时间！');
        return;
    }
    
    // 计算结果
    const result = calculateDistance(hours, minutes, seconds);
    
    if (!result) {
        alert('计算出错，请检查输入！');
        return;
    }
    
    // 保存当前结果到全局变量
    currentResult = {
        ...result,
        playerName,
        gameName
    };
    
    // 直接生成明信片URL并跳转
    generateAndShowPostcard();
}

// 直接生成并显示明信片
function generateAndShowPostcard() {
    if (!currentResult) {
        alert('计算结果不存在！');
        return;
    }
    
    try {
        // 随机选择一个模板
        const templateIndex = Math.floor(Math.random() * 32);
        
        // 找到天体在数组中的索引
        const celestialIndex = CELESTIAL_BODIES.findIndex(body => 
            body.name === currentResult.celestialBody.name && 
            body.distance === currentResult.celestialBody.distance
        );
        
        // 构建明信片URL
        const baseURL = window.location.origin + window.location.pathname;
        const postcardURL = `${baseURL}?postcard=1&name=${encodeURIComponent(currentResult.playerName)}&game=${encodeURIComponent(currentResult.gameName)}&time=${currentResult.waitTime}&celestial=${celestialIndex}&template=${templateIndex}`;
        
        // 直接跳转到明信片页面
        window.location.href = postcardURL;
        
    } catch (err) {
        console.error('生成明信片失败:', err);
        alert('生成明信片失败，请重试。');
    }
}

// 在明信片页面中添加分享功能
function shareCurrentPostcard() {
    try {
        const shareData = {
            title: document.title,
            text: '快来看看这张有趣的天体提醒明信片！',
            url: window.location.href
        };
        
        if (navigator.share) {
            navigator.share(shareData);
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('明信片链接已复制到剪贴板！');
        }
    } catch (err) {
        prompt('请复制下面的链接进行分享：', window.location.href);
    }
}

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
    // 为输入框添加回车键监听
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateAndGenerate();
            }
        });
    });
    
    // 添加一些示例提示
    document.getElementById('playerName').placeholder = '例如：小明、张三、游戏大神';
    document.getElementById('gameName').placeholder = '例如：王者荣耀、英雄联盟、原神';
});

// ==================== 明信片生成功能 ====================

// 绘制天体
function drawCelestialBody(ctx, body, x, y, size) {
    const { name, color, type } = body;
    
    ctx.save();
    
    switch (type) {
        case 'moon':
            // 绘制月球
            drawMoon(ctx, x, y, size, color);
            break;
        case 'star':
            // 绘制恒星
            drawStar(ctx, x, y, size, color);
            break;
        case 'planet':
            // 绘制行星
            drawPlanet(ctx, x, y, size, color, name);
            break;
        case 'galaxy':
            // 绘制星系
            drawGalaxy(ctx, x, y, size, color);
            break;
        case 'universe':
            // 绘制宇宙边缘
            drawUniverse(ctx, x, y, size, color);
            break;
    }
    
    ctx.restore();
}

// 绘制月球
function drawMoon(ctx, x, y, size, color) {
    // 主体
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    
    // 阴影和陨石坑
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.arc(x - size * 0.3, y - size * 0.2, size * 0.15, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(x + size * 0.2, y + size * 0.3, size * 0.1, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(x - size * 0.1, y + size * 0.4, size * 0.08, 0, Math.PI * 2);
    ctx.fill();
}

// 绘制恒星
function drawStar(ctx, x, y, size, color) {
    // 主体光芒
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 1.5);
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.7, `${color}80`);
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, size * 1.5, 0, Math.PI * 2);
    ctx.fill();
    
    // 核心
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, size * 0.8, 0, Math.PI * 2);
    ctx.fill();
    
    // 光芒线条
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI * 2) / 8;
        const startX = x + Math.cos(angle) * size;
        const startY = y + Math.sin(angle) * size;
        const endX = x + Math.cos(angle) * size * 1.8;
        const endY = y + Math.sin(angle) * size * 1.8;
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
    }
}

// 绘制行星
function drawPlanet(ctx, x, y, size, color, name) {
    // 主体
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    
    // 根据行星名称添加特殊效果
    if (name === '土星') {
        // 绘制土星环
        ctx.strokeStyle = '#DAA520';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.ellipse(x, y, size * 1.5, size * 0.3, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.ellipse(x, y, size * 1.8, size * 0.4, 0, 0, Math.PI * 2);
        ctx.stroke();
    } else if (name === '木星') {
        // 绘制木星条纹
        ctx.strokeStyle = 'rgba(139, 69, 19, 0.6)';
        ctx.lineWidth = 6;
        for (let i = -2; i <= 2; i++) {
            ctx.beginPath();
            ctx.ellipse(x, y + i * size * 0.3, size * 0.9, size * 0.1, 0, 0, Math.PI * 2);
            ctx.stroke();
        }
    } else if (name === '火星') {
        // 绘制火星极地冰帽
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(x, y - size * 0.7, size * 0.2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(x, y + size * 0.7, size * 0.15, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // 添加光照效果
    const lightGradient = ctx.createRadialGradient(x - size * 0.3, y - size * 0.3, 0, x, y, size);
    lightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    lightGradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = lightGradient;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
}

// 绘制星系
function drawGalaxy(ctx, x, y, size, color) {
    // 螺旋星系
    ctx.save();
    ctx.translate(x, y);
    
    // 中心核心
    const coreGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 0.3);
    coreGradient.addColorStop(0, '#FFFF00');
    coreGradient.addColorStop(1, color);
    
    ctx.fillStyle = coreGradient;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2);
    ctx.fill();
    
    // 螺旋臂
    ctx.strokeStyle = color;
    ctx.lineWidth = 8;
    for (let arm = 0; arm < 2; arm++) {
        ctx.beginPath();
        for (let angle = 0; angle < Math.PI * 4; angle += 0.1) {
            const radius = (angle / (Math.PI * 4)) * size;
            const x_pos = Math.cos(angle + arm * Math.PI) * radius;
            const y_pos = Math.sin(angle + arm * Math.PI) * radius * 0.6;
            
            if (angle === 0) {
                ctx.moveTo(x_pos, y_pos);
            } else {
                ctx.lineTo(x_pos, y_pos);
            }
        }
        ctx.stroke();
    }
    
    ctx.restore();
}

// 绘制宇宙边缘
function drawUniverse(ctx, x, y, size, color) {
    // 创建宇宙背景
    const universeGradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2);
    universeGradient.addColorStop(0, color);
    universeGradient.addColorStop(0.5, '#000033');
    universeGradient.addColorStop(1, '#000000');
    
    ctx.fillStyle = universeGradient;
    ctx.beginPath();
    ctx.arc(x, y, size * 1.5, 0, Math.PI * 2);
    ctx.fill();
    
    // 添加星点
    ctx.fillStyle = 'white';
    for (let i = 0; i < 50; i++) {
        const starX = x + (Math.random() - 0.5) * size * 2.5;
        const starY = y + (Math.random() - 0.5) * size * 2.5;
        const starSize = Math.random() * 2 + 1;
        
        ctx.beginPath();
        ctx.arc(starX, starY, starSize, 0, Math.PI * 2);
        ctx.fill();
    }
}

// 绘制飞船
function drawSpaceship(ctx, x, y, size) {
    ctx.save();
    ctx.translate(x, y);
    
    // 飞船主体
    ctx.fillStyle = '#C0C0C0';
    ctx.beginPath();
    ctx.ellipse(0, 0, size, size * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // 驾驶舱
    ctx.fillStyle = '#4169E1';
    ctx.beginPath();
    ctx.ellipse(size * 0.3, 0, size * 0.3, size * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // 引擎喷射
    ctx.fillStyle = '#FF4500';
    ctx.beginPath();
    ctx.ellipse(-size * 1.2, 0, size * 0.4, size * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.ellipse(-size * 1.4, 0, size * 0.2, size * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // 机翼
    ctx.fillStyle = '#808080';
    ctx.beginPath();
    ctx.moveTo(-size * 0.5, -size * 0.6);
    ctx.lineTo(size * 0.2, -size * 0.2);
    ctx.lineTo(size * 0.2, size * 0.2);
    ctx.lineTo(-size * 0.5, size * 0.6);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
}

// 生成HTML明信片
function generatePostcard() {
    if (!currentResult) {
        alert('请先计算天体位置！');
        return;
    }
    
    const celestialBody = currentResult.celestialBody;
    // 使用当前显示的信件内容，而不是重新生成
    const letterContent = document.getElementById('letterContent').textContent;
    
    // 创建明信片HTML内容
    const postcardHTML = `
        <div style="
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            background: linear-gradient(135deg, #000033 0%, #000066 50%, #000000 100%);
            color: white;
            font-family: 'Microsoft YaHei', sans-serif;
            position: relative;
            overflow: hidden;
            min-height: 900px;
        ">
            <!-- 星空背景 -->
            <div style="
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-image: 
                    radial-gradient(2px 2px at 20px 30px, white, transparent),
                    radial-gradient(2px 2px at 40px 70px, white, transparent),
                    radial-gradient(1px 1px at 90px 40px, white, transparent),
                    radial-gradient(1px 1px at 130px 80px, white, transparent),
                    radial-gradient(2px 2px at 160px 30px, white, transparent),
                    radial-gradient(1px 1px at 200px 90px, white, transparent),
                    radial-gradient(2px 2px at 240px 50px, white, transparent),
                    radial-gradient(1px 1px at 280px 10px, white, transparent),
                    radial-gradient(1px 1px at 320px 70px, white, transparent),
                    radial-gradient(2px 2px at 360px 40px, white, transparent);
                background-repeat: repeat;
                background-size: 400px 200px;
                opacity: 0.8;
            "></div>
            
            <!-- 标题区域 -->
            <div style="
                background: rgba(0, 0, 0, 0.8);
                padding: 30px;
                text-align: center;
                border-bottom: 3px solid #FFD700;
                position: relative;
                z-index: 2;
            ">
                <h1 style="
                    color: #FFD700;
                    font-size: 2.5em;
                    margin: 0 0 10px 0;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
                ">🕊️ 鸽子提醒明信片</h1>
                <p style="
                    color: white;
                    font-size: 1.1em;
                    margin: 0;
                    opacity: 0.9;
                ">基于光速计算的天体距离匹配系统</p>
            </div>
            
            <!-- 天体展示区域 -->
            <div style="
                background: rgba(0, 0, 0, 0.6);
                margin: 20px;
                padding: 30px;
                border-radius: 15px;
                border: 2px solid #87CEEB;
                position: relative;
                z-index: 2;
                display: flex;
                align-items: center;
                gap: 30px;
                flex-wrap: wrap;
            ">
                <div style="flex: 1; min-width: 300px;">
                    <h2 style="
                        color: #FFD700;
                        font-size: 1.8em;
                        margin: 0 0 15px 0;
                    ">🌟 目标天体: ${celestialBody.name}</h2>
                    <p style="
                        color: white;
                        font-size: 1.1em;
                        margin: 10px 0;
                        line-height: 1.6;
                    ">${celestialBody.description}</p>
                    <div style="
                        background: rgba(255, 255, 255, 0.1);
                        padding: 15px;
                        border-radius: 10px;
                        margin-top: 15px;
                    ">
                        <p style="margin: 5px 0; color: #87CEEB;"><strong>距离地球:</strong> ${currentResult.actualDistance}</p>
                        <p style="margin: 5px 0; color: #87CEEB;"><strong>等待时间:</strong> ${formatTime(currentResult.waitTime)}</p>
                        <p style="margin: 5px 0; color: #87CEEB;"><strong>网络延迟:</strong> ${formatTime(currentResult.waitTime)}</p>
                    </div>
                </div>
                <div style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 20px;
                ">
                    <div style="
                        width: 120px;
                        height: 120px;
                        border-radius: 50%;
                        background: ${celestialBody.color};
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 3em;
                        box-shadow: 0 0 30px ${celestialBody.color}50;
                        animation: pulse 2s infinite;
                    ">${getCelestialEmoji(celestialBody.type)}</div>
                    <div style="
                        font-size: 2em;
                        color: #C0C0C0;
                    ">🚀</div>
                </div>
            </div>
            
            <!-- 信件内容区域 -->
            <div style="
                background: rgba(255, 255, 255, 0.95);
                margin: 20px;
                padding: 30px;
                border-radius: 15px;
                border: 2px solid #667eea;
                position: relative;
                z-index: 2;
                color: #333;
            ">
                <h3 style="
                    color: #667eea;
                    font-size: 1.5em;
                    margin: 0 0 20px 0;
                    text-align: center;
                    border-bottom: 2px solid #667eea;
                    padding-bottom: 10px;
                ">📧 官方提醒信件</h3>
                <div style="
                    font-size: 1.1em;
                    line-height: 1.8;
                    white-space: pre-line;
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 10px;
                    border-left: 4px solid #667eea;
                ">${letterContent}</div>
            </div>
            
            <!-- 交互按钮区域 -->
            <div style="
                background: rgba(0, 0, 0, 0.9);
                padding: 30px;
                text-align: center;
                position: relative;
                z-index: 2;
            ">
                <button onclick="window.parent.resetApp ? window.parent.resetApp() : (window.opener && window.opener.resetApp ? window.opener.resetApp() : alert('请在原页面中使用此功能'))" style="
                    background: linear-gradient(45deg, #28a745, #20c997);
                    color: white;
                    border: none;
                    padding: 15px 30px;
                    font-size: 1.2em;
                    font-weight: bold;
                    border-radius: 10px;
                    cursor: pointer;
                    box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3);
                    transition: all 0.3s;
                    border: 2px solid white;
                " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 20px rgba(40, 167, 69, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 5px 15px rgba(40, 167, 69, 0.3)'">
                    🚀 生成我的明信片
                </button>
                <p style="
                    color: #C0C0C0;
                    font-size: 0.9em;
                    margin-top: 15px;
                    opacity: 0.8;
                ">点击按钮开始制作您专属的天体提醒明信片</p>
            </div>
            
            <style>
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
            </style>
        </div>
    `;
    
    // 将HTML内容插入到容器中
    document.getElementById('postcardContainer').innerHTML = postcardHTML;
    
    // 显示明信片区域
    document.getElementById('postcardSection').style.display = 'block';
    
    // 滚动到明信片区域
    document.getElementById('postcardSection').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// 根据天体类型获取对应的emoji
function getCelestialEmoji(type) {
    const emojiMap = {
        'satellite': '🛰️',
        'moon': '🌙',
        'point': '⚡',
        'planet': '🪐',
        'asteroid': '☄️',
        'comet': '☄️',
        'cloud': '☁️',
        'star': '⭐',
        'cluster': '✨',
        'nebula': '🌌',
        'structure': '🌀',
        'galaxy': '🌌',
        'supercluster': '🌌',
        'blackhole': '🕳️',
        'universe': '🌌'
    };
    return emojiMap[type] || '⭐';
}

// 优化的天体匹配算法 - 使用二分查找
function findClosestCelestialBody(lightSeconds) {
    // 先按距离排序（如果还没排序的话）
    const sortedBodies = [...CELESTIAL_BODIES].sort((a, b) => a.distance - b.distance);
    
    let left = 0;
    let right = sortedBodies.length - 1;
    let closest = sortedBodies[0];
    let minDifference = Math.abs(sortedBodies[0].distance - lightSeconds);
    
    // 二分查找最接近的天体
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const difference = Math.abs(sortedBodies[mid].distance - lightSeconds);
        
        if (difference < minDifference) {
            minDifference = difference;
            closest = sortedBodies[mid];
        }
        
        if (sortedBodies[mid].distance < lightSeconds) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
        
        // 检查相邻的天体
        if (mid > 0) {
            const leftDiff = Math.abs(sortedBodies[mid - 1].distance - lightSeconds);
            if (leftDiff < minDifference) {
                minDifference = leftDiff;
                closest = sortedBodies[mid - 1];
            }
        }
        
        if (mid < sortedBodies.length - 1) {
            const rightDiff = Math.abs(sortedBodies[mid + 1].distance - lightSeconds);
            if (rightDiff < minDifference) {
                minDifference = rightDiff;
                closest = sortedBodies[mid + 1];
            }
        }
    }
    
    return closest;
}

// 下载明信片HTML页面
function downloadPostcardHTML() {
    if (!currentResult) {
        alert('请先生成明信片！');
        return;
    }
    
    const postcardContent = document.getElementById('postcardContainer').innerHTML;
    
    // 创建完整的HTML页面
    const fullHTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>鸽子提醒明信片 - ${currentResult.playerName}</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            max-width: 800px;
            width: 100%;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            border-radius: 20px;
            overflow: hidden;
        }
    </style>
</head>
<body>
    <div class="container">
        ${postcardContent}
    </div>
    
    <script>
        // 重置功能 - 跳转到原始页面
        function resetApp() {
            if (confirm('要生成您的专属明信片吗？')) {
                // 尝试打开原始页面
                window.open('${window.location.origin}${window.location.pathname}', '_blank');
            }
        }
    </script>
</body>
</html>`;
    
    // 创建下载链接
    const blob = new Blob([fullHTML], { type: 'text/html;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `鸽子提醒明信片_${currentResult.playerName}_${new Date().getTime()}.html`;
    link.click();
    
    // 清理URL对象
    URL.revokeObjectURL(link.href);
}

// 分享明信片链接 - 生成真正的明信片URL
async function sharePostcardURL() {
    if (!currentResult) {
        alert('请先生成明信片！');
        return;
    }
    
    try {
        // 获取当前使用的模板索引
        const currentLetter = document.getElementById('letterContent').textContent;
        let templateIndex = 0;
        
        // 尝试匹配当前信件内容来确定模板索引
        for (let i = 0; i < 32; i++) {
            const testLetter = generateSpecificLetter(currentResult.playerName, currentResult.gameName, currentResult, i);
            if (testLetter === currentLetter) {
                templateIndex = i;
                break;
            }
        }
        
        // 找到天体在数组中的索引
        const celestialIndex = CELESTIAL_BODIES.findIndex(body => 
            body.name === currentResult.celestialBody.name && 
            body.distance === currentResult.celestialBody.distance
        );
        
        // 构建明信片URL
        const baseURL = window.location.origin + window.location.pathname;
        const postcardURL = `${baseURL}?postcard=1&name=${encodeURIComponent(currentResult.playerName)}&game=${encodeURIComponent(currentResult.gameName)}&time=${currentResult.waitTime}&celestial=${celestialIndex}&template=${templateIndex}`;
        
        // 打开明信片页面
        window.open(postcardURL, '_blank');
        
        // 尝试分享链接
        setTimeout(async () => {
            try {
                const shareData = {
                    title: `${currentResult.playerName}的天体提醒明信片`,
                    text: `${currentResult.playerName}已经到达${currentResult.celestialBody.name}了！快来看看这张有趣的明信片吧！`,
                    url: postcardURL
                };
                
                if (navigator.share) {
                    await navigator.share(shareData);
                } else {
                    await navigator.clipboard.writeText(postcardURL);
                    alert('明信片链接已复制到剪贴板！\n\n您可以将这个链接分享给朋友，他们打开后就能看到完整的明信片，并可以生成自己的明信片。');
                }
            } catch (err) {
                console.error('分享失败:', err);
                prompt('请复制下面的明信片链接进行分享：', postcardURL);
            }
        }, 500);
        
    } catch (err) {
        console.error('生成明信片链接失败:', err);
        alert('生成明信片链接失败，请重试。');
    }
}

// 创建独立的明信片页面HTML - 已删除，使用URL参数方式

// 重新生成功能 - 返回初始状态
function resetApp() {
    // 清空输入框
    document.getElementById('playerName').value = '';
    document.getElementById('gameName').value = '';
    document.getElementById('hours').value = '0';
    document.getElementById('minutes').value = '0';
    document.getElementById('seconds').value = '0';
    
    // 隐藏结果区域
    document.getElementById('resultSection').style.display = 'none';
    document.getElementById('postcardSection').style.display = 'none';
    
    // 清空全局变量
    currentResult = null;
    
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // 聚焦到第一个输入框
    document.getElementById('playerName').focus();
}

// 分享原始生成器链接
async function shareOriginalLink() {
    try {
        const shareData = {
            title: '鸽子提醒器 - 天体距离计算器',
            text: '用天体距离来幽默提醒迟到的朋友们！快来生成你的专属明信片吧！',
            url: window.location.href
        };
        
        if (navigator.share) {
            // 使用原生分享API
            await navigator.share(shareData);
        } else {
            // 降级方案：复制链接
            await navigator.clipboard.writeText(window.location.href);
            alert('生成器链接已复制到剪贴板！\n\n您可以将链接分享给朋友，他们可以生成自己的明信片。');
        }
    } catch (err) {
        console.error('分享失败:', err);
        // 最终降级方案
        prompt('请复制下面的链接分享给朋友：', window.location.href);
    }
}

