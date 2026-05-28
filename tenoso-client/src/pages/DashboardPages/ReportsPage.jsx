import { useRef, useState } from 'react';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { BarChart } from "@mui/x-charts/BarChart";
import { Gauge } from "@mui/x-charts/Gauge";
import { PieChart } from "@mui/x-charts/PieChart";
import { DataGrid } from '@mui/x-data-grid';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'firstName', headerName: 'First name', width: 150, editable: true },
    { field: 'lastName', headerName: 'Last name', width: 150, editable: true },
    { field: 'age', headerName: 'Age', type: 'number', width: 110, editable: true },
    {
        field: 'fullName',
        headerName: 'Full name',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 160,
        valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
    },
];

const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

// Color scheme
const C = {
    dark: '#283618',
    lightYellow: '#ecf39e',
    midGreen: '#90a955',
    paleGreen: '#dde5b6',
    yellow: '#ffe566',
};

const statCards = [
    { label: 'Total Generated', value: '89', sub: 'Last 4 months' },
    { label: 'Total Completed', value: '71', sub: 'Last 4 months' },
    { label: 'Completion Rate', value: '78%', sub: 'Current cycle' },
    { label: 'Categories', value: '4', sub: 'Active types' },
];

const ReportsPage = () => {
    const printRef = useRef(null);
    const [exporting, setExporting] = useState(false);

    const handleExport = async () => {
        const printContent = printRef.current;
        if (!printContent) return;

        setExporting(true);

        const exportedAt = new Intl.DateTimeFormat('en-US', {
            dateStyle: 'long',
            timeStyle: 'short',
        }).format(new Date());

        try {
            // Capture the entire printable section as a canvas snapshot.
            // html2canvas renders the live DOM pixels so charts, gauges, and
            // pie slices are captured exactly as they appear on screen —
            // avoiding the broken blank/solid-block issue that occurs when
            // copying innerHTML into a new window on deployed environments.
            const canvas = await html2canvas(printContent, {
                scale: 2,               // 2× for crisp text and chart lines
                useCORS: true,          // allow cross-origin images/fonts
                backgroundColor: '#ffffff',
                logging: false,
                // Scroll the element into full view before capturing so
                // nothing is clipped by the viewport
                scrollX: 0,
                scrollY: -window.scrollY,
                windowWidth: document.documentElement.scrollWidth,
                windowHeight: document.documentElement.scrollHeight,
            });

            const imgData = canvas.toDataURL('image/png');

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });

            const pageWidth = pdf.internal.pageSize.getWidth();   // 210 mm
            const pageHeight = pdf.internal.pageSize.getHeight(); // 297 mm
            const margin = 16;
            const usableWidth = pageWidth - margin * 2;
            const headerHeight = 34; // mm reserved for the text header on page 1

            // ── PDF header (page 1 only) ──────────────────────────────────
            pdf.setFontSize(22);
            pdf.setTextColor(40, 54, 24);   // C.dark
            pdf.text('Reports Summary', margin, margin + 6);

            pdf.setFontSize(10);
            pdf.setTextColor(107, 114, 128);
            pdf.text(
                'Analytics overview for generated reports, category breakdown, and completion performance.',
                margin,
                margin + 13,
                { maxWidth: usableWidth }
            );
            pdf.text(`Prepared on ${exportedAt}`, margin, margin + 22);

            pdf.setDrawColor(144, 169, 85);  // C.midGreen
            pdf.setLineWidth(0.5);
            pdf.line(margin, margin + 26, pageWidth - margin, margin + 26);

            // ── Paginate the canvas snapshot across A4 pages ─────────────
            // The canvas represents the full scrollable content; we slice it
            // vertically into page-sized strips and add each as a new page.
            const imgWidth = usableWidth;
            const totalImgHeight = (canvas.height * imgWidth) / canvas.width; // mm

            let remainingMM = totalImgHeight;
            let sourcePxY = 0;                       // top of the undrawn canvas strip (px)
            let isFirstPage = true;

            while (remainingMM > 0) {
                const topY = isFirstPage ? margin + headerHeight : margin;
                const availableMM = pageHeight - topY - margin;
                const sliceMM = Math.min(remainingMM, availableMM);

                // Convert the slice height from mm → source canvas pixels
                const pxPerMM = canvas.width / imgWidth;  // px per mm
                const slicePx = Math.round(sliceMM * pxPerMM);

                // Draw only the slice strip onto a temporary canvas
                const sliceCanvas = document.createElement('canvas');
                sliceCanvas.width = canvas.width;
                sliceCanvas.height = slicePx;

                const ctx = sliceCanvas.getContext('2d');
                ctx.drawImage(
                    canvas,
                    0, sourcePxY,           // source: x, y
                    canvas.width, slicePx,  // source: w, h
                    0, 0,                   // dest: x, y
                    canvas.width, slicePx   // dest: w, h
                );

                pdf.addImage(
                    sliceCanvas.toDataURL('image/png'),
                    'PNG',
                    margin,
                    topY,
                    imgWidth,
                    sliceMM
                );

                remainingMM -= sliceMM;
                sourcePxY += slicePx;

                if (remainingMM > 0) {
                    pdf.addPage();
                }

                isFirstPage = false;
            }

            pdf.save(`reports-summary-${Date.now()}.pdf`);

        } catch (err) {
            console.error('PDF export failed:', err);
        } finally {
            setExporting(false);
        }
    };

    return (
        <Box>
            {/* Page Header */}
            <Box
                sx={{
                    mb: 4,
                    p: 3,
                    borderRadius: 3,
                    backgroundColor: C.dark,
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', md: 'center' },
                    gap: 2,
                }}
            >
                <Box>
                    <Typography
                        variant="h4"
                        sx={{ color: C.lightYellow, fontWeight: 700, mb: 0.5 }}
                    >
                        Reports
                    </Typography>
                    <Typography variant="body2" sx={{ color: C.paleGreen }}>
                        Analytics overview — generated reports, category breakdown, and completion performance.
                    </Typography>
                </Box>
                <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: C.midGreen,
                            color: C.dark,
                            fontWeight: 700,
                            '&:hover': { backgroundColor: C.lightYellow },
                        }}
                    >
                        Generate
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={handleExport}
                        disabled={exporting}
                        startIcon={exporting ? <CircularProgress size={14} sx={{ color: C.lightYellow }} /> : null}
                        sx={{
                            borderColor: C.lightYellow,
                            color: C.lightYellow,
                            fontWeight: 600,
                            '&:hover': { borderColor: C.yellow, color: C.yellow, backgroundColor: 'transparent' },
                            '&.Mui-disabled': { borderColor: C.paleGreen, color: C.paleGreen },
                        }}
                    >
                        {exporting ? 'Exporting…' : 'Export'}
                    </Button>
                    <Button
                        variant="outlined"
                        sx={{
                            borderColor: C.paleGreen,
                            color: C.paleGreen,
                            fontWeight: 600,
                            '&:hover': { borderColor: C.lightYellow, color: C.lightYellow, backgroundColor: 'transparent' },
                        }}
                    >
                        Filter
                    </Button>
                </Stack>
            </Box>

            {/*
              * printRef wraps BOTH the stat cards AND the charts/table so that
              * everything is captured in the exported PDF.
              * Previously ref={printRef} was only on the <Stack> below,
              * which excluded the stat cards from the export.
              */}
            <Box ref={printRef}>
                {/* Stat Cards */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
                        gap: 2,
                        mb: 3,
                    }}
                >
                    {statCards.map((stat, i) => (
                        <Card
                            key={i}
                            sx={{
                                backgroundColor: i % 2 === 0 ? C.paleGreen : C.lightYellow,
                                border: 'none',
                                boxShadow: 'none',
                                borderRadius: 3,
                            }}
                        >
                            <CardContent>
                                <Typography
                                    variant="body2"
                                    sx={{ color: C.dark, fontWeight: 600, opacity: 0.7, mb: 0.5, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1 }}
                                >
                                    {stat.label}
                                </Typography>
                                <Typography
                                    variant="h4"
                                    sx={{ color: C.dark, fontWeight: 800, lineHeight: 1 }}
                                >
                                    {stat.value}
                                </Typography>
                                <Typography variant="caption" sx={{ color: C.dark, opacity: 0.6 }}>
                                    {stat.sub}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Box>

                <Stack spacing={3}>
                    {/* Bar Chart */}
                    <Card sx={{ borderRadius: 3, border: `1.5px solid ${C.paleGreen}`, boxShadow: 'none' }}>
                        <CardContent>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: C.dark }}>
                                    Monthly Report Output
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Compares reports generated vs. completed across the last four months.
                                </Typography>
                            </Box>
                            <BarChart
                                series={[
                                    { data: [18, 24, 20, 27], label: "Generated", color: C.dark },
                                    { data: [12, 19, 17, 23], label: "Completed", color: C.midGreen },
                                ]}
                                height={300}
                                xAxis={[
                                    {
                                        data: ["January", "February", "March", "April"],
                                        scaleType: "band",
                                        label: "Months",
                                    },
                                ]}
                            />
                        </CardContent>
                    </Card>

                    {/* Pie + Gauge */}
                    <Stack direction={{ xs: "column", lg: "row" }} spacing={3}>
                        <Card sx={{ flex: 1, borderRadius: 3, border: `1.5px solid ${C.paleGreen}`, boxShadow: 'none' }}>
                            <CardContent>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: C.dark }}>
                                        Report Category Share
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Distribution of report requests by category for the current period.
                                    </Typography>
                                </Box>
                                <Box sx={{ display: "flex", justifyContent: "center" }}>
                                    <PieChart
                                        series={[
                                            {
                                                data: [
                                                    { id: 0, value: 14, label: "Sales", color: C.dark },
                                                    { id: 1, value: 10, label: "Users", color: C.midGreen },
                                                    { id: 2, value: 8, label: "Inventory", color: C.lightYellow },
                                                    { id: 3, value: 6, label: "Finance", color: C.yellow },
                                                ],
                                            },
                                        ]}
                                        width={300}
                                        height={220}
                                    />
                                </Box>
                            </CardContent>
                        </Card>

                        <Card sx={{ flex: 1, borderRadius: 3, border: `1.5px solid ${C.paleGreen}`, boxShadow: 'none' }}>
                            <CardContent>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: C.dark }}>
                                        Completion Rate
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Percentage of reports completed on time in the latest cycle.
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        minHeight: 220,
                                        display: "flex",
                                        flexDirection: 'column',
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 1,
                                    }}
                                >
                                    <Gauge
                                        width={180}
                                        height={180}
                                        value={78}
                                        sx={{
                                            '& .MuiGauge-valueText': { fill: C.dark, fontWeight: 700 },
                                            '& .MuiGauge-referenceArc': { fill: C.paleGreen },
                                            '& .MuiGauge-valueArc': { fill: C.midGreen },
                                        }}
                                    />
                                    <Typography variant="body2" sx={{ color: C.dark, fontWeight: 600 }}>
                                        78% on-time completion
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Stack>

                    {/* Data Table */}
                    <Card sx={{ borderRadius: 3, border: `1.5px solid ${C.paleGreen}`, boxShadow: 'none' }}>
                        <CardContent>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: C.dark }}>
                                    Report Records
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Detailed listing of individual report entries.
                                </Typography>
                            </Box>
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                initialState={{
                                    pagination: { paginationModel: { pageSize: 5 } },
                                }}
                                pageSizeOptions={[5]}
                                checkboxSelection
                                disableRowSelectionOnClick
                                sx={{
                                    border: 'none',
                                    '& .MuiDataGrid-columnHeader': {
                                        backgroundColor: C.paleGreen,
                                        color: C.dark,
                                        fontWeight: 700,
                                    },
                                    '& .MuiDataGrid-row:hover': {
                                        backgroundColor: C.lightYellow,
                                    },
                                    '& .MuiDataGrid-cell, & .MuiDataGrid-columnHeader': {
                                        outline: 'none',
                                    },
                                    '& .MuiCheckbox-root.Mui-checked': {
                                        color: C.midGreen,
                                    },
                                }}
                            />
                        </CardContent>
                    </Card>
                </Stack>
            </Box>
        </Box>
    );
};

export default ReportsPage;