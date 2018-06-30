/*
<button onClick={()=>{console.log(this.state.boxesforanchors)}}>PRINT boxesforanchors</button>

<Rect onClick={this.deployBox} x={0} y={0} width={window.innerWidth} height={window.innerHeight} fill={'#fafafa'} stroke={'black'} strokeWidth={6} />
 
 */

import React, {Component} from 'react';
import ReactDOM, { render } from 'react-dom';
import {withStyles} from 'material-ui/styles';
import { Stage, Layer, Rect, Label, Tag, Group, Text, Image, Circle } from 'react-konva';
import Konva from 'konva';
import './area-selector.css';
import form_img from '../form.jpg';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Dialog, {
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
  } from 'material-ui/Dialog';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';
import Toolbar from 'material-ui/Toolbar';


const image = new window.Image();

const styles = theme => ({
	center: {
		position: 'relative',
		left: '50%',
		transform: "translateX(-50%)"
	}
});
  
// image.src = "http://konvajs.github.io/assets/yoda.jpg";

class AreaSelector extends Component {

	constructor(props){
		super(props);
		this.state={
			image: image,
			imageWidth: 500,
			imageHeight: 500,
			width: 70,
			height: 40,
			open: false,
			boxes: [],
			boxesforanchors: [],
			idx: 0,
			ModalText: "Text Value",
			ModalOpenedIdx: 0,
			inititalPos:{x:0,y:0},
			boxDraggable: true,
			xOffset: 0,
			yOffset: 0,
			isMouseDown: false
		};
		this.deployBox = this.deployBox.bind(this);
		this.removeBox = this.removeBox.bind(this);
		this.changeText = this.changeText.bind(this);
		this.handleClickOpen = this.handleClickOpen.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleCloseAndSetLabel = this.handleCloseAndSetLabel.bind(this);
		this.anchorTest = this.anchorTest.bind(this);
		this.updateCoordinates = this.updateCoordinates.bind(this);
		this.handleBoxMovement = this.handleBoxMovement.bind(this);
		this.normalCursor = this.normalCursor.bind(this);
		this.resizeCursor = this.resizeCursor.bind(this);
		this.dragCursor = this.dragCursor.bind(this);
		this.startMeasuring = this.startMeasuring.bind(this);
		this.stopMeasuring = this.stopMeasuring.bind(this);


		
	}
	componentDidMount() {
		// const image = new window.Image();
		// // image.src = "http://konvajs.github.io/assets/yoda.jpg";
		// image.src = form_img;
		// for(var m in image){
		// 	console.log(m);
		// }
		// image.src = form_img;

		window.client.invoke('displayImage', this.props.imagePath, (error, res) => {
			if (error) {
				console.log(error);
			} else {
				// console.log(res['encoded_img']);
				image.src = 'data:;base64,'+res['encoded_img'];
				console.log(res)
				image.onload = () => {
					// setState will redraw layer
				// because "image" property is changed
					let newHeight = 0;
					let newWidth = 0;
					// aspect ratio code
					if (res['width'] > window.innerWidth*0.7) {
						newHeight = window.innerWidth*0.7 * res['height']/res['width'];
						newWidth = window.innerWidth*0.7;
					}
					console.log("adasjkdh")
					this.setState({
						image: image,
						imageWidth: newWidth,
						imageHeight: newHeight,
						originalHeight: res['height'],
						originalWidth: res['width']
					});
				};
			}
		})
		
	}

	startMeasuring(e){
		console.log("Mouse Dragging")
		this.setState((prevState) => ({
			boxes: prevState.boxes.filter(box => box.idx != this.state.idx),
			boxesforanchors: prevState.boxesforanchors.filter(box => box.idx != this.state.idx)
		}));
		
		
		let stageOffsetY = ReactDOM.findDOMNode(this.refs['stage']).offsetTop - window.scrollY;
		let stageOffsetX = ReactDOM.findDOMNode(this.refs['stage']).offsetLeft - window.scrollX;
		this.setState((prevState) => ({
		  	boxes: prevState.boxes.concat({
				x:this.state.xOffset - stageOffsetX,
				y:this.state.yOffset - stageOffsetY,
				idx: this.state.idx,
				labelText: "Text Field",
				width: e.evt.clientX - this.state.xOffset,
				height: e.evt.clientY - this.state.yOffset,
				xOffset: this.state.xOffset - stageOffsetX,
				yOffset: this.state.yOffset - stageOffsetY,
			}),
			boxesforanchors: prevState.boxesforanchors.concat({
				x:this.state.xOffset - stageOffsetX,
				y:this.state.yOffset - stageOffsetY,
				idx: this.state.idx,
				labelText: "Text Field",
				width: e.evt.clientX - this.state.xOffset,
				height: e.evt.clientY - this.state.yOffset,
			})
		}));
	}

	stopMeasuring(){
		console.log("Mouse is up!");
		this.setState({
			isMouseDown: false,
			idx: this.state.idx + 1
		});

		

	}

	dragCursor(){

		this.refs['stage']._stage.container().style.cursor = 'move';
	
	}
	normalCursor(){

		this.refs['stage']._stage.container().style.cursor = 'default';
	
	}
	resizeCursor(){
		this.refs['stage']._stage.container().style.cursor = 'nw-resize';
	
	}


	/* CODE FOR DIALOG */

	handleClickOpen = (idx, labelText) => {
		this.setState({ open: true,
		ModalText: labelText,
		ModalOpenedIdx: idx });
		
	};
	
	handleClose = () => {
		
		this.setState({ open: false});
	};

	handleCloseAndSetLabel = () => {

		var copyArr = this.state.boxes.slice();
		var i = 0;
		for (i = 0; i < copyArr.length; i++){
			if (copyArr[i].idx == this.state.ModalOpenedIdx ){
				copyArr[i].labelText = this.state.ModalText;
				this.state.boxesforanchors[i].labelText = this.state.ModalText; //Breaking react rules because of bad konva-react implementation
				break;
			}

		}
		this.setState({ open: false, boxes: copyArr });
		
	};
	/* DIALOG ENDS HERE */

	handleBoxMovement(){
		this.setState((prevState) => ({
			boxDraggable: !prevState.boxDraggable
		  }));
	}

	setInitialCoordinates(idx, e){
		let res = this.getStageOffset();
		let stageOffsetX = res[0];
		let stageOffsetY = res[1];
		this.setState({
			isMouseDown: false,
			inititalPos:{x:e.evt.clientX - stageOffsetX,y:e.evt.clientY - stageOffsetY}
		})
	}
	updateCoordinates(idx, e){
		console.log(this.refs["Parent" + idx.toString()].children[0].children[0].x());
		console.log(e.evt.clientX);

		// var copyArr = this.state.boxesforanchors.slice();
		var copyArr = JSON.parse(JSON.stringify(this.state.boxesforanchors));
		var i = 0;

		let res = this.getStageOffset();
		let stageOffsetX = res[0];
		let stageOffsetY = res[1];

		for (i = 0; i < copyArr.length; i++){
			if (copyArr[i].idx == idx ){
				copyArr[i].x += e.evt.clientX - this.state.inititalPos['x'] - stageOffsetX;
				copyArr[i].y += e.evt.clientY - this.state.inititalPos['y'] - stageOffsetY;
				break;
			}
		}
	
		if (this.state.boxDraggable) {
			this.setState({ isMouseDown: false, boxesforanchors: copyArr });
		} else {
			this.setState({ isMouseDown: false, boxDraggable: true });
			// this.state.boxDraggable = true;
		}
		
		console.log('===================0', copyArr)
		console.log("====================1", this.state.boxesforanchors)
		console.log("===================2", this.state.boxes)
		
	}
	anchorTest(key, idx, anchorNum, e){
		
		// console.log(idx);
		console.log("resizing");
		// console.log("anchorTest executed");
		// console.log(this.refs);
		anchorNum = 3;
		var topLeft = this.refs[idx].children[1];
        var topRight = this.refs[idx].children[2];
        var bottomRight = this.refs[idx].children[3];
		var bottomLeft = this.refs[idx].children[4];
		var image = this.refs[idx].children[0];


		let res = this.getStageOffset();
		let stageOffsetX = res[0];
		let stageOffsetY = res[1];

		var width = window.event.clientX - this.state.boxesforanchors[key].x - stageOffsetX;
		var height = window.event.clientY - this.state.boxesforanchors[key].y - stageOffsetY;
		console.log('comparison', topRight.getX(), window.event.clientX)
		console.log('width, height', width, height);
		
		if(width && height) {
			// image.width(width);
			// image.height(height);
			// var copyArr = this.state.boxesforanchors.slice();
			var copyArr = JSON.parse(JSON.stringify(this.state.boxesforanchors));
			// var anchorsCopy = this.state.boxesforanchors.slice();
			
			var i = 0;
			for (i = 0; i < copyArr.length; i++){
				if (copyArr[i].idx == idx ){
					copyArr[i].width = width;
					copyArr[i].height = height;

					
					break;
				}

			}
			console.log('copy',copyArr)
			console.log('===================jj',this.state.boxesforanchors)
			this.setState({isMouseDown: false, boxesforanchors: copyArr });
			console.log('=================kk',this.state.boxesforanchors)
		}
	
		
	}


	deployBox(e){
		// console.log(e.evt);
		// alert(e.evt.clientX+" "+e.evt.clientY);
		let xOffset = e.evt.clientX;
		let yOffset = e.evt.clientY;
		let stageOffsetY = ReactDOM.findDOMNode(this.refs['stage']).offsetTop - window.scrollY;
		let stageOffsetX = ReactDOM.findDOMNode(this.refs['stage']).offsetLeft - window.scrollX;
		this.setState((prevState) => ({
		  	boxes: prevState.boxes.concat({
				x:xOffset - stageOffsetX,
				y:yOffset - stageOffsetY,
				idx: this.state.idx,
				labelText: "Text Field",
				width: this.state.width,
				height: this.state.height,
				xOffset: xOffset - stageOffsetX,
				yOffset: yOffset - stageOffsetY,
			}),
			boxesforanchors: prevState.boxesforanchors.concat({
				x:xOffset - stageOffsetX,
				y:yOffset - stageOffsetY,
				idx: this.state.idx,
				labelText: "Text Field",
				width: this.state.width,
				height: this.state.height
			}),
		  idx: prevState.idx + 1,
		  anchorDraggable: true
		}));
		
		// console.log(window.evt.clientX+" "+window.evt.clientY);
	}

	changeText(e){
	
		this.setState({
			ModalText: e.target.value
		});
	
	}
	removeBox(idx){
	
		this.setState((prevState) => ({
		  boxes: prevState.boxes.filter(box => box.idx != idx),
		  boxesforanchors: prevState.boxesforanchors.filter(box => box.idx != idx)
		}));
		this.normalCursor();
	}

	test(t) {
		console.log('rect-x',t)
		return t;
	}

	viewState() {
		// this.refs["Parent0"].setX(0)
		// console.log(this.refs["Parent0"].getX())
		// let stageOffsetY = ReactDOM.findDOMNode(this.refs['stage']).offsetTop;
		// let stageOffsetX = ReactDOM.findDOMNode(this.refs['stage']).offsetLeft;
		this.props.checkStatusCallback();
		console.log('asdasdad',this.state.image.clientHeight);
		let res = this.getStageOffset();
		let stageOffsetX = res[0];
		let stageOffsetY = res[1];
		console.log('soff', stageOffsetX, stageOffsetY)
		// console.log('width', ReactDOM.findDOMNode(this.refs['stage']).clientWidth)

		let allFieldInfo = [];
		this.state.boxesforanchors.map((field, idx) => {
			let tempFieldObject = {};
			let stageOffsetY = ReactDOM.findDOMNode(this.refs['stage']).offsetTop;
			let stageOffsetX = ReactDOM.findDOMNode(this.refs['stage']).offsetLeft;
			let realX = this.refs["Parent" + field.idx.toString()].attrs['xoffset'] + this.refs["Parent" + field.idx.toString()].getX();
			let realY = this.refs["Parent" + field.idx.toString()].attrs['yoffset'] + this.refs["Parent" + field.idx.toString()].getY();
			let realWidth = field.width;
			let realHeight = field.height;
			tempFieldObject = {
				x: realX,
				y: realY,
				width: realWidth,
				height: realHeight,
				labelText: field.labelText,	
			}
			allFieldInfo.push(tempFieldObject);

		})
		console.log(allFieldInfo)
		console.log('state', this.state)
		// console.log('stage', stageOffsetX, stageOffsetY)
		// let realX = this.refs["Parent0"].attrs['xoffset'] + this.refs["Parent0"].getX() - stageOffsetX;
		// let realY = this.refs["Parent0"].attrs['yoffset'] + this.refs["Parent0"].getY() - stageOffsetY;
		// console.log('----------------',realX, realY)
		// console.log('getx, gety', this.refs["Parent0"].getX(), this.refs["Parent0"].getY())
		// console.log(this.state)
	}

	getStageOffset = () => {
		let stageOffsetY = ReactDOM.findDOMNode(this.refs['stage']).offsetTop - window.scrollY;
		let stageOffsetX = ReactDOM.findDOMNode(this.refs['stage']).offsetLeft - window.scrollX;
		return [stageOffsetX, stageOffsetY];
	}

	sendCoordinates = () => {
		console.log("sending ---")

		let res = this.getStageOffset();
		let stageOffsetX = res[0];
		let stageOffsetY = res[1];
		console.log('soff', stageOffsetX, stageOffsetY)

		let allFieldInfo = [];
		this.state.boxesforanchors.map((field, idx) => {
			let tempFieldObject = {};
			let stageOffsetY = ReactDOM.findDOMNode(this.refs['stage']).offsetTop;
			let stageOffsetX = ReactDOM.findDOMNode(this.refs['stage']).offsetLeft;
			let realX = this.refs["Parent" + field.idx.toString()].attrs['xoffset'] + this.refs["Parent" + field.idx.toString()].getX();
			let realY = this.refs["Parent" + field.idx.toString()].attrs['yoffset'] + this.refs["Parent" + field.idx.toString()].getY();
			let realWidth = field.width;
			let realHeight = field.height;
			tempFieldObject = {
				// x: realX/ReactDOM.findDOMNode(this.refs['stage']).clientWidth,
				// y: realY/ReactDOM.findDOMNode(this.refs['stage']).clientHeight,
				// width: realWidth/ReactDOM.findDOMNode(this.refs['stage']).clientWidth,
				// height: realHeight/ReactDOM.findDOMNode(this.refs['stage']).clientHeight,
				x: realX * this.state.originalWidth/this.state.imageWidth,
				y: realY * this.state.originalHeight/this.state.imageHeight,
				width: realWidth * this.state.originalWidth/this.state.imageWidth,
				height: realHeight * this.state.originalHeight/this.state.imageHeight,
				labelText: field.labelText,	
			}
			allFieldInfo.push(tempFieldObject);
		})

		console.log(this.props.imagePath, allFieldInfo)
		// window.client.invoke('testCropping', this.props.imagePath, allFieldInfo, (error, res) => {
		// 	console.log(res, error);
		// 	if (error) {
		// 		console.log(error);
		// 	} else {
		// 		console.log(res);
		// 	}
		// })
		this.props.checkStatusCallback();
		window.client.invoke('makePredictions', this.props.imagePath, allFieldInfo, (error, res) => {
			console.log(res, error);
			if (error) {
				console.log(error);
			} else {
				console.log(res);
			}
		})
	}

	render(){
		const {classes} = this.props;
		console.log(classes)	
		
		const renderedBoxes = this.state.boxes.map((box, key)=>
			<Group ref={"Parent" + box.idx.toString()} 
				xoffset={box.xOffset} yoffset={box.yOffset} key={box.idx} draggable={this.state.boxDraggable} onDragStart={e => this.setInitialCoordinates(box.idx, e)} onDragEnd={e => this.updateCoordinates(box.idx, e)}>
			
			<Group ref={box.idx.toString()}>
				<Rect x={box.x} y={box.y} 
				onMouseEnter={this.dragCursor}
				onMouseLeave={this.normalCursor}
				onClick={(e) => this.removeBox(box.idx)} width={this.state.boxesforanchors[key].width} height={this.state.boxesforanchors[key].height} stroke={'black'} strokeWidth={2}/>
				<Circle
					onDragStart = {(e)=>{this.anchorTest(box.idx.toString(), 1, e);}}
					onDragEnd={this.handleAnchorMovement}
					x={box.x}
					y={box.y}
					name={'topLeft'}
					stroke={'gray'}
					strokeWidth={4}
					radius={3}
					visible={false}

				/>
				<Circle
					onDragMove = {(e)=>this.anchorTest(box.idx.toString(), 2, e)}
					x={box.x+box.width}
					y={box.y}
					stroke={'gray'}
					strokeWidth={4}
					radius={3}
					visible={false}
										
				/>
				<Circle
					onMouseEnter={this.resizeCursor}
					onMouseLeave={this.normalCursor}
					onMouseUp={this.stopMeasuring}
					onDragStart = {() => {this.state.boxDraggable = false;}}
					onDragMove = {(e)=>{this.anchorTest(key, box.idx.toString(), 3, e); }}
					x={box.x+this.state.boxesforanchors[key].width}
					y={box.y+this.state.boxesforanchors[key].height}
					stroke={'gray'}
					strokeWidth={4}
					radius={5}
					fill={'black'}
					draggable={true}							
				/>
				
				<Circle
					onDragMove = {(e)=>this.anchorTest(box.idx.toString(), 4, e)}
					x={box.x}
					y={box.y+this.state.boxesforanchors[key].height}
					stroke={'gray'}
					strokeWidth={4}
					radius={3}
					visible={false}
											
				/>
				
			</Group>
			<Label text={box.labelText} listening={true} onClick={(e) => this.handleClickOpen(box.idx, box.labelText)} x={box.x+30} y={box.y} opacity={0.7}>
			<Tag fill={'black'} pointerDirection={'down'} shadowColor={'black'} shadowBlur={10} shadowOffset={10} shadowOpacity={0.5} pointerWidth={(this.state.boxesforanchors[key].width/2)} pointerHeight={0} lineJoin={'round'} />
			<Text text={box.labelText} fontFamily={'Calibri'} fontSize={16} padding={5} fill={'white'}/>
			</Label>
			</Group>
		);
		return(
			<div >
				<Toolbar>
					<Button raised color="primary" onClick={this.sendCoordinates}>Begin Processing</Button>
				</Toolbar>


				<Stage ref="stage" width={this.state.imageWidth} height={this.state.imageHeight} >
					<Layer>
					<Image listening={true} 
					image={this.state.image} 
					onMouseDown={(e)=>{this.setState({
						xOffset: e.evt.clientX,
						yOffset: e.evt.clientY,
						isMouseDown: true})}}
					onMouseMove={(e)=>{
						if (this.state.isMouseDown)
							this.startMeasuring(e)}}
					onMouseUp={this.stopMeasuring}
					x={0} y={0} width={this.state.imageWidth} height={this.state.imageHeight} stroke={'black'} strokeWidth={6} />
							
							{renderedBoxes}
							
					</Layer>
				</Stage>
				<input type="button" onClick={this.viewState.bind(this)} value="STATE"/>
				<button onClick={()=>{console.log(this.state.boxesforanchors)}}>PRINT boxesforanchors</button>
				<Dialog
					open={this.state.open}
					onClose={this.handleClose}
					aria-labelledby="form-dialog-title"
					>
					<DialogTitle id="form-dialog-title">Enter Label</DialogTitle>
					<DialogContent>
						<DialogContentText>
						Please Enter the label for your selection
						</DialogContentText>
						<TextField
						onChange={this.changeText}
						autoFocus
						margin="dense"
						id="name"
						value={this.state.ModalText}
						label="Label"
						type="text"
						fullWidth
						/>
	
					</DialogContent>
					<DialogActions>
						<Button onClick={this.handleClose} color="primary">
						Cancel
						</Button>
						<Button onClick={this.handleCloseAndSetLabel} color="primary">
						Set Label
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	}


}



export default withStyles(styles)(AreaSelector);