import { useRef, useState } from 'react';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import { BarChart } from "@mui/x-charts/BarChart";
import { Gauge } from "@mui/x-charts/Gauge";
import { PieChart } from "@mui/x-charts/PieChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { DataGrid } from '@mui/x-data-grid';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const C = {
    dark:        '#283618',
    lightYellow: '#ecf39e',
    midGreen:    '#90a955',
    paleGreen:   '#dde5b6',
    yellow:      '#ffe566',
};

const columns = [
    { field: 'id',        headerName: 'ID',          width: 60  },
    { field: 'series',    headerName: 'Series',       width: 170 },
    { field: 'category',  headerName: 'Category',     width: 130 },
    { field: 'unitsSold', headerName: 'Units Sold',   width: 110, type: 'number' },
    { field: 'date',      headerName: 'Restock Date', width: 130 },
    {
        field: 'status',
        headerName: 'Status',
        width: 130,
        renderCell: (params) => (
            <Chip
                label={params.value}
                size="small"
                sx={{
                    backgroundColor:
                        params.value === 'In Stock'  ? C.midGreen :
                        params.value === 'Low Stock' ? C.yellow   : C.paleGreen,
                    color: C.dark,
                    fontWeight: 700,
                    fontSize: '0.7rem',
                }}
            />
        ),
    },
];

const rows = [
    { id: 1, series: 'Series 1 (Classic)',  category: 'Core',      unitsSold: 340, date: '2025-01-10', status: 'In Stock'     },
    { id: 2, series: 'Bath Series',         category: 'Lifestyle', unitsSold: 210, date: '2025-01-18', status: 'In Stock'     },
    { id: 3, series: 'Living Series',       category: 'Lifestyle', unitsSold: 195, date: '2025-02-05', status: 'Low Stock'    },
    { id: 4, series: 'Exercising Series',   category: 'Activity',  unitsSold: 178, date: '2025-02-14', status: 'In Stock'     },
    { id: 5, series: 'Yoga Series',         category: 'Activity',  unitsSold: 162, date: '2025-02-28', status: 'Out of Stock' },
    { id: 6, series: '@ Work Series',       category: 'Lifestyle', unitsSold: 150, date: '2025-03-07', status: 'In Stock'     },
    { id: 7, series: 'Museum Series',       category: 'Special',   unitsSold: 134, date: '2025-03-15', status: 'Low Stock'    },
    { id: 8, series: 'Sunday Series',       category: 'Lifestyle', unitsSold: 120, date: '2025-03-22', status: 'In Stock'     },
    { id: 9, series: 'HIPPERS Series',      category: 'Special',   unitsSold: 98,  date: '2025-04-01', status: 'In Stock'     },
];

const statCards = [
    { label: 'Blind Boxes Sold',  value: '1,387', sub: 'Last 4 months',      trend: '+18%' },
    { label: 'Orders Fulfilled',  value: '1,249', sub: 'Last 4 months',      trend: '+15%' },
    { label: 'Fulfillment Rate',  value: '90%',   sub: 'Current cycle',      trend: '+3%'  },
    { label: 'Active Series',     value: '9',     sub: 'Core · Life · Spec', trend: null   },
];

const categoryProgress = [
    { label: 'Core Series',      completed: 2, total: 2 },
    { label: 'Lifestyle Series', completed: 4, total: 5 },
    { label: 'Activity Series',  completed: 1, total: 2 },
    { label: 'Special Series',   completed: 2, total: 2 },
];

const ReportsPage = () => {
    const printRef = useRef(null);
    const [exporting, setExporting] = useState(false);

    const buildPDF = async () => {
        const printContent = printRef.current;
        if (!printContent) return null;

        const exportedAt = new Intl.DateTimeFormat('en-US', {
            dateStyle: 'long',
            timeStyle: 'short',
        }).format(new Date());

        const canvas = await html2canvas(printContent, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false,
            scrollX: 0,
            scrollY: -window.scrollY,
            windowWidth: document.documentElement.scrollWidth,
            windowHeight: document.documentElement.scrollHeight,
        });

        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const pageWidth   = pdf.internal.pageSize.getWidth();
        const pageHeight  = pdf.internal.pageSize.getHeight();
        const margin      = 16;
        const usableWidth = pageWidth - margin * 2;
        const headerHeight = 36;

        pdf.setFontSize(22);
        pdf.setTextColor(40, 54, 24);
        pdf.text('Smiski Store — Sales & Inventory Report', margin, margin + 6);

        pdf.setFontSize(10);
        pdf.setTextColor(107, 114, 128);
        pdf.text(
            'Blind-box sales overview, series performance, fulfillment rate, and inventory status.',
            margin, margin + 13, { maxWidth: usableWidth }
        );
        pdf.text(`Prepared on ${exportedAt}`, margin, margin + 22);

        pdf.setDrawColor(144, 169, 85);
        pdf.setLineWidth(0.5);
        pdf.line(margin, margin + 26, pageWidth - margin, margin + 26);

        const imgWidth       = usableWidth;
        const totalImgHeight = (canvas.height * imgWidth) / canvas.width;

        let remainingMM = totalImgHeight;
        let sourcePxY   = 0;
        let isFirstPage = true;

        while (remainingMM > 0) {
            const topY        = isFirstPage ? margin + headerHeight : margin;
            const availableMM = pageHeight - topY - margin;
            const sliceMM     = Math.min(remainingMM, availableMM);
            const pxPerMM     = canvas.width / imgWidth;
            const slicePx     = Math.round(sliceMM * pxPerMM);

            const sliceCanvas        = document.createElement('canvas');
            sliceCanvas.width        = canvas.width;
            sliceCanvas.height       = slicePx;
            sliceCanvas.getContext('2d').drawImage(
                canvas,
                0, sourcePxY, canvas.width, slicePx,
                0, 0,         canvas.width, slicePx
            );

            pdf.addImage(sliceCanvas.toDataURL('image/png'), 'PNG', margin, topY, imgWidth, sliceMM);

            remainingMM -= sliceMM;
            sourcePxY   += slicePx;
            if (remainingMM > 0) pdf.addPage();
            isFirstPage = false;
        }

        return pdf;
    };

    const handleExport = async () => {
        setExporting(true);
        try {
            const pdf = await buildPDF();
            if (!pdf) return;

            const blob    = pdf.output('blob');
            const blobUrl = URL.createObjectURL(blob);
            const win     = window.open(blobUrl, '_blank');

            if (win) {
                win.addEventListener('load', () => {
                    win.focus();
                    win.print();
                });
            }

            setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
        } catch (err) {
            console.error('Export failed:', err);
        } finally {
            setExporting(false);
        }
    };

    const sharedBtnDisabled = {
        '&.Mui-disabled': { borderColor: C.paleGreen, color: C.paleGreen },
    };

    return (
        <Box>
            <Box
                sx={{
                    mb: 4, p: 3, borderRadius: 3,
                    backgroundColor: C.dark,
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', md: 'center' },
                    gap: 2,
                }}
            >
                <Box>
                    <Typography variant="h4" sx={{ color: C.lightYellow, fontWeight: 700, mb: 0.5 }}>
                        Reports
                    </Typography>
                    <Typography variant="body2" sx={{ color: C.paleGreen }}>
                        Smiski blind-box sales, series performance, and inventory overview.
                    </Typography>
                </Box>

                <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: C.midGreen, color: C.dark, fontWeight: 700,
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
                            borderColor: C.lightYellow, color: C.lightYellow, fontWeight: 600,
                            '&:hover': { borderColor: C.yellow, color: C.yellow, backgroundColor: 'transparent' },
                            ...sharedBtnDisabled,
                        }}
                    >
                        {exporting ? 'Exporting…' : 'Export'}
                    </Button>

                    <Button
                        variant="outlined"
                        sx={{
                            borderColor: C.paleGreen, color: C.paleGreen, fontWeight: 600,
                            '&:hover': { borderColor: C.lightYellow, color: C.lightYellow, backgroundColor: 'transparent' },
                        }}
                    >
                        Filter
                    </Button>
                </Stack>
            </Box>

            <Box ref={printRef}>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
                        gap: 2, mb: 3,
                    }}
                >
                    {statCards.map((stat, i) => (
                        <Card
                            key={i}
                            sx={{
                                backgroundColor: i % 2 === 0 ? C.paleGreen : C.lightYellow,
                                border: 'none', boxShadow: 'none', borderRadius: 3,
                            }}
                        >
                            <CardContent>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: C.dark, fontWeight: 600, opacity: 0.7,
                                        mb: 0.5, fontSize: '0.75rem',
                                        textTransform: 'uppercase', letterSpacing: 1,
                                    }}
                                >
                                    {stat.label}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                                    <Typography variant="h4" sx={{ color: C.dark, fontWeight: 800, lineHeight: 1 }}>
                                        {stat.value}
                                    </Typography>
                                    {stat.trend && (
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: C.dark, fontWeight: 700,
                                                backgroundColor: C.midGreen,
                                                px: 0.8, py: 0.2, borderRadius: 1,
                                            }}
                                        >
                                            {stat.trend}
                                        </Typography>
                                    )}
                                </Box>
                                <Typography variant="caption" sx={{ color: C.dark, opacity: 0.6 }}>
                                    {stat.sub}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Box>

                <Stack spacing={3}>
                    <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3}>
                        <Card sx={{ flex: 2, borderRadius: 3, border: `1.5px solid ${C.paleGreen}`, boxShadow: 'none' }}>
                            <CardContent>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: C.dark }}>
                                        Monthly Blind Box Sales
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Units sold vs. orders fulfilled across the last four months.
                                    </Typography>
                                </Box>
                                <BarChart
                                    series={[
                                        { data: [310, 370, 340, 367], label: 'Units Sold',       color: C.dark     },
                                        { data: [280, 340, 305, 324], label: 'Orders Fulfilled',  color: C.midGreen },
                                    ]}
                                    height={260}
                                    xAxis={[{ data: ['January', 'February', 'March', 'April'], scaleType: 'band', label: 'Month' }]}
                                />
                            </CardContent>
                        </Card>

                        <Card sx={{ flex: 1, borderRadius: 3, border: `1.5px solid ${C.paleGreen}`, boxShadow: 'none' }}>
                            <CardContent>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: C.dark }}>
                                        Series Availability
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        In-stock vs. total series per category.
                                    </Typography>
                                </Box>
                                <Stack spacing={2.5} sx={{ mt: 1 }}>
                                    {categoryProgress.map((cat) => (
                                        <Box key={cat.label}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                <Typography variant="body2" sx={{ fontWeight: 700, color: C.dark }}>
                                                    {cat.label}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: C.dark, opacity: 0.7 }}>
                                                    {cat.completed}/{cat.total}
                                                </Typography>
                                            </Box>
                                            <LinearProgress
                                                variant="determinate"
                                                value={(cat.completed / cat.total) * 100}
                                                sx={{
                                                    height: 10, borderRadius: 5,
                                                    backgroundColor: C.paleGreen,
                                                    '& .MuiLinearProgress-bar': { backgroundColor: C.dark, borderRadius: 5 },
                                                }}
                                            />
                                        </Box>
                                    ))}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Stack>

                    <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3}>
                        <Card sx={{ flex: 1, borderRadius: 3, border: `1.5px solid ${C.paleGreen}`, boxShadow: 'none' }}>
                            <CardContent>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: C.dark }}>
                                        Weekly Fulfillment Trend
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Orders fulfilled week-over-week this quarter.
                                    </Typography>
                                </Box>
                                <LineChart
                                    series={[{
                                        data:  [52, 68, 61, 89, 74, 95, 88, 110, 102, 121, 115, 134],
                                        label: 'Fulfilled',
                                        color: C.midGreen,
                                        area:  true,
                                    }]}
                                    xAxis={[{ data: ['W1','W2','W3','W4','W5','W6','W7','W8','W9','W10','W11','W12'], scaleType: 'band' }]}
                                    height={220}
                                    sx={{
                                        '& .MuiLineElement-root': { strokeWidth: 2 },
                                        '& .MuiAreaElement-root': { fill: C.paleGreen, fillOpacity: 0.5 },
                                    }}
                                />
                            </CardContent>
                        </Card>

                        <Card sx={{ flex: 1, borderRadius: 3, border: `1.5px solid ${C.paleGreen}`, boxShadow: 'none' }}>
                            <CardContent>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: C.dark }}>
                                        Sales by Category
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Revenue share across Smiski series categories.
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <PieChart
                                        series={[{
                                            data: [
                                                { id: 0, value: 38, label: 'Core',      color: C.dark        },
                                                { id: 1, value: 32, label: 'Lifestyle', color: C.midGreen    },
                                                { id: 2, value: 18, label: 'Activity',  color: C.lightYellow },
                                                { id: 3, value: 12, label: 'Special',   color: C.yellow      },
                                            ],
                                        }]}
                                        width={260}
                                        height={200}
                                    />
                                </Box>
                            </CardContent>
                        </Card>

                        <Card sx={{ flex: 1, borderRadius: 3, border: `1.5px solid ${C.paleGreen}`, boxShadow: 'none' }}>
                            <CardContent>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: C.dark }}>
                                        Fulfillment Rate
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Orders completed on time in the current cycle.
                                    </Typography>
                                </Box>
                                <Box sx={{ minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                    <Gauge
                                        width={160} height={160} value={90}
                                        sx={{
                                            '& .MuiGauge-valueText':    { fill: C.dark,      fontWeight: 700 },
                                            '& .MuiGauge-referenceArc': { fill: C.paleGreen },
                                            '& .MuiGauge-valueArc':     { fill: C.midGreen  },
                                        }}
                                    />
                                    <Typography variant="body2" sx={{ color: C.dark, fontWeight: 600 }}>
                                        90% on-time fulfillment
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Stack>

                    <Card sx={{ borderRadius: 3, border: `1.5px solid ${C.paleGreen}`, boxShadow: 'none' }}>
                        <CardContent>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: C.dark }}>
                                    Series Inventory Records
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Per-series unit sales, restock dates, and current stock status.
                                </Typography>
                            </Box>
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
                                pageSizeOptions={[5]}
                                checkboxSelection
                                disableRowSelectionOnClick
                                sx={{
                                    border: 'none',
                                    '& .MuiDataGrid-columnHeader':  { backgroundColor: C.paleGreen, color: C.dark, fontWeight: 700 },
                                    '& .MuiDataGrid-row:hover':     { backgroundColor: C.lightYellow },
                                    '& .MuiDataGrid-cell, & .MuiDataGrid-columnHeader': { outline: 'none' },
                                    '& .MuiCheckbox-root.Mui-checked': { color: C.midGreen },
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