import React, {Component} from 'react';
import {withStyles} from 'material-ui/styles';
import List, {ListItem, ListItemText} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import FolderIcon from 'material-ui-icons/Folder';
import ReplyIcon from 'material-ui-icons/Reply';
import InsertDriveFileIcon from 'material-ui-icons/InsertDriveFile';
import Typography from 'material-ui/Typography';
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';

import Dialog, { DialogTitle } from 'material-ui/Dialog';
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';

// import { mailFolderListItems, otherMailFolderListItems } from './tileData';

const styles = theme => ({
  root: {
    width: '100%',
    // maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    textAlign: 'left'
  },
  highlight_btn: {
    // float: 'right',
    // marginLeft: 'auto',
  },
  toolbar: {
    // display: 'flex',
    
  }
});

class FileExplorer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currDir: '',
      dirList: [],
      modalOpen: false,
      modalImage: '',
      modalImageHeight: '50px',
      modalImageWidth: '50px'
    }

    this.changePath = this
      .changePath
      .bind(this);
    this.handleBack = this
      .handleBack
      .bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {

    window
      .client
      .invoke("getProjectDirPath", (error, res) => {
        if (error) {
          console.log(error);
        } else {
          this.setState({
            currDir: res
          }, () => {
            this.updatePath();
          });
        }
      })
      console.log(this.state)
  }

  updatePath() {
    window
      .client
      .invoke("getCurrDir", this.state.currDir, (error, res) => {
        if (error) {
          console.error(error)
        } else {
          console.log(res);
          // Sort by item type
          res.sort((a, b) => {
            if (a.type > b.type) 
              return 1;
            else 
              return -1;
            }
          )
          this.setState({dirList: res});
        }
      })
  }

  changePath(path, type) {
    if (type === 'dir') {
      this.setState({
        currDir: path
      }, () => {
        this.updatePath();
      })
    } else {
      window.client.invoke("displayImage", path, (error, res) => {
        if (error) {
          console.log(error);
        } else {
          let imgHeight = res['height'];
          let imgWidth = res['width'];

          // Resizing the image to fit screen
          if (imgHeight > (window.innerHeight*0.9)) {
            imgWidth = (window.innerHeight*0.9) * imgWidth/imgHeight;
            imgHeight = (window.innerHeight*0.9);
          }
          if (imgWidth > 600) {
            imgHeight = 600 * imgHeight/imgWidth;
            imgWidth = 600;
          }

          let img = res['encoded_img'].toString('base64');
          this.setState({
            modalImage: 'data:;base64,'+img,
            modalImageHeight: imgHeight,
            modalImageWidth: imgWidth
          })
        }
        
      })
      this.setState({
        modalOpen: true,
      })
    }
  }

  handleBack() {
    window
      .client
      .invoke("traverseUp", this.state.currDir, (error, res) => {
        if (error) {
          console.log(error);
        } else {
          this.setState({
            currDir: res
          }, () => {
            this.updatePath();
          })
        }
      })
  }

  closeModal() {
    this.setState({
      modalOpen: false,
    })
  }

  render() {
    const {classes} = this.props;

    return (
      <div className={classes.root}>

        <Toolbar className={classes.toolbar}>
          {/* <ToolbarGroup> */}
            {/* <ToolbarTitle text="Options" /> */}
            {/* <FontIcon className="muidocs-icon-custom-sort" /> */}
            {/* <ToolbarSeparator /> */}
            <Button label="Create Broadcast" raised color="primary" className={classes.highlight_btn} onClick={() => this.props.startCallback(this.state.currDir)}>Use this directory</Button>
            {/* <IconMenu
              iconButtonElement={
                <IconButton touch={true}>
                  <NavigationExpandMoreIcon />
                </IconButton>
              }
            >
              <MenuItem primaryText="Download" />
              <MenuItem primaryText="More Info" />
            </IconMenu> */}
          {/* </ToolbarGroup> */}
        </Toolbar>

        <List>
          <ListItem button onClick={this.handleBack}>
            <Avatar>
              <ReplyIcon/>
            </Avatar>
            <ListItemText primary=".."/>
          </ListItem>
          {this
            .state
            .dirList
            .map((item, index) => (
              <ListItem
                button
                key={index}
                onClick={this
                .changePath
                .bind(this, item.full_path, item.type)}>
                <Avatar>
                  {item.type === 'dir'
                    ? <FolderIcon/>
                    : <InsertDriveFileIcon/>}
                </Avatar>
                <ListItemText primary={item.name}/>
              </ListItem>
            ))}

          <Dialog onClose={this.closeModal} open={this.state.modalOpen} style={{maxWidth: 'none'}}>
            <Card>
              <CardMedia
                className={classes.media}
                image={this.state.modalImage}
                title="Contemplative Reptile"
                style={{height: this.state.modalImageHeight, width: this.state.modalImageWidth}}
              />
              <CardContent>
                <Typography variant="headline" component="h2">
                  Image
                </Typography>
              </CardContent>
            </Card>
          </Dialog>
        </List>
      </div>
    );
  }
}

export default withStyles(styles)(FileExplorer);
