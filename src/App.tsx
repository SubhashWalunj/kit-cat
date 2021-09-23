import React, { ReactElement } from 'react';


import './App.css';
import { Layout } from 'antd';
import { Content, Footer } from 'antd/lib/layout/layout';
import CatList from './components/cat-list/cat-list';
import { Redirect, Route, Switch } from 'react-router-dom';
import Navbar from './components/navbar/navbar';
import CatUpload from './components/cat-upload/cat-upload';

function App(): ReactElement {
  return (
    <Layout className="app-layout">
      <Navbar />
      <Content className="app-content">
        <Switch>
          <Route path="/" exact component={CatList} />
          <Route path="/upload" component={CatUpload} />
          <Redirect to="/" />
        </Switch>
      </Content>
      <Footer className="app-footer"><i>This is a demo app</i></Footer>
    </Layout>
  );
}

export default App;
