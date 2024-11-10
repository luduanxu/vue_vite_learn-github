const jsonInput = {
    name: 'JsonInput',
    props: {
        maxDepth: {
            type: Number,
            default: 6 // 默认最大递归深度为6
        },
        depth: {
            type: Number,
            default: 1
        },
        commit: {},
        fields: {type: Object, default: {}},
        title: {type: String, default: "标题"},
        isNode: {type: Boolean, default: true},
        noDeleteBtn: {type: Array, default: ['name', 'code', 'componentId']},
        modelValue: {type: Object, default: {name: "名称"}}
    },
    data() {
        return {
            dialogTitle: '',
            updateFieldFlag: false,
            updateKey: '',
            updateData: {},
            addFieldFlag: false,
            addFields: [],
            fieldOrders: [],
            keyWidth: 0,
            keyWidthSize: [3, 6, 8, 10, 16],
            valInfos: {}
        };
    },
    computed: {
        hasData() {
            return Object.keys(this.modelValue).length > 0;
        },
        orderedFields() {
            this.fieldOrders = [...new Set([...this.fieldOrders.filter(field => this.modelValue.hasOwnProperty(field)), ...Object.keys(this.modelValue)])];

            // 设置key的宽度
            let sizeMax = 4
            this.fieldOrders.forEach(key => {
                sizeMax = Math.max(sizeMax, getStrLength(key))
                setValInfos(key, this.valInfos, this.modelValue)
            })

            // 设置key type
            // console.log('size max', sizeMax)
            for (let index = 0; index < this.keyWidthSize.length; index++) {
                if (index === this.keyWidthSize.length - 1) {
                    this.keyWidth = index
                    break
                }
                if (this.keyWidthSize[index] < sizeMax && sizeMax <= this.keyWidthSize[index + 1]) {
                    this.keyWidth = index
                    break
                }
            }
            // console.log('keyWidth', this.keyWidth)
            return this.fieldOrders
        },
    },
    methods: {
        setBooleanValue(key, val) {
            this.modelValue[key] = val
        },
        toStr(key) {
            this.valInfos[key].type = 'string'
            this.valInfos[key].jsonStr = true
            this.modelValue[key] = jsonToStr(this.modelValue[key])
        },
        toJson(key) {
            this.valInfos[key].type = 'object'
            this.valInfos[key].jsonStr = false
            this.modelValue[key] = strToJson(this.modelValue[key])
        },
        objToStr(val) {
            if (typeof val === 'object') {
                return JSON.stringify(val)
            } else {
                return val
            }
        },
        deleteField(key) {
            dialog('确认删除 ' + key + ' 字段?', () => {
                if (Array.isArray(this.modelValue)) {
                    this.modelValue.splice(key, 1);
                } else {
                    delete this.modelValue[key];
                }
            }, key + this.depth, 'error')
        },
        copyValue(value) {
            copyTextIn(value);
        },
        copyObj(value, isSpace) {
            if (!isSpace) {
                copyTextIn(JSON.stringify(value))
                return
            }
            if (typeof value === 'string') {
                copyTextIn(jsonToStrFormat(strToJson(value)))
                return
            }
            copyTextIn(jsonToStrFormat(value))
        },
        setDisplay(filed, val) {
            this.valInfos[filed]['display'] = val
        },
        setJsonDisplay(val) {
            if (Array.isArray(this.$refs.child)) {
                this.$refs.child.forEach(child => {
                    child.setJsonDisplay(val)
                })
            } else if (this.$refs.child) {
                this.$refs.child.setJsonDisPlay(this.childrenJsonDisplay)
            }
            resetValInfos(this.valInfos, val)
        },
        resetStr(key) {
            if (strIsJson(this.modelValue[key])) {
                this.valInfos[key].jsonStr = true
            } else {
                this.valInfos[key].jsonStr = false
            }
        },
        // 对象编辑
        updateStrObj(key) {
            this.dialogTitle = `第${this.depth}层的《${key}》 json字符串修改`
            this.updateKey = key
            if (typeof this.modelValue[key] === 'string'){
                this.updateData = strToJson(this.modelValue[key])
            } else {
                this.updateData = this.modelValue[key]
            }
            this.updateFieldFlag = true
        },
        updateFieldDo() {
            this.modelValue[this.updateKey] = jsonToStrFormat(this.updateData)
            this.updateFieldFlag = false
        },
        updateFieldEasyDo() {
            this.modelValue[this.updateKey] = jsonToStr(this.updateData)
            this.updateFieldFlag = false
        },
        addField() {
            let obj = {fieldKey: '', fieldType: 'string', fieldValue: ''}
            this.addFields.push(obj)
            if (Array.isArray(this.modelValue)) {
                obj.fieldKey = this.modelValue.length + this.addFields.length - 1
            }
            this.addFieldFlag = true
        },
        addFieldDo() {
            for (let item of this.addFields) {
                if ((!item.fieldKey && item.fieldKey !== 0) || !item.fieldType) {
                    continue
                }
                if (item.fieldType === 'string') {
                    this.modelValue[item.fieldKey] = item.fieldValue
                } else if (item.fieldType === 'number') {
                    this.modelValue[item.fieldKey] = parseFloat(item.fieldValue)
                } else if (item.fieldType === 'boolean') {
                    this.modelValue[item.fieldKey] = item.fieldValue === 'true'
                } else if (item.fieldType === 'array') {
                    try {
                        this.modelValue[item.fieldKey] = JSON.parse(item.fieldValue)
                    } catch (e) {
                        msgError(`${item.fieldValue} 不是合法的 json 字符串`)
                        return
                    }
                } else if (item.fieldType === 'object') {
                    try {
                        this.modelValue[item.fieldKey] = JSON.parse(item.fieldValue)
                    } catch (e) {
                        msgError(`${item.fieldValue} 不是合法的 json 字符串`)
                        return;
                    }
                }
            }
            this.addFields = []
            this.addFieldFlag = false
        },
        deleteAddField(item) {
            dialog('确认删除 ' + item.fieldKey + ' 字段?', () => {
                if (Array.isArray(this.addFields)) {
                    this.addFields.splice(item.fieldKey, 1);
                } else {
                    delete this.addFields[item.fieldKey];
                }
            }, item.fieldKey + this.depth, 'error')
            console.log(jsonToStr(item))
        }
    },
    template: `
      <div :class="'json-obj-main-' + depth">
      <!-- 数据 -->
      <div v-for="filed in orderedFields" v-if="hasData">
        <div class="key-value-out">
          <!-- key -->
          <div class="key-value-main">
            <div :class="'key-value-key key-type-' + keyWidth" :title="filed">
              {{ filed.length > keyWidthSize[4] ? filed.substring(0, keyWidthSize[4]) + '...' : filed }}
              <button class="button-img success" @click="copyValue(filed)">
                <img src="img/copy.svg" class="svg-button">
              </button>
              <span style="margin: 0 4px 8px 0;">:</span>
            </div>

            <!-- 值展示 -->
            <div class="key-value-value">
              <!-- 字符串 -->
              <input v-model="modelValue[filed]" v-if="valInfos[filed]['type'] === 'string'"
                     :class="'input-text-' + depth" @change="resetStr(filed)" type="text"/>

              <!-- 对象 -->
              <div v-else-if="valInfos[filed]['type'] === 'object'">
                <!-- 正常显示 -->
                <div v-if="valInfos[filed]['display']">
                  <!-- null值 -->
                  <span v-if="modelValue[filed] === null || modelValue[filed] === undefined">
                      <input v-model="modelValue[filed]" style="width: 60px"><span style="font-size: 11px;color: gray"> 对象类型，值为null</span>
                    </span>
                  <json-input ref="child" v-model="modelValue[filed]" v-else-if="depth < maxDepth" :depth="depth+1"/>
                  <!-- 递归深度超标暂时 -->
                  <span v-else title="该书籍为对象，超过显示限制">{{ objToStr(modelValue[filed]) }}</span>
                </div>
                <div v-else>
                  <span title="该书籍为对象，超过显示限制">{{ objToStr(modelValue[filed]) }}</span>
                </div>
              </div>

              <!-- 数字 -->
              <input v-model="modelValue[filed]" v-else-if="valInfos[filed]['type'] === 'number'" class="input-number"
                     type="number">

              <!-- 布尔类型 -->
              <span v-else-if="valInfos[filed]['type'] === 'boolean'">
                <button :class="[
                  'boolean-true',
                  { 'this-value-true': modelValue[filed] === true },
                ]" @click="setBooleanValue(filed, true)">true</button>
                <button :class="[
                  'boolean-false',
                  { 'this-value-true': modelValue[filed] === false },
                ]" @click="setBooleanValue(filed, false)">false</button>
              </span>
            </div>

            <!-- 值操作 -->
            <div :class="'key-value-open open-' + (depth > maxDepth? 'open-string-true': valInfos[filed]['className'])">
              <button @click="toStr(filed)" class="txt-button warning" v-if="valInfos[filed]['type']  === 'object'"
                      :title="filed + ' 字段值json对象转json格式字符串'">
                toStr
              </button>

              <span v-if="valInfos[filed]['jsonStr'] || depth >= maxDepth">
                <button @click="toJson(filed)" class="txt-button warning" v-if="valInfos[filed]['jsonStr']"
                        :title="filed + ' 字段值json字符串转json'">
                  toObj
                </button>
                <button @click="updateStrObj(filed)" class="button-img warning"
                        v-if="depth> maxDepth || valInfos[filed]['jsonStr'] || valInfos[filed]['type'] === 'object'"
                        :title="'<' + filed + '> 编辑'">
                  <img src="img/edit.svg" class="svg-button">
                </button>
               </span>

              <button @click="copyObj(modelValue[filed], false)" class="button-img success"
                      :title="'复制<' + filed + '>值（对象时为简化，字符串json保留引号、转义符）'">
                <img src="img/copy.svg" class="svg-button">
              </button>

              <button @click="copyObj(modelValue[filed], true)" class="button-img success"
                      v-if="valInfos[filed]['type'] === 'object' || valInfos[filed]['jsonStr']"
                      :title="'复制<' + filed + '>值为格式化json'">
                <img src="img/copy.svg" class="svg-button">
              </button>

              <span v-if="valInfos[filed]['type'] === 'object'">
                  <button @click="setDisplay(filed, false)" v-if="valInfos[filed]['display']"
                          class="button-img success">
                    <img src="img/view.svg" class="svg-button">
                  </button>
                  <button @click="setDisplay(filed, true)"
                          class="button-img success" v-else>
                    <img src="img/hide.svg" class="svg-button">
                  </button>
              </span>

              <button @click="deleteField(filed)" class="button-img error" :title="'删除该' + filed">
                <img src="img/delete.svg" class="svg-button">
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- 无数据 -->
      <div v-else>无数据</div>

      <!-- 增加字段 -->
      <div class="add-key-value-main">
        <!-- 增加按钮 -->
        <button class="button-img" @click="addField"
                :title="(orderedFields.length>0? orderedFields[orderedFields.length-1] + ' 后':'') + '增加'">
          <img src="img/plus.svg" class="svg-button"/>
        </button>

        <!-- 增加限制 -->
        <div v-if="addFieldFlag">
          <div class="row" v-for="item in addFields">
            <input v-model="item.fieldKey" placeholder="请输入字段名称" :class="'key-value-key key-type-' + keyWidth"/>

            <select v-model="item.fieldType" class="select-div">
              <option value="string" label="String" class="option-div"/>
              <option value="number" label="Number" class="option-div"/>
              <option value="boolean" label="Boolean" class="option-div"/>
              <option value="array" label="Array" class="option-div"/>
              <option value="object" label="Object" class="option-div"/>
            </select>

            <input v-model="item.fieldValue" placeholder="请输入字段值" :class="'input-text-' + depth"/>

            <button class="button-img error" @click="deleteAddField(item)">
              <img src="img/delete.svg" class="svg-button">
            </button>
          </div>
          <button class="primary" @click="addFieldFlag=false">取消</button>
          <button class="success" @click="addFieldDo">添加</button>
        </div>
      </div>
      
      <div class="bg-div-gray" v-if="updateFieldFlag">
        <div class="update-dialog">
          <h3 class="update-title">{{dialogTitle}}</h3>
          <json-input v-model="updateData"/>
          <div class="update-open">
            <button class="primary" @click="updateFieldFlag = false">取消</button>
            <button class="success" @click="updateFieldDo">确认</button>
          </div>
        </div>
      </div>
      </div>
    `
}
