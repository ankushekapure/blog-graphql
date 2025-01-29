import { SxProps } from "@mui/material";

type headerStyles = {
  [key: string]: SxProps;
};

export const headerStyle: headerStyles = {
  appBar: {
    position: "sticky",
    bgcolor: "purple",
  },

  tabContainer: {
    display: "flex",
    marginLeft: "auto",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
  },

  authBtn: {
    ml: 1,
    bgcolor: "blanchedalmond",
    padding: 2,
    borderRadius: "5%",
    width: 100,
    height: 30,
    color: "black",

    ":hover": {
      bgcolor: "grey",
    },
  },
};
