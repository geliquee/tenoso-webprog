import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ArticleIcon from "@mui/icons-material/Article";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import navlogo from "../assets/images/navlogo.png";

// ─── Constants ────────────────────────────────────────────────────────────────

const drawerWidth = 170;

const getNavItems = (type) => {
    const items = [
        { label: "Dashboard", to: "/dashboard", icon: DashboardIcon },
        { label: "Reports", to: "/dashboard/reports", icon: AssessmentIcon },
        { label: "Articles", to: "/dashboard/articles", icon: ArticleIcon },
    ];
    if (type === 'admin') {
        items.push({ label: "Users", to: "/dashboard/users", icon: PeopleIcon });
    }
    return items;
};

// ─── Styled Components ────────────────────────────────────────────────────────

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar)(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
}));

const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: "#dde5b6",
    color: "#283618",
    "&:hover": { backgroundColor: "#90a955", color: "#fff" },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(3),
        width: "auto",
    },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("md")]: { width: "20ch" },
    },
}));

// ─── Component ────────────────────────────────────────────────────────────────

const DashLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const userType = localStorage.getItem('type') ?? '';
    const navItems = getNavItems(userType);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('firstName');
        localStorage.removeItem('type');
        navigate("/auth/signin");
    };

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />

            {/* App Bar */}
            <AppBar position="fixed" sx={{ backgroundColor: "#ecf39e" }}>
                <Toolbar>
                    <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
                        <img src={navlogo} alt="Logo" style={{ height: "40px", objectFit: "contain" }} />
                    </Box>
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search..."
                            inputProps={{ "aria-label": "search" }}
                        />
                    </Search>
                    <Button
                        variant="outlined"
                        onClick={handleLogout}
                        sx={{
                            color: "#90a955",
                            borderColor: "#90a955",
                            "&:hover": { borderColor: "#ffe97f", backgroundColor: "#ffe97f" },
                        }}
                    >
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            {/* Drawer — permanent, fixed width, icons + labels */}
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        boxSizing: "border-box",
                        backgroundColor: "#dde5b6",
                        overflowX: "hidden",
                    },
                }}
            >
                <DrawerHeader />
                <Divider />
                <List>
                    {navItems.map(({ label, to, icon: Icon }) => (
                        <ListItem key={to} disablePadding sx={{ display: "block" }}>
                            <ListItemButton
                                component={Link}
                                to={to}
                                selected={location.pathname === to}
                                sx={{
                                    minHeight: 48,
                                    px: 2.5,
                                    color: "#283618",
                                    "&.Mui-selected": {
                                        backgroundColor: "#90a955",
                                        "&:hover": { backgroundColor: "#90a955" },
                                    },
                                    "&:hover": { backgroundColor: "#ffe566" },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: 2,
                                        justifyContent: "center",
                                        color: "inherit",
                                    }}
                                >
                                    <Icon />
                                </ListItemIcon>
                                <ListItemText primary={label} sx={{ color: "#283618" }} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            {/* Main Content */}
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                <Outlet />
            </Box>
        </Box>
    );
};

export default DashLayout;