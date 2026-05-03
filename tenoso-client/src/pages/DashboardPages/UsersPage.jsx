import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "firstName", headerName: "First Name", width: 130 },
  { field: "lastName", headerName: "Last Name", width: 130 },
  { field: "age", headerName: "Age", type: "number", width: 90 },
];

const rows = [
  { id: 1, firstName: "Jon", lastName: "Snow", age: 14 },
  { id: 2, firstName: "Cersei", lastName: "Lannister", age: 31 },
  { id: 3, firstName: "Jaime", lastName: "Lannister", age: 31 },
  { id: 4, firstName: "Arya", lastName: "Stark", age: 11 },
];

const UsersPage = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>

      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[5]}
          checkboxSelection
        />
      </Box>
    </Box>
  );
};

export default UsersPage;