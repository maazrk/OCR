import {Component} from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { LinearProgress, CircularProgress } from 'material-ui/Progress';
import Typography from 'material-ui/Typography';


const styles = {
    root: {
    position: 'absolute',
    width: '30%',
    top: '50%',
    left: '50%',
    transform:'translate(-50%, -50%)'
      
    },

  };
  
  class ProgressLoader extends React.Component {

    constructor(props) {
      super(props);
      this.state = {

      }
    }

    calcProgress = () => {
      let p_name = this.props.loaderStatus['process'];
      let tot_files = this.props.loaderStatus['total_number_of_files'];
      let completed_files = this.props.loaderStatus['current_file_number'];

      let percent_completed = 0;
      if (tot_files !== 0) {
        percent_completed = (completed_files / tot_files) * 100;
      }
      return percent_completed;
    }
  
    componentDidMount() {
      
    }
  
    componentWillUnmount() {
      clearInterval(this.timer);
    }
  
    timer = null;
  
    progress = () => {
      const { completed } = this.state;
      if (completed === 100) {
        this.setState({ completed: 0 });
      } else {
        const diff = Math.random() * 10;
        this.setState({ completed: Math.min(completed + diff, 100) });
      }
    };
  
    render() {
      const { classes } = this.props;
      return (
        <div className={classes.root}>
          <CircularProgress variant="determinate" size={70} />
          <br />
          <br />
          <br />
          <LinearProgress mode="determinate" value={this.calcProgress()} />
          <br />
          <br />
          <Typography> 
              {this.props.loaderStatus['process']}
          </Typography>
        </div>
      );
    }
  }

  
  export default withStyles(styles)(ProgressLoader);