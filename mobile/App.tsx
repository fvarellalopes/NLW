import React from 'react';
import Home from './src/pages/Home';
import { View, StatusBar } from 'react-native';

import Routes from './src/routes';


export default function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent"></StatusBar>
      <Routes />
    </>
  );
}

