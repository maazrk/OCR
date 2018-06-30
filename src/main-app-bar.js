import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import List, {ListItem, ListItemText} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import { MenuItem } from 'material-ui/Menu';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';
import ChevronRightIcon from 'material-ui-icons/ChevronRight';
import Button from 'material-ui/Button';
import { Link } from 'react-router-dom'
// import { mailFolderListItems, otherMailFolderListItems } from './tileData';

import ReplyIcon from 'material-ui-icons/Reply';
import FolderIcon from 'material-ui-icons/Folder';
import TextFields from 'material-ui-icons/TextFields';
import AspectRatio from 'material-ui-icons/AspectRatio';

import { withRouter } from 'react-router-dom'

const drawerWidth = 240;

const styles = theme => ({
  root: {
    width: '100%',
    // minHeight: '100vh',
    overflow: 'scroll',
    // marginTop: theme.spacing.unit * 3,
    zIndex: 1,
    overflow: 'hidden',
  },
  flexTypo: {
    flex: 1,
    textAlign: 'left',
  },
  actionButton: {
    marginRight: 12,
  },
  appFrame: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  appBar: {
    position: 'absolute',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  'appBarShift-left': {
    marginLeft: drawerWidth,
  },
  'appBarShift-right': {
    marginRight: drawerWidth,
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    position: 'relative',
    height: '100%',
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    width: '100%',
    minHeight: '100vh',
    overflow: 'scroll',
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    height: 'calc(100% - 56px)',
    marginTop: 56,
    [theme.breakpoints.up('sm')]: {
      content: {
        height: 'calc(100% - 64px)',
        marginTop: 64,
      },
    },
  },
  'content-left': {
    marginLeft: -drawerWidth,
  },
  'content-right': {
    marginRight: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  'contentShift-left': {
    marginLeft: 0,
  },
  'contentShift-right': {
    marginRight: 0,
  },
});

class PersistentDrawer extends React.Component {
  state = {
    open: false,
    anchor: 'left',
  };

  constructor(props) {
      super(props);
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleChangeAnchor = event => {
    this.setState({
      anchor: event.target.value,
    });
  };

  render() {
    const { classes, theme } = this.props;
    const { anchor, open } = this.state;

    const drawer = (
      <Drawer
        type="persistent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor={anchor}
        open={open}
      >
        <div className={classes.drawerInner}>
          <div className={classes.drawerHeader}>
            <IconButton onClick={this.handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </div>
          <Divider />
          {/* <List className={classes.list}>{mailFolderListItems}</List> */}
          <Link to='/'>
            <ListItem button onClick={this.handleBack}>
              <Avatar>
                <FolderIcon/>
              </Avatar>
              <ListItemText primary="File Explorer"/>
            </ListItem>
          </Link>
          <Link to='/field-selection'>
            <ListItem button onClick={this.handleBack}>
              <Avatar>
                <TextFields/>
              </Avatar>
              <ListItemText primary="Field Selection"/>
            </ListItem>
          </Link>
          <Link to='/output-view'>
            <ListItem button onClick={this.handleBack}>
              <Avatar>
                <AspectRatio/>
              </Avatar>
              <ListItemText primary="Output"/>
            </ListItem>
          </Link>
          <Divider />
          {/* <List className={classes.list}>{otherMailFolderListItems}</List> */}
        </div>
      </Drawer>
    );

    let before = null;
    let after = null;

    if (anchor === 'left') {
      before = drawer;
    } else {
      after = drawer;
    }

    return (
      <div className={classes.root}>
        <div className={classes.appFrame}>
          <AppBar
            className={classNames(classes.appBar, {
              [classes.appBarShift]: open,
              [classes[`appBarShift-${anchor}`]]: open,
            })}
          >
            <Toolbar disableGutters={!open}>
              <IconButton
                color="contrast"
                aria-label="open drawer"
                onClick={this.handleDrawerOpen}
                className={classNames(classes.menuButton, open && classes.hide)}
              >
                <MenuIcon />
              </IconButton>
              <Typography type="title" color="inherit" noWrap className={classes.flexTypo}>
                OCR
              </Typography>
              {/* <Button color="inherit" className={classes.actionButton}>Save Data</Button> */}
            </Toolbar>
          </AppBar>
          {drawer}
          <main
            className={classNames(classes.content, classes[`content-${anchor}`], {
              [classes.contentShift]: open,
              [classes[`contentShift-${anchor}`]]: open,
            })}
          >

            {/* Main content */}
            {this.props.children}
            {/* <Typography>{'...'}</Typography> */}
          </main>
{/* 
          <Drawer
            variant="permanent"
            classes={{
              paper: classes.drawerPaper,
            }}
            anchor={anchor}
          >
            <div className={classes.drawerHeader} />
            <Divider />
            <List>
              <ListItem button onClick={this.handleBack}>
                <Avatar>
                  <ReplyIcon/>
                </Avatar>
              <ListItemText primary=".."/>
            </ListItem>
            </List>
            <Divider />
          </Drawer> */}
        </div>
      </div>
    );
  }
}

PersistentDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles, { withTheme: true })(PersistentDrawer));