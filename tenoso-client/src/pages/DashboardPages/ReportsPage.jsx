import { Box, Typography, Stack } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";

const ReportsPage = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Reports
      </Typography>

      <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
        <BarChart
          series={[{ data: [10, 20, 30, 40], label: "Sales" }]}
          xAxis={[{ data: ["Jan", "Feb", "Mar", "Apr"], scaleType: "band" }]}
          width={400}
          height={300}
        />

        <PieChart
          series={[
            {
              data: [
                { id: 0, value: 10, label: "A" },
                { id: 1, value: 20, label: "B" },
                { id: 2, value: 30, label: "C" },
              ],
            },
          ]}
          width={300}
          height={300}
        />
      </Stack>
    </Box>
  );
};

export default ReportsPage;