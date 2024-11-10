<template>
  <el-button @click="addNode">add</el-button>
  <el-button @click="addNodeReset">reset</el-button>
  <el-button @click="updateName">修改第一个name</el-button>
  <hr>
  <div><h2>测试</h2></div>
  <div id="myDiagramDiv" style="width:800px; height:800px; border:solid 1px black;"></div>
</template>

<script>
import go from 'gojs';

export default {
  name: "GojsAddNode",
  data() {
    return {
      nodeData: [
        {key: "Alpha", name: 'name 1', tip: 'test sfasf'},
        {key: "Beta", name: 'n 1', tip: 'test saaaaa'}
      ],
      linkData: [
        {from: "Alpha", to: "Beta"}
      ],
      gridVisibleFlag: true,
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const myDiagram = new go.Diagram("myDiagramDiv",
          {
            "undoManager.isEnabled": true
          });

      this.diagram = myDiagram

      myDiagram.nodeTemplate = this.getNodeTemplate()
      myDiagram.linkTemplate = this.getLinkTemplate()

      myDiagram.layout = new go.TreeLayout();

      this.setMode(myDiagram);
      myDiagram.model.undoManager.isEnabled = true;
    },
    getNodeTemplate() {
      let nodeInit = {
        // background: "#44e9ff",
        // 点击是显示增加按钮
        selectionAdornmentTemplate: this.getSelectionAdornmentTemplate(),
        mouseEnter: this.getMouseEnter(),
        click: this.getMouseEnter1(),
        resizable: true
      }
      let tipPanelTxt = new go.TextBlock({margin: 3})
      tipPanelTxt.bind("text", "tip")
      let tipPanel = new go.Panel(go.Panel.Vertical);
      tipPanel.add(tipPanelTxt)
      let toolTip = go.GraphObject.build("ToolTip")
      toolTip.add(tipPanel)
      nodeInit.toolTip = toolTip

      let nodeShape = new go.Shape("RoundedRectangle", {fill: "whitesmoke"})
      let nodePanel = new go.Panel(go.Panel.Table);
      let nodePanelTxtInit1 = {row: 0, margin: 12, font: "bold 16px sans-serif"}
      let nodePanelTxtInit2 = {row: 1, margin: 12, font: "bold 16px sans-serif"}
      let nodePanelTxt1 = new go.TextBlock(nodePanelTxtInit1)
      nodePanelTxt1.bind("text", "key")
      let nodePanelTxt2 = new go.TextBlock(nodePanelTxtInit2)
      nodePanelTxt2.bind("text", "name")
      nodePanel.add(nodePanelTxt1, nodePanelTxt2)

      return new go.Node(go.Panel.Auto, nodeInit).add(nodeShape, nodePanel)
    },
    getLinkTemplate() {
      let linkInit = {
        // 鼠标移入是显示删除按钮
        selectable: true,
        relinkableFrom: true,
        relinkableTo: true,
        reshapable: true,
        routing: go.Routing.AvoidsNodes,
        curve: go.Curve.JumpOver,
        corner: 5,
        toShortLength: 4,
      }
      let link = new go.Link(linkInit)
      let shape1 = new go.Shape({isPanelMain: true, strokeWidth: 2});
      let shape2 = new go.Shape({toArrow: 'Standard', stroke: null});

      let panel = new go.Panel(go.Panel.Auto, new go.Binding('visible', 'isSelected').ofObject())
      let shapePanel = new go.Shape('RoundedRectangle', {fill: '#F8F8F8', stroke: null})
      let txtPanel = new go.TextBlock({
            textAlign: 'center',
            font: '10pt helvetica, arial, sans-serif',
            stroke: '#919191',
            margin: 2,
            minSize: new go.Size(10, NaN),
            editable: true,
          },
          new go.Binding('text').makeTwoWay());

      panel.add(shapePanel, txtPanel)
      link.add(shape1, shape2, panel)

      return link
    },
    setMode(myDiagram) {
      myDiagram.model = new go.GraphLinksModel(this.nodeData, this.linkData);
    },
    addNodeAndLink(e, b) {
      // 在装饰中获取一个按钮面板，获取其装饰，然后获取其装饰节点，及当前选择的节点
      let node = b.part.adornedPart;
      let diagram = node.diagram;

      // 增加节点
      diagram.startTransaction("add node and link");
      let newnode = {key: this.generateRandomString(5), text: "N" + diagram.model.nodeDataArray.length, name: "aaa"};
      let newlink = {from: node.data.key, to: newnode.key};
      diagram.model.addNodeData(newnode);
      diagram.model.addLinkData(newlink);
      diagram.commitTransaction("add node and link");
    },
    getSelectionAdornmentTemplate() {
      // 创建一个装饰器, 然后添加一个按钮
      let adornment = new go.Adornment(go.Panel.Spot);

      let panel = new go.Panel(go.Panel.Auto)
      let shapePanel = new go.Shape("RoundedRectangle", {fill: null, stroke: 'dodgerblue', strokeWidth: 3});
      let placeholderPanel = new go.Placeholder();
      panel.add(shapePanel, placeholderPanel);
      adornment.add(panel);

      let buttonInit = {alignment: go.Spot.Right, alignmentFocus: go.Spot.Left, click: this.addNodeAndLink}
      let button = go.GraphObject.build("Button", buttonInit)
      let txtBtnInit = {stroke: "blue", font: "bold 8pt sans-serif"}
      let txtBtn = new go.TextBlock("增加", txtBtnInit)
      button.add(txtBtn);

      adornment.add(button)
      return adornment;
    },
    getMouseEnter() {
      return (e, obj) => {
        let node = obj.part;
        console.log('mouse', 11112, node.data.key)
      };
    },
    getMouseEnter1() {
      return (e, obj) => {
        let node = obj.part;
        console.log('click', 11112, node.data.key)
      };
    },
    addNode() {
      // 开启事物
      this.diagram.startTransaction("add node and link");
      // have the Model add the node data
      let newnode = {key: this.generateRandomString(5), name: "aaa"};
      this.diagram.model.addNodeData(newnode);

      // finish the transaction -- will automatically perform a layout
      this.diagram.commitTransaction("add node and link");
      console.log(JSON.stringify(this.diagram.model.nodeDataArray))
    },
    addNodeReset() {
      this.nodeData.push({key: "N", name: 'fd'})
      this.linkData.push({from: 'Beta', to: 'N'});
      this.setMode(this.diagram)
    },
    updateName() {
      this.diagram.model.commit(m => {
        const data = m.nodeDataArray[0];  // get the first node data
        m.set(data, "name", data.name + ' 1');
      }, "increment");
      console.log(JSON.stringify(this.diagram.model.nodeDataArray))
    },
    generateRandomString(length) {
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    }
  }
}
</script>

<style scoped>

</style>