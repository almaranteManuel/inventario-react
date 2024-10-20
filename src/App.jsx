import React, { useState } from 'react';
import {
  BarsOutlined,
  CreditCardOutlined,
  TruckOutlined,
  ShoppingCartOutlined,
  BarChartOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { Layout, Menu, theme, ConfigProvider } from 'antd';
import { Link, HashRouter as Router, Route, Routes } from 'react-router-dom';
import Products from './pages/Products';
import Suppliers from './pages/Suppliers';
import Sales from './pages/Sales';
import Purchases from './pages/Purchases';
import Reports from './pages/Reports';
import Records from './pages/Records';
import locale from 'antd/es/locale/es_ES';
import 'moment/locale/es';

import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const { Header, Content, Sider } = Layout;

const siderStyle = {
  overflow: 'auto',
  height: '100vh',
  position: 'fixed',
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
};

// Función para crear ítems del menú
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem(<Link to="/Reports">Inicio</Link>, '1', <BarChartOutlined />),
  getItem(<Link to="/Products">Productos</Link>, '2', <BarsOutlined />),
  getItem(<Link to="/Suppliers">Proveedores</Link>, '3', <TruckOutlined />),
  getItem(<Link to="/Sales">Ventas</Link>, '4', <CreditCardOutlined />),
  getItem(<Link to="/Purchases">Compras</Link>, '5', <ShoppingCartOutlined />),
  getItem(<Link to="/Records">Notas/Recordatorios</Link>, '6', <CalendarOutlined />),
];

const App = () => {
  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <ConfigProvider locale={locale}>
      <Router>
        <Layout hasSider>
          {/* Sider (barra lateral) */}
          <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} style={siderStyle}>
            <div className="demo-logo-vertical" />
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
          </Sider>

          <Layout style={{ marginLeft: collapsed ? 80 : 200, minHeight: '100vh' }}>
            {/* Header */}
            <Header style={{ padding: 0, background: colorBgContainer }} />

            {/* Content principal */}
            <Content
              style={{
                background: colorBgContainer,
                flexGrow: 1,
              }}
            >
              {/* Rutas */}
              <Routes>
                <Route path="/" element={<Reports />} />
                <Route path="/Reports" element={<Reports />} />
                <Route path="/Products" element={<Products />} />
                <Route path="/Suppliers" element={<Suppliers />} />
                <Route path="/Sales" element={<Sales />} />
                <Route path="/Purchases" element={<Purchases />} />
                <Route path="/Records" element={<Records />} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </Router>
    </ConfigProvider>
  );
};

export default App;
