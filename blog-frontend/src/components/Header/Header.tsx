import { AppBar, Box, Button, Tab, Tabs, Toolbar } from "@mui/material";
import { FaBlog } from "react-icons/fa";
import { headerStyle } from "../../styles/header";
import { useState } from "react";
import { CiLogin } from "react-icons/ci";
import { Link } from "react-router-dom";
function Header() {
  const [value, setvalue] = useState(0);

  const handleOnChange = (e: any, value: number) => {
    setvalue(value);
  };

  return (
    <AppBar sx={headerStyle.appBar}>
      <Toolbar>
        {/* logo */}
        <FaBlog
          style={{
            borderRadius: "50%",
            padding: 10,
            backgroundColor: "blanchedalmond",
          }}
          size={30}
          color={"black"}
        />

        <Box sx={headerStyle.tabContainer}>
          <Tabs
            value={value}
            indicatorColor={"secondary"}
            textColor="inherit"
            onChange={(e, value) => handleOnChange(e, value)}
          >
            {/* @ts-ignore */}
            <Tab label="Home" LinkComponent={Link} to="/" />
            {/* @ts-ignore */}
            <Tab label="Blogs" LinkComponent={Link} to="/blogs" />
          </Tabs>

          {/* Login / Signup */}
          {/* @ts-ignore */}
          <Button
            LinkComponent={Link}
            to={"/auth"}
            endIcon={<CiLogin color={"black"} size={15} />}
            sx={headerStyle.authBtn}
          >
            Login
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
