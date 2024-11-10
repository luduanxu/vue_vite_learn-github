<template>
  <el-button @click="addNodeTest">add</el-button>
  <el-button @click="addNode">update</el-button>
  <hr>
  <div><h2>测试</h2></div>
  <div id="myDiagramDiv" style="width:800px; height:800px; border:solid 1px black;"></div>
</template>

<script>
import go from 'gojs';

export default {
  name: "GojsFirst",
  data() {
    return {
      nodeData: [
        {
          "category": "node258",
          "text": "规则",
          title: "则是说明1",
          "key": -1,
          "loc": "-605.5896437273716 -214.50164873808765"
        },
        {
          "category": "node258",
          "text": "计划1",
          title: "这是说明2",
          "key": -2,
          "loc": "-400 -300"
        },
      ],
      linkData: [
        {"from": -1, "to": -2},
      ],
      paletteNode: [
        // 指定调色板的内容
        {
          category: "node258",
          text: "规则"
        },
        {
          category: "node258",
          text: "计划1"
        },
        {
          category: "node258",
          text: "执行2"
        }
      ],
      gridVisibleFlag: true,
      nodeDataArray: [
        {key: "1", name: "测试 1", source: "/img/cat1.jpeg", desc: "a"},
        {key: "2", parent: "1", name: "测试 2", source: "/img/cat2.png", desc: "b"},
        {key: "3", parent: "1", name: "测试 3", source: "/img/cat3.jpg", desc: ""},
        {key: "4", parent: "3", name: "测试 4", source: "/img/cat1.jpeg", desc: ""},
        {key: "5", parent: "3", name: "测试 5", source: "/img/cat2.png", desc: "c"},
        {
          key: "6", parent: "2", name: "测试 6",
          source: "https://b.bdstatic.com/searchbox/icms/searchbox/img/young_girl.png", desc: ""
        }
      ],
      diagram: {}
    }
  },

  mounted() {
    this.init()
  },
  methods: {
    save() {
      let mySelf = this;
      console.log(mySelf.myDiagram.model.toJson());
      mySelf.myDiagram.isModified = false;
    },
    getMyDiagram() {
      class DemoForceDirectedLayout extends go.ForceDirectedLayout { //布局
        makeNetwork(coll) {
          const net = super.makeNetwork(coll);
          net.vertexes.each(vertex => {
            const node = vertex.node;
            if (node !== null) vertex.isFixed = node.isSelected;
          });
          return net;
        }
      }

      return new go.Diagram("myDiagramDiv",  // 为DIV.HTML元素创建一个画布
          {
            //设置画布配置
            initialContentAlignment: go.Spot.Center, // 居中显示
            "undoManager.isEnabled": true, // 支持 Ctrl-Z 和 Ctrl-Y 操作
            "toolManager.hoverDelay": 100, //tooltip提示显示延时
            "toolManager.toolTipDuration": 10000, //tooltip持续显示时间
            //isReadOnly:true,//只读
            //显示网格
            "grid.visible": this.gridVisibleFlag,
            allowMove: true, //允许拖动
            allowDragOut: true,
            allowDelete: true,
            allowCopy: true,
            // 缩放以使所有内容都适合
            allowClipboard: true, initialAutoScale: go.Diagram.Uniform,

            //有鼠标滚轮事件放大和缩小，而不是向上和向下滚动
            "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
            // 双击新建节点(可以写入节点的默认信息)；
            'clickCreatingTool.archetypeNodeData': {category: 'node258', text: '新节点', notice: ''},
            layout: new DemoForceDirectedLayout()
          });
    },
    getLinkTemplate() {
      return $(go.Link, {
            selectable: true, //连接线是否可选
            relinkableFrom: true,//出发点是否可以改变
            relinkableTo: true,//目标点是否可以改变
          }, new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          $(go.Shape, {
            strokeWidth: 2,//节点连接线宽度
            stroke: "#F60"//颜色
          }),
          $(go.Shape, {
            toArrow: "Standard",
            fill: "red",//箭头填充色
            stroke: "blue"//外边框颜色
          })//箭头
      );
    },
    getNodeTemplate() {
      return $(go.Node,
          "auto",
          {
            movable: true,//是否可拖动
            deletable: true,//是否可删除
            selectable: true, //是否可选择
            selectionAdorned: false, //显示选中边框
            // reshapable:true, // 重塑(改变shape形状边界时使用，将影响节点大小)
            // resizable: true, // 可调整大小的(手动调整节点大小时，节点内容显示区域时使用)
          }, new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          //表明需要创建一个panel面板对象//声明创建一个新的面板对象,自定义方式可参考mySelf.myDiagram.nodeTemplate
          $(go.Panel,
              "Auto", //页面布局为自动
              $(go.Shape,//声明构建一个圆形
                  "Circle", {
                    fill: "#44CCFF",//内填充色
                    cursor: "pointer",//指针
                    stroke: null,//外框颜色null
                    portId: "",
                    fromLinkable: true,
                    fromLinkableSelfNode: false,
                    fromLinkableDuplicates: true,
                    toLinkable: true,
                    toLinkableSelfNode: false,
                    toLinkableDuplicates: false,
                  },
                  new go.Binding("figure", "figure") //声明并创建一个新的图形
              ),
              $(go.TextBlock, {//声明一个可编辑文本域
                    font: "12pt Helvetica, Arial, sans-serif",
                    width: 50,
                    maxSize: new go.Size(360, NaN),
                    wrap: go.TextBlock.WrapFit, //文本域换行
                    editable: true, //是否可编辑
                    margin: 12,
                  },
                  new go.Binding("text").makeTwoWay()
              ),
          ),
          {//  悬浮提示
            toolTip:
                $("ToolTip",
                    $(go.TextBlock, {margin: 4},
                        new go.Binding("text", "title"))
                ),
          })
    },
    init() {
      const myDiagram = new go.Diagram("myDiagramDiv", {
        "undoManager.isEnabled": true, layout: new go.TreeLayout({angle: 90, layerSpacing: 35})
      });

      this.diagram = myDiagram

      myDiagram.nodeTemplate = new go.Node("Horizontal",
          {background: "#44e9ff"})
          .add(
              new go.Picture({margin: 10, width: 50, height: 50, background: "red"}).bind("source"),
              new go.TextBlock("Default Text", {margin: 12, stroke: "white", font: "bold 16px sans-serif"})
                  .bind("text", "name"),
              new go.TextBlock("Default Text",
                  {margin: 12, stroke: "white", font: "bold 16px sans-serif", editable: true})
                  .bind("text", "desc"),
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
          );

      // define a Link template that routes orthogonally, with no arrowhead
      myDiagram.linkTemplate = new go.Link(
          // default routing is go.Routing.Normal
          // default corner is 0
          {routing: go.Routing.Orthogonal, corner: 5})
          .add(
              // the link path, a Shape
              new go.Shape({strokeWidth: 3, stroke: "#555"}),
              // if we wanted an arrowhead we would also add another Shape with toArrow defined:
              //new go.Shape({  toArrow: "Standard", stroke: null  })
          );

      // it's best to declare all templates before assigning the model
      myDiagram.model = new go.TreeModel(this.nodeDataArray);

      myDiagram.addModelChangedListener(evt => {
        // ignore unimportant Transaction events
        if (!evt.isTransactionFinished) return;
        let txn = evt.object;  // a Transaction
        if (txn === null) return;

        // iterate over all of the actual ChangedEvents of the Transaction
        txn.changes.each(e => {
          // ignore any kind of change other than adding/removing a node
          if (e.modelChange !== "nodeDataArray") return;

          // record node insertions and removals
          if (e.change === go.ChangeType.Insert) {
            console.log(evt.propertyName + " added node with key: " + e.newValue.key, ' 增加节点', JSON.stringify(e.newValue));
          } else if (e.change === go.ChangeType.Remove) {
            console.log(evt.propertyName + " removed node with key: " + e.oldValue.key, ' 删除节点',
                JSON.stringify(e.newValue));
          }
        });
      });
    },
    test() {

    },
    initPalette() {
      const mySelf = this;
      window.myPalette = $(
          go.Palette,
          "myPalette", // 必须命名或引用DIV.HTML元素
          {
            scrollsPageOnFocus: false,
            nodeTemplateMap: mySelf.myDiagram.nodeTemplateMap, // 共享myDiagram使用的模板
            model: new go.GraphLinksModel(this.paletteNode)
          }
      );
    },
    gridVisible() {
      this.gridVisibleFlag = !this.gridVisibleFlag
      this.myDiagram.grid.visible = this.gridVisibleFlag
    },
    addNodeTest() {
      const selnode = this.diagram.selection.first();
      if (!(selnode instanceof go.Node)) {
        console.log("addNodeTest")
        return;
      }

      this.diagram.commit(d => {
        // have the Model add a new node data
        d.model.addNodeData({
          key: "7", parent: "5", name: "测试 5", source:
              "/img/cat2.png",
          desc: "c"
        })
      }, "add node and link");
    },
    updateTest() {
      this.diagram.model.commit(m => {
        const data = m.nodeDataArray[0];  // get the first node data
        console.log(data.desc)
        m.set(data, "desc", data.desc + '1');
      }, "increment");
    },
    addNode() {
      console.log('dsdf')
      const selnode = this.diagram.selection.first();
      if (!(selnode instanceof go.Node)) return;
      this.diagram.commit(d => {
        // have the Model add a new node data
        console.log('addNode')
        const newnode = {key: "N"};
        d.model.addNodeData(newnode);  // this makes sure the key is unique
        // and then add a link data connecting the original node with the new one
        const newlink = {from: selnode.data.key, to: newnode.key};
        // add the new link to the model
        d.model.addLinkData(newlink);
      }, "add node and link");
    }
  }
}
</script>

<style scoped>

</style>