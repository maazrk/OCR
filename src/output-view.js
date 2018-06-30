import React from 'react';
import {
  SortingState, EditingState, PagingState,
  IntegratedPaging, IntegratedSorting,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table, TableHeaderRow, TableEditRow, TableEditColumn,
  PagingPanel, DragDropProvider, TableColumnReordering,
} from '@devexpress/dx-react-grid-material-ui';
import Paper from 'material-ui/Paper';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Input from 'material-ui/Input';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import { TableCell } from 'material-ui/Table';

import DeleteIcon from 'material-ui-icons/Delete';
import EditIcon from 'material-ui-icons/Edit';
import SaveIcon from 'material-ui-icons/Save';
import CancelIcon from 'material-ui-icons/Cancel';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';
import Typography from 'material-ui/Typography';

import Toolbar from 'material-ui/Toolbar';


// import {
//   ProgressBarCell,
// } from '../../../theme-sources/material-ui/components/progress-bar-cell';
// import {
//   HighlightedCell,
// } from '../../../theme-sources/material-ui/components/highlighted-cell';

// import {
//   generateRows,
//   globalSalesValues,
// } from '../../../demo-data/generator';

const styles = theme => ({
  lookupEditCell: {
    paddingTop: theme.spacing.unit * 0.875,
    paddingRight: theme.spacing.unit,
    paddingLeft: theme.spacing.unit,
  },
  dialog: {
    width: 'calc(100% - 16px)',
  },
  inputRoot: {
    width: '100%',
  },
});

const AddButton = ({ onExecute }) => (
  <div style={{ textAlign: 'center' }}>
    <Button
      color="primary"
      onClick={onExecute}
      title="Create new row"
    >
      New
    </Button>
  </div>
);

const EditButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} title="Edit row">
    <EditIcon />
  </IconButton>
);

const DeleteButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} title="Delete row">
    <DeleteIcon />
  </IconButton>
);

const CommitButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} title="Save changes">
    <SaveIcon />
  </IconButton>
);

const CancelButton = ({ onExecute }) => (
  <IconButton color="accent" onClick={onExecute} title="Cancel changes">
    <CancelIcon />
  </IconButton>
);

const commandComponents = {
  add: AddButton,
  edit: EditButton,
  delete: DeleteButton,
  commit: CommitButton,
  cancel: CancelButton,
};

const Command = ({ id, onExecute }) => {
  const CommandButton = commandComponents[id];
  return (
    <CommandButton
      onExecute={onExecute}
    />
  );
};



/*
  Code that handles table values that are based on MenuSelect
*/

// const availableValues = {
// //   product: globalSalesValues.product,
//   product: ["a", "b"],
// //   region: globalSalesValues.region,
//   region: ["a", 'a'],
//   // customer: globalSalesValues.customer,
//   customer: ["a", "b"],
// };

// const LookupEditCellBase = ({
//   availableColumnValues, value, onValueChange, classes,
// }) => (
//   <TableCell
//     className={classes.lookupEditCell}
//   >
//     <Select
//       value={value}
//       onChange={event => onValueChange(event.target.value)}
//       input={
//         <Input
//           classes={{ root: classes.inputRoot }}
//         />
//       }
//     >
//       {availableColumnValues.map(item => (
//         <MenuItem key={item} value={item}>{item}</MenuItem>
//       ))}
//     </Select>
//   </TableCell>
// );
// export const LookupEditCell = withStyles(styles, { name: 'ControlledModeDemo' })(LookupEditCellBase);

const Cell = (props) => {
  if (props.column.name === 'imageLink') {
    return <Table.Cell ><Button color='primary' onClick={() => props.onImgshowhandler(props.row.imageLink['path'])}>{props.row.imageLink['name']}</Button></Table.Cell>
  }
  if (props.column.name === 'discount') {
    // return <ProgressBarCell {...props} />;
  }
  if (props.column.name === 'amount') {
    // return <HighlightedCell {...props} />;
  }
  console.log(props)
  return <Table.Cell {...props} />;
};

const EditCell = (props) => {
  // const availableColumnValues = availableValues[props.column.name];
  // if (availableColumnValues) {
  //   return <LookupEditCell {...props} availableColumnValues={availableColumnValues} />;
  // }
  if (props.column.name === 'imageLink') {
    return <TableEditRow.Cell value={props.row.imageLink['name']} onValueChange={() => {}}/>;
  }
  return <TableEditRow.Cell {...props} />;
};

const getRowId = row => row.id;

class OutputView extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { name: 'imageLink', title: 'Image' },
        { name: 'FirstName', title: 'First Name' },
        { name: 'LastName', title: 'LastName' },
        { name: 'Age', title: 'Age' },
        { name: 'DOB', title: 'DOB' },
      ],
      tableColumnExtensions: [
        { columnName: 'amount', align: 'right' },
      ],
      // rows: generateRows({
      //   columnValues: { id: ({ index }) => index, ...globalSalesValues },
      //   length: 12,
      // }),
      rows: [
        {id: 1, imageLink: {name: 'image_1', path: '/media/groot/Data_and_Games/Projects/ComputerVision/deepblue/test/electron-python-example/.temp_data/bw.png'}, FirstName: 'Ron', LastName: 'Baggins', Age: '21', DOB: '12 dec'},
        {id: 2, imageLink: {name: 'image_2', path: '/media/groot/Data_and_Games/Projects/ComputerVision/deepblue/test/electron-python-example/.temp_data/bw.png'}, FirstName: 'Shaun', LastName: 'Laggins', Age: '18', DOB: '13 dec'}
      ],
      sorting: [],
      editingRowIds: [],
      addedRows: [],
      rowChanges: {},
      currentPage: 0,
      deletingRows: [],
      pageSize: 0,
      pageSizes: [5, 10, 0],
      columnOrder: ['imageLink', 'Name', 'FirstName', 'LastName', 'Age', 'DOB'],
      modalOpen: false,
    };

    this.changeSorting = sorting => this.setState({ sorting });
    this.changeEditingRowIds = editingRowIds => this.setState({ editingRowIds });
    this.changeAddedRows = addedRows => this.setState({
      addedRows: addedRows.map(row => (Object.keys(row).length ? row : {
        // amount: 0,
        // discount: 0,
        // saleDate: new Date().toISOString().split('T')[0],
        // product: availableValues.product[0],
        // region: availableValues.region[0],
        // customer: availableValues.customer[0],
      })),
    });
    this.changeRowChanges = rowChanges => this.setState({ rowChanges });
    this.changeCurrentPage = currentPage => this.setState({ currentPage });
    this.changePageSize = pageSize => this.setState({ pageSize });
    this.commitChanges = ({ added, changed, deleted }) => {
      let { rows } = this.state;
      if (added) {
        const startingAddedId = (rows.length - 1) > 0 ? rows[rows.length - 1].id + 1 : 0;
        rows = [
          ...rows,
          ...added.map((row, index) => ({
            id: startingAddedId + index,
            ...row,
          })),
        ];
      }
      if (changed) {
        rows = rows.map(row => (changed[row.id] ? { ...row, ...changed[row.id] } : row));
      }
      this.setState({ rows, deletingRows: deleted || this.state.deletingRows });
    };
    this.cancelDelete = () => this.setState({ deletingRows: [] });
    this.deleteRows = () => {
      const rows = this.state.rows.slice();
      this.state.deletingRows.forEach((rowId) => {
        const index = rows.findIndex(row => row.id === rowId);
        if (index > -1) {
          rows.splice(index, 1);
        }
      });
      this.setState({ rows, deletingRows: [] });
    };
    this.changeColumnOrder = (order) => {
      this.setState({ columnOrder: order });
    };

    // Retrieve and display the image
    this.showImage = (path) => {
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

    this.closeModal = () => {
      this.setState({
        modalOpen: false,
      })
    }

    this.saveCsvData = this.saveCsvData.bind(this);
  }

  generateColumnName(name) {
    return name.replace(' ', '');
  }

  getCsvData(path) {
    /*
      Retrieve csv data as a 2-d array and update column, columnOrder and rows from the 'state'
    */

    window.client.invoke('sendCsvData', path, (error, res) => {
      if (error) {
        console.log(error)
      } else {

        // Update columns and columnOrder
        let newColumns = [
          { name: 'imageLink', title: 'Image' }          
        ];
        let newColumnOrder = ['imageLink']
        res[0].slice(2).map((val, idx) => {

          // CHANGE this
          // if (idx%2 === 0) {
            // if (this.state.columns.length >= idx+1) {
              let tempColObj = { name: val, title: val }
              newColumns.push(tempColObj)
              newColumnOrder.push(val);
            // }
          // }
          
        })
        this.setState({
          columns: newColumns,
          columnOrder: newColumnOrder,
        })

        // Update rows data
        let newRows = [];
        res.slice(1).map((csvRow, idx) => {
          let tempRow = {}
          tempRow['id'] = idx;
          tempRow['imageLink'] = {
            name: csvRow[0],
            path: csvRow[1]
          }
          csvRow.slice(2).map((val, colIdx) => {

            // TODO Change this
            console.log('val',val, colIdx+1, this.state.columns.length)
            // if (colIdx%2 === 0) {
              console.log(this.state.columns.length, colIdx)
              if (this.state.columns.length >= colIdx+1) {
                console.log('output', this.state.columns[colIdx+1], val, this.state.columns, colIdx+1)
                tempRow[this.state.columns[colIdx+1].name] = val;
              }
            // }
            
          })
          newRows.push(tempRow);
        })
        this.setState({
          rows: newRows,
        })
      }
    })
  }

  saveCsvData() {

    window.client.invoke('saveCsvData', this.state.columnOrder, this.state.rows, (error, res) => {
      if (error) {
        console.log('error', error);
      } else {
        console.log('success', res);
      }
    })
  }

  componentDidMount() {
    this.getCsvData(this.props.csvPath);
  }
  
  render() {
    const {
      classes,
    } = this.props;
    const {
      rows,
      columns,
      tableColumnExtensions,
      sorting,
      editingRowIds,
      addedRows,
      rowChanges,
      currentPage,
      deletingRows,
      pageSize,
      pageSizes,
      columnOrder,
    } = this.state;

    return (
      <Paper>
        <Toolbar>
        {/* <ToolbarGroup> */}
          {/* <ToolbarTitle text="Options" /> */}
          {/* <FontIcon className="muidocs-icon-custom-sort" /> */}
          {/* <ToolbarSeparator /> */}
          <Button label="Create Broadcast" raised color="primary" onClick={this.saveCsvData}>Save Data</Button>
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



      
        <Grid
          rows={rows}
          columns={columns}
          getRowId={getRowId}
        >
          <SortingState
            sorting={sorting}
            onSortingChange={this.changeSorting}
          />
          <PagingState
            currentPage={currentPage}
            onCurrentPageChange={this.changeCurrentPage}
            pageSize={pageSize}
            onPageSizeChange={this.changePageSize}
          />

          <IntegratedSorting />
          <IntegratedPaging />

          <EditingState
            editingRowIds={editingRowIds}
            onEditingRowIdsChange={this.changeEditingRowIds}
            rowChanges={rowChanges}
            onRowChangesChange={this.changeRowChanges}
            addedRows={addedRows}
            onAddedRowsChange={this.changeAddedRows}
            onCommitChanges={this.commitChanges}
          />

          <DragDropProvider />

          <Table
            columnExtensions={tableColumnExtensions}
            cellComponent={(props) => {return <Cell {...props} onImgshowhandler={this.showImage} />} }
          />

          <TableColumnReordering
            order={columnOrder}
            onOrderChange={this.changeColumnOrder}
          />

          <TableHeaderRow showSortingControls />
          <TableEditRow
            cellComponent={EditCell}
          />
          <TableEditColumn
            width={120}
            // showAddCommand={!addedRows.length}
            showEditCommand
            showDeleteCommand
            commandComponent={Command}
          />
          {/* <PagingPanel
            pageSizes={pageSizes}
          /> */}
        </Grid>

        <Dialog
          open={!!deletingRows.length}
          onClose={this.cancelDelete}
          classes={{ paper: classes.dialog }}
        >
          <DialogTitle>Delete Row</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure to delete the following row?
            </DialogContentText>
            <Paper>
              <Grid
                rows={rows.filter(row => deletingRows.indexOf(row.id) > -1)}
                columns={columns}
              >
                <Table
                  columnExtensions={tableColumnExtensions}
                  cellComponent={Cell}
                />
                <TableHeaderRow />
              </Grid>
            </Paper>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.cancelDelete} color="primary">Cancel</Button>
            <Button onClick={this.deleteRows} color="accent">Delete</Button>
          </DialogActions>
        </Dialog>
        <input type="button" onClick={() => console.log(this.state)} value="View State"/>

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
      </Paper>
    );
  }
}

export default withStyles(styles)(OutputView);