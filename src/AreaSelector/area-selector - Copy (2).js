import React, {Component} from 'react';
import { render } from 'react-dom';
import { Stage, Layer, Rect, Label, Tag, Group, Text, Circle } from 'react-konva';
import Konva from 'konva';
import './area-selector.css';
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
import Select from 'material-ui/Select';
import Input, { InputLabel } from 'material-ui/Input';
class AreaSelector extends Component {

	constructor(props){
		super(props);
		this.state={
			width: 70,
			height: 40,
			open: false,
			boxes: [],
			boxesforanchors: [],
			idx: 0,
			age: '',
			ModalText: "Text Value",
			ModalOpenedIdx: 0,
			inititalPos:{x:0,y:0},
			boxDraggable: true
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
		this.setState({ open: false });
	};

	handleCloseAndSetLabel = () => {

		var copyArr = this.state.boxes;
		var i = 0;
		for (i = 0; i < copyArr.length; i++){
			if (copyArr[i].idx == this.state.ModalOpenedIdx ){
				copyArr[i].labelText = this.state.ModalText;
				break;
			}

		}
		this.setState({ open: false, boxes: copyArr });
		
	};
	/* DIALOG ENDS HERE */
	componentDidMount(){
		
	}
	handleBoxMovement(){
		this.setState((prevState) => ({
			boxDraggable: !prevState.boxDraggable
		  }));
	}

	setInitialCoordinates(idx, e){
		this.setState({
			inititalPos:{x:e.evt.clientX,y:e.evt.clientY}
		})
	}
	updateCoordinates(idx, e){
		console.log(this.refs["Parent" + idx.toString()].children[0].children[0].x());
		console.log(e.evt.clientX);

		var copyArr = this.state.boxesforanchors.slice();
		var i = 0;
		// // var x = this.refs["Parent" + idx.toString()].children[0].children[0].x();
		// // var y = this.refs["Parent" + idx.toString()].children[0].children[0].y();
		// // console.log(copyArr)
		// // alert("New coordinates are: " + x + ", " + y);
		// console.log('coord', e.target.getStage().getPointerPosition())
		// console.log('clientX', e.evt.clientX)
		// console.log('diff', this.refs[idx.toString()].x() - e.evt.clientX);
		// for (i = 0; i < copyArr.length; i++){
		// 	if (copyArr[i].idx == idx ){
		// 		copyArr[i].x += e.evt.clientX - e.target.getStage().getPointerPosition().x;
		// 		copyArr[i].y += e.evt.clientY - e.target.getStage().getPointerPosition().y;
		// 		// copyArr[i].y += e.evt.clientY - this.state.inititalPos.y;
		// 		break;
		// 	}

		// }

		for (i = 0; i < copyArr.length; i++){
			if (copyArr[i].idx == idx ){
				copyArr[i].x += e.evt.clientX - this.state.inititalPos['x'];
				copyArr[i].y += e.evt.clientY - this.state.inititalPos['y'];
				break;
			}

		}
		// console.log('refreal', this.refs["Parent" + idx.toString()].children[0].children[0])
		// // console.log('ref',this.refs[idx.toString()].position()['x']);
		// console.log('copyarr', copyArr)
		// console.log(this.state.boxes)
		if (this.state.boxDraggable) {
			this.setState({ boxesforanchors: copyArr });
		} else {
			this.state.boxDraggable = true;
		}
		
		console.log('===================0', copyArr)
		console.log("====================1", this.state.boxesforanchors)
		console.log("===================2", this.state.boxes)
		
	}
	anchorTest(idx, anchorNum, e){
		// console.log(idx);
		
		// console.log("anchorTest executed");
		// console.log(this.refs);
		anchorNum = 3;
		var topLeft = this.refs[idx].children[1];
        var topRight = this.refs[idx].children[2];
        var bottomRight = this.refs[idx].children[3];
		var bottomLeft = this.refs[idx].children[4];
		var image = this.refs[idx].children[0];



		
		
		// if (width < 10 || height < 10){
		// 	this.setState({
		// 		anchorDraggable: false
		// 	});
		// 	image.width(width+1);
		// 	image.height(height+1);

		// 	topRight.setY(topRight.getY());
		// 	topRight.setX(topRight.getX());
		// 	bottomLeft.setY(bottomLeft.getY());
		// 	bottomLeft.setX(bottomLeft.getX());
		// 	topLeft.setY(topLeft.getX());
		// 	topLeft.setX(topLeft.getY());
		// 	bottomRight.setY(bottomRight.getY());
		// 	bottomRight.setX(bottomRight.getX());
			
		// }
		
		// console.log(image);
		// update anchor positions
		// switch (anchorNum) {
		// 	case 1:
		// 		topRight.setY(window.event.clientY);
		// 		bottomLeft.setX(window.event.clientX);
		// 		image.x(topLeft.getX());
		// 		image.y(topLeft.getY());
		// 		break;
		// 	case 2:
		// 		topLeft.setY(window.event.clientY);
		// 		bottomRight.setX(window.event.clientX);
		// 		image.y(topRight.getY());
		// 		break;
		// 	case 3:
		// 		// bottomLeft.setY(window.event.clientY);
		// 		// topRight.setX(window.event.clientX);
		// 		break;
		// 	case 4:
		// 		bottomRight.setY(window.event.clientY);
		// 		topLeft.setX(window.event.clientX);
		// 		image.x(bottomLeft.getX());
		// 		break;
		// }
		
		// var width = topRight.getX() - topLeft.getX();
		var width = window.event.clientX - this.state.boxesforanchors[idx].x;
		var height = window.event.clientY - this.state.boxesforanchors[idx].y;
		console.log('comparison', topRight.getX(), window.event.clientX)
		console.log('width, height', width, height);
		
		if(width && height) {
			// image.width(width);
			// image.height(height);
			var copyArr = this.state.boxesforanchors.slice();
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
			this.setState({ boxesforanchors: copyArr });
			console.log('=================kk',this.state.boxesforanchors)
		}
	
		
	}


	deployBox(e){
		// console.log(e.evt);
		// alert(e.evt.clientX+" "+e.evt.clientY);
		this.setState((prevState) => ({
		  	boxes: prevState.boxes.concat({
				x:e.evt.clientX,
				y:e.evt.clientY,
				idx: this.state.idx,
				labelText: "Text Field",
				width: this.state.width,
				height: this.state.height
			}),
			boxesforanchors: prevState.boxesforanchors.concat({
				x:e.evt.clientX,
				y:e.evt.clientY,
				idx: this.state.idx,
				labelText: "Text Field",
				width: this.state.width,
				height: this.state.height
			}),
		  idx: prevState.idx + 1,
		  anchorDraggable: true
		}));
		for(var m = 0; m < this.state.boxesforanchors.length; m ++){
			console.log(this.state.boxesforanchors[m].x);
		}
		// console.log(window.evt.clientX+" "+window.evt.clientY);
	}

	changeText(e){
	
		this.setState({
			ModalText: e.target.value
		});
	
	}
	removeBox(idx){
	
		this.setState((prevState) => ({
		  boxes: prevState.boxes.filter(box => box.idx != idx)
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
		console.log(this.state)
	}

	render(){
		
		const renderedBoxes = this.state.boxes.map((box, key)=>
			<Group ref={"Parent" + box.idx.toString()} key={box.idx} draggable={this.state.boxDraggable} onDragStart={e => this.setInitialCoordinates(box.idx, e)} onDragEnd={e => this.updateCoordinates(box.idx, e)}>
			{/* <Group ref={"Parent" + box.idx.toString()} key={box.idx} draggable={this.state.boxDraggable} > */}
			<Group ref={box.idx.toString()}>
				<Rect x={box.x} y={box.y} 
				onMouseEnter={this.dragCursor}
				onMouseLeave={this.normalCursor}
				onClick={(e) => this.removeBox(box.idx)} width={this.state.boxesforanchors[key].width} height={this.state.boxesforanchors[key].height} stroke={'black'} strokeWidth={2}/>
				<Circle
					onDragMove = {(e)=>{this.anchorTest(box.idx.toString(), 1, e);}}
					onDragEnd={this.handleAnchorMovement}
					x={box.x}
					y={box.y}
					name={'topLeft'}
					stroke={'gray'}
					strokeWidth={4}
					radius={3}
					visible={true}
									
				/>
				<Circle
					onDragMove = {(e)=>this.anchorTest(box.idx.toString(), 2, e)}
					x={box.x+box.width}
					y={box.y}
					stroke={'gray'}
					strokeWidth={4}
					radius={3}
					visible={true}
										
				/>
				<Circle
					onMouseEnter={this.resizeCursor}
					onMouseLeave={this.normalCursor}
					onDragStart = {() => {this.state.boxDraggable = false;}}
					onDragMove = {(e)=>{this.anchorTest(box.idx.toString(), 3, e); }}
					x={box.x+this.state.boxesforanchors[key].width}
					y={box.y+this.state.boxesforanchors[key].height}
					stroke={'gray'}
					strokeWidth={4}
					radius={3}
					
					draggable={true}							
				/>
				
				<Circle
					onDragMove = {(e)=>this.anchorTest(box.idx.toString(), 4, e)}
					x={box.x}
					y={box.y+box.height}
					stroke={'gray'}
					strokeWidth={4}
					radius={3}
					visible={true}
											
				/>
				
			</Group>
			<Label text={box.labelText} listening={true} onClick={(e) => this.handleClickOpen(box.idx, box.labelText)} x={box.x+(box.width/2)} y={box.y} opacity={0.7}>
			<Tag fill={'black'} pointerDirection={'down'} shadowColor={'black'} shadowBlur={10} shadowOffset={10} shadowOpacity={0.5} pointerWidth={20} pointerHeight={28} lineJoin={'round'} />
			<Text text={box.labelText} fontFamily={'Calibri'} fontSize={12} padding={5} fill={'white'}/>
			</Label>
			</Group>
		);
		return(
			<div>
				<Stage ref="stage" width={window.innerWidth} height={window.innerHeight}>
					<Layer>

							<Rect onClick={this.deployBox} x={0} y={0} width={window.innerWidth} height={window.innerHeight} fill={'#fafafa'} stroke={'black'} strokeWidth={6} />
							
							{renderedBoxes}
							
					</Layer>
							
				</Stage>
				<input type="button" onClick={this.viewState.bind(this)} value="STATE"/>
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
						<InputLabel htmlFor="age-helper">Type</InputLabel>
							<Select	
								value={this.state.age}
								onChange={this.handleChange}
								input={<Input name="age" id="age-helper" />}
							>
								<MenuItem value="">
								<em>None</em>
								</MenuItem>
								<MenuItem value={10}>String</MenuItem>
								<MenuItem value={20}>Number</MenuItem>
							</Select>
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



export default AreaSelector;