import React from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  TextField
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { format } from "date-fns";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { DeleteTwoTone } from "@ant-design/icons";
import { IoAdd } from "react-icons/io5";
import dayjs from "dayjs";

interface Row {
  orderstartdate: Date | null;
  orderstarttime: Date | null;
}

interface RecurringTableProps {
  rows: Row[];
  setRows: React.Dispatch<React.SetStateAction<Row[]>>;
}

const RecurringTable: React.FC<RecurringTableProps> = ({ rows, setRows }) => {
  const handleAddRow = () => {
    setRows([...rows, { orderstartdate: null, orderstarttime: null }]);
  };

  const handleDeleteRow = (index: number) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  const handleInputChange = (index: number, field: keyof Row, value: Date | null) => {
    const updatedRows = rows.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    setRows(updatedRows);
  };

  const getDayOfWeek = (orderstartdate: Date | null) => {
    if (!orderstartdate) return "";
    return format(orderstartdate, "EEEE");
  };

  const handleOnDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(rows);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setRows(items);
  };

  return (
    <div>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="rows">
          {(provided) => (
            <Table {...provided.droppableProps} ref={provided.innerRef}>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Day</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <Draggable key={index} draggableId={`${index}`} index={index}>
                    {(provided) => (
                      <TableRow ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <DatePicker
                            value={row.orderstartdate ? dayjs(row.orderstartdate) : null}
                            onChange={(newValue) =>
                              handleInputChange(index, "orderstartdate", newValue?.toDate() ?? null)
                            }
                            format="DD MMM YYYY"
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                error: !row.orderstartdate,
                                helperText: !row.orderstartdate ? "Please select a date" : ""
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            value={getDayOfWeek(row.orderstartdate)}
                            fullWidth
                            InputProps={{ readOnly: true }}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleDeleteRow(index)} color="error">
                            <DeleteTwoTone />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </TableBody>
            </Table>
          )}
        </Droppable>
      </DragDropContext>
      <Button startIcon={<IoAdd />} onClick={handleAddRow} variant="outlined" sx={{ mt: 2 }}>
        Add More
      </Button>
    </div>
  );
};

export default RecurringTable;
