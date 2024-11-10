let methods = {
    strFormat() {
        this.inputStr = strFormat(this.inputStr)
        this.updateLineNumbers()
    },
    dataChange() {
        if (this.inputType === 'obj') {
            this.inputStr = jsonToStrFormat(this.inputObj)
            this.inputType = 'str'
            setTimeout(() => this.updateLineNumbers(), 100);
        } else {
            this.inputObj = strToJson(this.inputStr)
            this.inputType = 'obj'
        }
        console.log(this.inputType)
    },
    dataChangeOnly() {
        if (this.inputType === 'obj') {
            this.inputStr = jsonToStrFormat(this.inputObj)
        } else {
            this.inputObj = strToJson(this.inputStr)
        }
    },
    updateLineNumbers() {
        if (this.inputType === 'obj') {
            return
        }
        this.lines = this.inputStr.split('\n').length;
        this.$refs.lineNumbers.innerHTML = Array.from({length: this.lines}, (_, i) => i + 1).join('<br>');
        this.updateLineNumbersOut();
    },
    updateLineNumbersOut() {
        this.outputStr = strFormat(this.inputStr)
        if (this.inputType === 'obj') {
            this.outputStr = jsonToStrFormat(this.inputObj)
        }
        this.linesOut = this.outputStr.split('\n').length;
        this.$refs.lineNumbersOut.innerHTML = Array.from({length: this.linesOut}, (_, i) => i + 1).join('<br>');
    },
    updateLineNumbersOutOnly() {
        if (this.inputType === 'obj') {
            return
        }
        this.linesOut = this.outputStr.split('\n').length;
        this.$refs.lineNumbersOut.innerHTML = Array.from({length: this.linesOut}, (_, i) => i + 1).join('<br>');
    },
    cpInput() {
        if (this.inputType === 'obj') {
            copyTextIn(jsonToStrFormat(this.inputObj))
        } else {
            copyTextIn(this.inputStr)
        }
    },
    copyTextIn(txt) {
        copyTextIn(txt)
    },
    rightDisplay() {
        this.displayRight = !this.displayRight;
        if (this.displayRight) {
            this.rightClass = 'right'
            this.leftClass = 'left'
            this.inputClass = 'input'
        } else {
            this.rightClass = 'right-hide'
            this.leftClass = 'left left-all'
            this.inputClass = 'input input-left-all'
        }
    },
    copyOutSetNumbers() {
        copyTextIn(this.outputStr)
        this.updateLineNumbersOutOnly()
    },
    setJsonDisplay() {
        this.childrenJsonDisplay = !this.childrenJsonDisplay
        this.$refs.child.setJsonDisplay(this.childrenJsonDisplay)
    },
    saveDataDo() {
        let data = this.outputStr
        // 前置判断
        if (this.inputType === 'obj') {
            data = jsonToStrFormat(this.inputObj)
        }
        if (data === "" || data === null) {
            msgWarning("请输入数据");
            return;
        }
        if (this.jsonName === "") {
            msgWarning("请输入文件名");
            return;
        }

        let dataObj = {
            name: this.jsonName,
            data: data
        }
        let addFlag = true
        for (const item of this.saveData) {
            if (item.name === dataObj.name) {
                dataObj = item
                dataObj.data = data
                addFlag = false
                break
            }
        }

        if (addFlag) {
            this.saveData.push(dataObj)
            // 示例：使用 `writeData` 函数写入数据
            writeData(dataObj);
        } else {
            // 示例：使用 `updateData` 函数更新数据
            updateData(cloneObj(dataObj));
        }

        this.jsonName = ''
        msgSuccess("保存成功", 800)
        this.jsonNameDialog = false
    },
    thisDataChange() {
        if (this.inputType === 'obj') {
            if (strIsJson(this.thisDataObj.data)) {
                this.inputObj = strToJson(this.thisDataObj.data)
            } else {
                this.inputType = 'str'
                this.inputStr = this.thisDataObj.data
            }
        } else {
            this.inputStr = this.thisDataObj.data
        }
    },
    deleteData() {
        if (this.saveData.includes(this.thisDataObj)) {
            this.saveData.splice(this.saveData.indexOf(this.thisDataObj), 1)
            deleteData(this.thisDataObj.name)
            msgSuccess("删除成功", 800)
        }
    },
    exportData() {
        exportData()
    },
    // ----- 处理数据方法 格式处理 ---
    jsonFormat() {
        if (this.inputStr === "") {
            msgWarning("请输入数据");
            return;
        }
        this.dataChangeOnly()
        this.outputStr = JSON.stringify(JSON.parse(this.inputStr), null, 2)
        this.copyOutSetNumbers();
        this.updateLineNumbersOut()
    },
    jsonMin() {
        if (this.inputStr === "") {
            msgWarning("请输入数据");
            return;
        }
        this.dataChangeOnly()
        this.outputStr = JSON.stringify(JSON.parse(this.inputStr))
        this.copyOutSetNumbers();
    },
    // ---- 行转数组 ---
    rowToArr(rep) {
        if (this.inputStr === "") {
            msg("请输入数据", 1600, "error");
            return;
        }
        let arr = this.inputStr.replaceAll(/[，,]/g, rep)
            .split(rep).map(item => item.trim()).filter(item => item !== "");
        this.outputStr = jsonToStrFormat(arr)
        this.copyOutSetNumbers();
    },
    rowToObj(rep) {
        if (this.inputStr === "") {
            msg("请输入数据", 1600, "error");
            return;
        }
        let arr = this.inputStr.replaceAll(/[，,]/g, rep)
            .split(rep).map(item => item.trim()).filter(item => item !== "");
        let obj = {}
        arr.forEach(item => {
            obj[item] = ''
        })
        this.outputStr = jsonToStrFormat(obj)
        this.copyOutSetNumbers();
    },
    rowToArr1(rep) {
        if (this.inputStr === "") {
            msg("请输入数据", 1600, "error");
            return;
        }
        let arr = this.inputStr.replaceAll(/"/g, '')
            .split(rep).map(item => item.trim()).filter(item => item !== "");
        this.outputStr = jsonToStrFormat(arr)
        this.copyOutSetNumbers();
    },
    // ---- 对象操作
    objKeysToCopy() {
        if (this.inputStr === "") {
            msgWarning("请输入数据");
            return;
        }
        let obj = JSON.parse(this.inputStr)
        if (this.inputType === 'obj') {
            obj = this.inputObj
        }
        this.outputStr = jsonToStrFormat(Object.keys(obj))
        this.copyOutSetNumbers();
    },
    objValToCopy() {
        if (this.inputStr === "") {
            msgWarning("请输入数据");
            return;
        }
        let obj = JSON.parse(this.inputStr)
        if (this.inputType === 'obj') {
            obj = this.inputObj
        }
        this.outputStr = jsonToStrFormat(Object.values(obj))
        this.copyOutSetNumbers();
    },
    objInit() {
        if (this.inputType === 'str') {
            this.inputObj = strToJson(this.inputStr)
        }
        initObj(this.inputObj);
        this.inputStr = JSON.stringify(this.inputObj, null, 2)
        this.updateLineNumbers()
    },
    setVal() {
        if (!this.outputStr) {
            msgWarning("请输入数据");
            return;
        }
        let arr = this.outputStr.replaceAll(/[,\t]/g, '\n').split('\n').map(item => item.trim());

        this.dataChangeOnly()
        if (this.inputObj instanceof Array) {
            this.inputObj.forEach(item => setObjVal(item, arr))
        } else {
            setObjVal(this.inputObj, arr)
        }
        this.inputStr = JSON.stringify(this.inputObj, null, 2);
        this.updateLineNumbers()
        copyTextIn(this.inputStr)
    },
    copyVal() {
        this.dataChangeOnly()
        if (this.inputStr === '' || this.outputStr === '') {
            msgWarning("有对象为空，请输入")
        }
        try {
            let fromObj = JSON.parse(this.outputStr)
            let toObj = JSON.parse(this.inputStr)
            assignValues(fromObj, toObj, 0)
            this.inputObj = toObj
            this.inputStr = jsonToStrFormat(toObj)
            this.updateLineNumbers()
            copyTextIn(this.inputStr)
        } catch (e) {
            msgWarning("有字符串错误。")
        }
    },
    rowToKeyVal() {
        if (this.inputStr === "") {
            msgWarning("请输入数据");
            return;
        }
        let arr = this.inputStr.split('\n').map(item => item.trim()).filter(item => item !== "");
        let obj = {}

        arr.forEach(item => {
            const one = item.split('\t');
            if (one.length === 2) {
                const key = one[0].trim();
                obj[key] = one[1].trim()
            } else {
                const eq = item.split('=')
                if (eq.length === 2) {
                    const key = eq[0].trim();
                    obj[key] = eq[1].trim()
                } else {
                    const eq = item.split(':')
                    if (eq.length === 2) {
                        const key = eq[0].trim();
                        obj[key] = eq[1].trim()
                    } else {
                        const eq = item.split(',')
                        if (eq.length === 2) {
                            const key = eq[0].trim();
                            obj[key] = eq[1].trim()
                        } else {
                            obj[item] = ''
                        }
                    }
                }
            }
        })
        this.outputStr = jsonToStrFormat(obj)
    },
    tabToKeyVal() {
        if (this.inputStr === "") {
            msgWarning("请输入数据");
            return;
        }
        let arr = this.inputStr.split('\n').map(item => item.trim()).filter(item => item !== "");
        let objs = []
        let keys = arr[0].split('\t')
        for (let i = 1; i < arr.length; i++) {
            let one = arr[i].split('\t')
            let obj = {}
            for (let j = 0; j < keys.length; j++) {
                obj[keys[j]] = one[j]
            }
            objs.push(obj)
        }
        this.outputStr = jsonToStrFormat(objs)
        this.copyOutSetNumbers()
    },
    // ---- 其他
    oneToJson() {
        if (this.inputStr === "") {
            msgWarning("请输入数据");
            return;
        }
        this.outputStr = StringPageUtil.toDocHis(this.inputStr);
        this.copyOutSetNumbers();
    },
    longToTime() {
        if (this.inputStr === "") {
            msgWarning("请输入数据");
            return;
        }
        let l = Number(this.inputStr)
        this.outputStr = dataToStr(l)
        this.copyOutSetNumbers();
    },
    dateToLong() {
        if (this.inputStr === "") {
            msgWarning("请输入数据");
            return;
        }
        let d = new Date(this.inputStr)
        this.outputStr = d.getTime()
    },
    arrToStr() {
        if (this.inputStr === "") {
            msgWarning("请输入数据");
            return;
        }
        let arr = this.inputStr.replaceAll(/[，,]/g, '\n').split('\n').map(item => item.trim())
        this.outputStr = jsonToStr(arr).slice(1, -1).replace(/[/"\[\]\\]/g, '')
        this.copyOutSetNumbers();
    },
    nowLong() {
        this.outputStr = new Date().getTime()
        this.copyOutSetNumbers();
    },
    nowDate() {
        this.outputStr = dataToStr(new Date())
        this.copyOutSetNumbers();
    },
    // ----- SQL 操作
    rowToArrSql() {
        if (this.inputStr === "") {
            msgWarning("请输入数据");
            return;
        }
        let arr = this.inputStr.replaceAll(/[，,]/g, "\n")
            .split("\n").map(item => item.trim()).filter(item => item !== "");
        this.outputStr = JSON.stringify(arr).replace('[', '(').replace(']', ')')
        this.copyOutSetNumbers();
    },
}

function setObjVal(obj, arr) {
    let keys = Object.keys(obj)
    let offset = 0
    let next = true
    out:
        for (let i = 0; i < arr.length && i < keys.length; i++) {
            if (arr[i] === 'pass' || keys[i + offset] === undefined) {
                continue
            }
            while (next) {
                let clazz = typeof obj[keys[i + offset]]
                if (clazz === 'string' || clazz === "undefined") {
                    obj[keys[i + offset]] = arr[i]
                    continue out;
                } else if (clazz === 'number') {
                    obj[keys[i + offset]] = Number(arr[i])
                    continue out;
                } else if (clazz === 'boolean') {
                    obj[keys[i + offset]] = Boolean(arr[i])
                    continue out;
                }
                offset++
                if (i + offset >= keys.length) {
                    break out;
                }
            }
            next = true
        }
}

function assignValues(fromObj, toObj, lvl) {
    // 防止无限递归
    if (lvl > 20) {
        return
    }

    for (let key in fromObj) {
        if (!toObj.hasOwnProperty(key)) {
            // 新增字段
            toObj[key] = fromObj[key]
            continue
        }

        if (typeof toObj[key] === 'object' && toObj[key] !== null) {
            if (typeof fromObj[key] === 'string' && fromObj[key].startsWith('{') && fromObj[key].endsWith('}')) {
                // 将字符串格式的JSON转换为对象
                toObj[key] = JSON.parse(fromObj[key]);
            } else {
                // 递归复制对象或数组
                toObj[key] = Array.isArray(fromObj[key]) ? [] : {};
                this.assignValues(fromObj[key], toObj[key], lvl + 1);
            }
        } else {
            // key
            toObj[key] = fromObj[key];
        }
    }
}