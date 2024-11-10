# 安装
```
npm install gojs --save
```

# 使用


## 按钮

```
go.GraphObject.build("Button", {
                margin: new go.Margin(0, 1, 0, 0),
                click: (e, obj) => {
                  // OBJ is this Button Panel;
                  // find the TableRow Panel containing it
                  const itempanel = obj.panel;
                  console.log('obj', obj.panel)
                  alert("Clicked on row " + itempanel.row + " for " + itempanel.data.name);
                }
              }).add(
                  new go.TextBlock("Click me!")
              )
```

## 翻译
```
alignment           对准
alignmentFocus      对准焦距
Spot                焦点
adornedPart         配件
grid                网格
```