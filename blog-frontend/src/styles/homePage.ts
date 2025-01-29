import { SxProps } from "@mui/material";

type Styles = {
  [key: string]: SxProps;
};

export const homePageStyles: Styles = {
  container: { display: "flex", flexDirection: "column", gap: 10 },
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    padding: 6,
  },
  text: {
    fontSize: { lg: 50, md: 40, sm: 35, xs: 20 },
    fontFamily: "Poppins",
    textShadow: "10px 10px 8px #ccc",
  },
  image: {
    boxShadow: "10px 10px 25px #000",
    borderRadius: 20,
  },

  //   Footer
  footerContainer: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    height: "20vh",
    justifyContent: "center",
    gap: 20,
    bgcolor: "blanchedalmond",
  },
  footerBtn: {
    borderRadius: 20,
    bgcolor: "purple",
    color: "white",
    width: 200,
    ":hover": {
      bgcolor: "black",
      color: "white",
    },
  },
  footerText: {
    fontSize: { lg: 20, md: 15, sx: 10, xs: 5 },
    color: "black",
  },
};
