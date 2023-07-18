import React, { Component } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import QCform from './QC_Form'


export class HomeScreen extends Component {
  render() {
    return (
        <>
        <button onClick={QCform}>OSP QC</button>
        </>
    )
  }
}

export default HomeScreen