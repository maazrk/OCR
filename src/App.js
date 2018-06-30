import React, { Component } from 'react';



// import { mailFolderListItems, otherMailFolderListItems } from './tileData';

import PersistentDrawer from './main-app-bar';
import FileExplorer from './FileExplorer/file-explorer';
import OutputView from './output-view';
import { Switch, Route } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom'
import AreaSelector from './AreaSelector/area-selector';
import ProgressLoader from './ProgressLoader/progress-loader';
import './App.css';

import TestComponent from './test';


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currDir: '',
      dirList: [],
      currPath: '',
      opCsvFile: '/media/groot/Data_and_Games/Projects/ComputerVision/deepblue/test/electron-python-example/.temp_data/test.csv',
      path: '/',
      fieldSelectionImagePath: '/media/groot/Data_and_Games/Projects/ComputerVision/deepblue/test/electron-python-example/demo_inputs/print/print_1.jpg',
      loaderStatus: {
        process: 'Loading the Nets!',
        total_number_of_files: 1,
        current_file_number: 0
      }
    }
  }

  componentDidMount() {

  }

  startProcessing = (path) => {
    this.setState({
      currPath: path,
    })
    console.log('his', this.props)
    window.client.invoke('readAndReturnFirstImage', path, (error, res) => {
      if (error) {
        console.log(error);
      } else {
        console.log(res)
        this.setState({
          fieldSelectionImagePath: res[1],
        }, () => {
          console.log(this.props.history)
          this.props.history.push('field-selection');
        })
      }
    })
  }

  startCheckingStatus = () => {

    this.props.history.push('loader');
    var healthCheck = setInterval(() => {
      window.client.invoke('getStatus', (error, res) => {
        if (error) {
          console.log(error);
        } else {
          console.log(res);
          if (res['process'] === 'Completed') {
            console.log(res['op_file']);
            clearInterval(healthCheck);
            
            this.setState({
              opCsvFile: res['op_file'],
            }, () => {
              this.props.history.push('output-view');
            })

          } else {
            console.log('running', this.state);
            this.setState({
              loaderStatus: res,
            })
          }
        }
      })
    }, 1000)
    
  }


  render() {
    const { classes } = this.props;

    return (
      <div className="main-app">
        {/* <BrowserRouter> */}
          <PersistentDrawer>
            {/* <Switch> */}
              <Route exact path='/' render={(props) => (
                <FileExplorer {...props} startCallback={this.startProcessing}/>
              )}/>
              <Route path='/output-view' render={(props) => (
                <OutputView {...props} csvPath={this.state.opCsvFile} />
              )}/>
              <Route path='/field-selection' render={(props) => (
                <AreaSelector {...props} imagePath={this.state.fieldSelectionImagePath} checkStatusCallback={this.startCheckingStatus}/>
              )}/>
              <Route path='/loader' render={(props) => (
                <ProgressLoader {...props} loaderStatus={this.state.loaderStatus}/>
              )} />
              {/* <AreaSelector /> */}
              {/* <FileExplorer startCallback={this.startProcessing}/> */}
              {/* <OutputView csvPath={this.state.opCsvFile} /> */}
              {/* <TestComponent /> */}
            {/* </Switch> */}
          </PersistentDrawer>
        {/* </BrowserRouter> */}
      </div>
    );
  }
}

export default App;
