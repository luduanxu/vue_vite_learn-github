function msg(msg, duration = 1600, type = 'success') {
    if (!msg || msg.length < 1) {
        return
    }
    let msgDiv = document.createElement('div')
    let str = msg
    if (msg.length > 5000) {
        str = msg.substring(0, 5000) + '...'
    }
    msgDiv.className = 'msg ' + type
    msgDiv.innerHTML = str

    document.body.appendChild(msgDiv)
    setTimeout(() => {
        document.body.removeChild(msgDiv)
    }, duration)
}

// 提示消息
function dialog(msg, action, id, type) {
    let out = document.createElement('div')
    out.className = 'bg-div-gray'

    let msgDiv = document.createElement('div')
    msgDiv.className = 'dialog ' + type
    out.id = id

    msgDiv.innerHTML = `
     <div class="dialog-content">
        ${msg}
        <div class="dialog-buttons">
          <button>取消</button>
          <button>确定</button>
        </div>
      </div>
`
    const buttons = msgDiv.querySelectorAll('.dialog-buttons button');
    buttons[0].addEventListener('click', () => deleteDialog(id));
    buttons[1].addEventListener('click', () => {
        action();
        deleteDialog(id);
    });

    out.appendChild(msgDiv)
    document.body.appendChild(out)
}

function deleteDialog(id) {
    console.log('deleteDialog', id)
    let dialog = document.getElementById(id)
    if (dialog) {
        document.body.removeChild(dialog)
    }
}

function msgError(msgInfo, duration = 1600) {
    msg(msgInfo, duration, 'error')
}

function msgSuccess(msgInfo, duration = 1600) {
    msg(msgInfo, duration, 'success')
}

function msgWarning(msgInfo, duration = 1600) {
    msg(msgInfo, duration, 'warning')
}

function strToJson(str) {
    try {
        return JSON.parse(str)
    } catch (e) {
        console.log('字符串不是json 格式')
        return {}
    }
}

function jsonToStr(json) {
    return JSON.stringify(json)
}

function jsonToStrFormat(json) {
    return JSON.stringify(json, null, 2)
}

function strFormat(str) {
    let obj = strToJson(str)
    if (jsonToStrFormat(obj) === '{}' && str !== '{}') {
        return str
    }
    return jsonToStrFormat(obj)
}

function copyTextIn(content) {
    if (window.clipboardData) {
        window.clipboardData.setData('text', content);
    } else {
        (function (content) {
            document.oncopy = function (e) {
                e.clipboardData.setData('text', content);
                e.preventDefault();
                document.oncopy = null;
            }
        })(content);
        document.execCommand('Copy');
    }
    msg('复制 ' + content + '成功。')
}

function initObj(obj) {
    let keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let value = obj[key]
        if (typeof value === "object") {
            if (value === null || value === undefined) {
                continue
            }
            initObj(value)
        } else if (typeof value === "string") {
            obj[key] = ""
        }
    }
}

function dataToStr(date) {
    if (typeof date === 'string') {
        date = new Date(date)
    } else if (typeof date === 'number') {
        date = new Date(date)
    }
    console.log(date)
    let year = addZero(date.getFullYear());
    let month = addZero(date.getMonth() + 1);
    let day = addZero(date.getDate());
    let hour = addZero(date.getHours());
    let minute = addZero(date.getMinutes());
    let second = addZero(date.getSeconds());

    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ":" + second
}


function addZero(num) {
    if (num < 10) {
        return '0' + num
    } else {
        return num
    }
}

function dataOnlyToStr(date) {
    if (typeof date === 'string') {
        date = new Date(date)
    }
    let year = addZero(date.getFullYear());
    let month = addZero(date.getMonth() + 1);
    let day = addZero(date.getDate());

    return year + '-' + month + '-' + day
}

function getStrLength(str) {
    let len = 0;
    for (let i = 0; i < str.length; i++) {
        let c = str.charCodeAt(i);
        //单字节加1
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
            len++;
        } else {
            len += 2;
        }
    }
    return len;
}

function strIsJson(str) {
    try {
        // 尝试将字符串解析为 JSON 对象
        JSON.parse(str);
        // 如果没有抛出错误，则字符串可以被解析为一个对象
        return true;
    } catch (error) {
        // 如果抛出错误，则字符串不是一个有效的 JSON 对象
        return false;
    }
}

function cloneObj(obj) {
    if (obj === null) {
        return null
    }
    let newObj = {};
    if (obj instanceof Array) {
        newObj = [];
    }
    for (let key in obj) {
        let val = obj[key];
        newObj[key] = typeof val === 'object' ? cloneObj(val) : val;
    }
    return newObj;
}

// ---- str util start
function setValInfos(key, valInfos, obj) {
    if (valInfos.hasOwnProperty(key)) {
        // TODO 为了避免什么错误？ 影响数据切换了
        return
    }
    let info = {
        jsonStr: false,
        display: true
    }
    valInfos[key] = info

    if (typeof obj[key] === 'object') {
        info['type'] = 'object'
    } else if (typeof obj[key] === 'number') {
        info['type'] = 'number'
    } else if (typeof obj[key] === 'string') {
        info['type'] = 'string'
        info.jsonStr = strIsJson(obj[key])
    } else if (typeof obj[key] === 'boolean') {
        info['type'] = 'boolean'
    }
    info['className'] = info['type']
    if (info['jsonStr']) {
        info['className'] += '-true'
    }
}

function resetValInfos(valInfos, flag) {
    for (const valInfosKey in valInfos) {
        valInfos[valInfosKey]['display'] = flag
    }
}

const systemConst = {
    booleans: [true, false],
}

