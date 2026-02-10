// 光速常量 (米/秒)
const SPEED_OF_LIGHT = 299792458;

// 天体数据库 - 包含各种天体及其距离（以光秒为单位）
const CELESTIAL_BODIES = [
    { name: "月球", distance: 1.28, unit: "光秒", description: "地球的天然卫星", color: "#C0C0C0", type: "moon" },
    { name: "太阳", distance: 499, unit: "光秒", description: "太阳系的中心恒星", color: "#FFD700", type: "star" },
    { name: "火星", distance: 756, unit: "光秒", description: "红色星球", color: "#CD5C5C", type: "planet" },
    { name: "木星", distance: 2040, unit: "光秒", description: "太阳系最大的行星", color: "#DAA520", type: "planet" },
    { name: "土星", distance: 4680, unit: "光秒", description: "拥有美丽光环的行星", color: "#F4A460", type: "planet" },
    { name: "天王星", distance: 9720, unit: "光秒", description: "侧躺着自转的冰巨星", color: "#4FD0E7", type: "planet" },
    { name: "海王星", distance: 14400, unit: "光秒", description: "太阳系最外层的巨行星", color: "#4169E1", type: "planet" },
    { name: "冥王星", distance: 18000, unit: "光秒", description: "前太阳系第九大行星", color: "#8B7355", type: "planet" },
    { name: "比邻星", distance: 134000000, unit: "光秒", description: "距离太阳系最近的恒星", color: "#FF6347", type: "star" },
    { name: "半人马座α星", distance: 137000000, unit: "光秒", description: "南天最亮的恒星之一", color: "#FFD700", type: "star" },
    { name: "天狼星", distance: 272000000, unit: "光秒", description: "夜空中最亮的恒星", color: "#87CEEB", type: "star" },
    { name: "织女星", distance: 817000000, unit: "光秒", description: "北半球夏季夜空的明亮恒星", color: "#E6E6FA", type: "star" },
    { name: "北极星", distance: 1390000000, unit: "光秒", description: "指示北方的导航星", color: "#F0F8FF", type: "star" },
    { name: "参宿四", distance: 21000000000, unit: "光秒", description: "猎户座的红超巨星", color: "#FF4500", type: "star" },
    { name: "银河系中心", distance: 850000000000, unit: "光秒", description: "我们星系的中心", color: "#800080", type: "galaxy" },
    { name: "仙女座星系", distance: 79000000000000, unit: "光秒", description: "距离银河系最近的大星系", color: "#9370DB", type: "galaxy" },
    { name: "室女座星系团", distance: 1700000000000000, unit: "光秒", description: "包含银河系的本星系群", color: "#4B0082", type: "galaxy" },
    { name: "可观测宇宙边缘", distance: 435000000000000000, unit: "光秒", description: "人类能观测到的宇宙极限", color: "#191970", type: "universe" }
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
    
    // 找到最接近的天体
    let closestBody = CELESTIAL_BODIES[0];
    let minDifference = Math.abs(CELESTIAL_BODIES[0].distance - lightSeconds);
    
    for (let body of CELESTIAL_BODIES) {
        const difference = Math.abs(body.distance - lightSeconds);
        if (difference < minDifference) {
            minDifference = difference;
            closestBody = body;
        }
    }
    
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
${new Date().toLocaleDateString()}`
    ];
    
    // 随机选择一个模板
    return templates[Math.floor(Math.random() * templates.length)];
}

// 主要计算和生成函数
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
    
    // 显示天体信息
    const celestialInfo = document.getElementById('celestialInfo');
    celestialInfo.innerHTML = `
        <h3>🌟 ${result.celestialBody.name}</h3>
        <p>${result.celestialBody.description}</p>
        <p><strong>距离地球：</strong>${result.actualDistance}</p>
        <p><strong>等待时间：</strong>${formatTime(result.waitTime)}</p>
    `;
    
    // 生成并显示信件
    const letter = generateLetter(playerName, gameName, result);
    document.getElementById('letterContent').textContent = letter;
    
    // 显示结果区域
    document.getElementById('resultSection').style.display = 'block';
    
    // 滚动到结果区域
    document.getElementById('resultSection').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// 复制信件到剪贴板
async function copyLetter() {
    const letterContent = document.getElementById('letterContent').textContent;
    
    try {
        await navigator.clipboard.writeText(letterContent);
        
        // 临时改变按钮文本以显示成功
        const copyBtn = document.querySelector('.copy-btn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅ 已复制！';
        copyBtn.style.background = '#28a745';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '#28a745';
        }, 2000);
        
    } catch (err) {
        // 降级方案：选择文本
        const letterElement = document.getElementById('letterContent');
        const range = document.createRange();
        range.selectNode(letterElement);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        
        alert('请手动复制选中的文本');
    }
}

// 分享功能
function shareLetter() {
    const letterContent = document.getElementById('letterContent').textContent;
    const playerName = document.getElementById('playerName').value;
    const title = `给${playerName}的天体提醒信`;
    
    if (navigator.share) {
        // 使用原生分享API
        navigator.share({
            title: title,
            text: letterContent
        }).catch(err => {
            console.log('分享取消或失败:', err);
        });
    } else {
        // 降级方案：复制到剪贴板
        copyLetter();
        alert('内容已复制到剪贴板，您可以粘贴到任何地方分享！');
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
    const letterContent = generateLetter(currentResult.playerName, currentResult.gameName, currentResult);
    
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
        'moon': '🌙',
        'star': '⭐',
        'planet': '🪐',
        'galaxy': '🌌',
        'universe': '🌌'
    };
    return emojiMap[type] || '⭐';
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

// 分享明信片链接
async function sharePostcardURL() {
    if (!currentResult) {
        alert('请先生成明信片！');
        return;
    }
    
    try {
        // 创建分享数据
        const shareData = {
            title: `${currentResult.playerName}的天体提醒明信片`,
            text: `${currentResult.playerName}已经到达${currentResult.celestialBody.name}了！快来看看这张有趣的明信片，并生成你自己的吧！`,
            url: window.location.href
        };
        
        if (navigator.share) {
            // 使用原生分享API
            await navigator.share(shareData);
        } else {
            // 降级方案：复制链接
            await navigator.clipboard.writeText(window.location.href);
            alert('链接已复制到剪贴板！\n\n您可以将链接分享给朋友，他们点击明信片上的按钮就能生成自己的明信片了。');
        }
    } catch (err) {
        console.error('分享失败:', err);
        // 最终降级方案
        const url = window.location.href;
        prompt('请复制下面的链接进行分享：', url);
    }
}

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

// 为明信片添加点击事件监听
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