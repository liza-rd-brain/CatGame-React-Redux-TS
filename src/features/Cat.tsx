import React from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import styled, { ThemeProvider } from "styled-components";

const CatItem = styled.div`
  position: absolute;
  z-index: 1;
  width: 146px;
  height: 50px;
  top: 235px;
  /*котик посередине*/
  left: 240px;
  background: url("../assets/cat_run.gif") no-repeat;

  background-size: 91px 50px;
`;

function Cat() {
  return <CatItem />;
}

export default Cat;
